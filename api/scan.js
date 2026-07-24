// AICC Agent-Readiness Scanner — Vercel serverless function.
// GET /api/scan?url=example.com → JSON report with grade A–F.
// SSRF-guarded: https only, public hostnames only, timeouts, size caps.

const TIMEOUT_MS = 5000;
const MAX_BYTES = 512 * 1024;

const PRIVATE_HOST = /^(localhost|127\.|10\.|192\.168\.|169\.254\.|0\.|\[?::1\]?$|172\.(1[6-9]|2\d|3[01])\.)/i;

async function probe(base, path, opts = {}) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(base + path, {
      redirect: "follow",
      signal: ctrl.signal,
      headers: { "user-agent": "aicc-scanner/1.0 (+https://aicoding-consortium.vercel.app/scanner.html)", ...(opts.headers || {}) },
    });
    let body = "";
    if (res.ok && opts.body !== false) {
      const reader = res.body.getReader();
      const chunks = [];
      let size = 0;
      while (size < MAX_BYTES) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        size += value.length;
      }
      reader.cancel().catch(() => {});
      body = Buffer.concat(chunks.map(c => Buffer.from(c))).toString("utf8");
    }
    return { ok: res.ok, status: res.status, body, contentType: res.headers.get("content-type") || "", headers: res.headers };
  } catch {
    return { ok: false, status: 0, body: "", contentType: "" };
  } finally {
    clearTimeout(t);
  }
}

export default async function handler(req, res) {
  res.setHeader("access-control-allow-origin", "*");
  res.setHeader("cache-control", "public, max-age=300");

  let raw = (req.query.url || "").trim();
  if (!raw) return res.status(400).json({ error: "missing ?url=" });
  if (!/^https?:\/\//i.test(raw)) raw = "https://" + raw;
  let u;
  try { u = new URL(raw); } catch { return res.status(400).json({ error: "invalid url" }); }
  if (u.protocol !== "https:") return res.status(400).json({ error: "https origins only" });
  if (PRIVATE_HOST.test(u.hostname) || !u.hostname.includes(".")) return res.status(400).json({ error: "public origins only" });
  const base = u.origin;

  const checks = [];
  const add = (id, name, points, max, detail, fix) => checks.push({ id, name, points, max, detail, fix });

  // 1. ADP policy file (agents.txt)
  const [wk, root] = await Promise.all([probe(base, "/.well-known/agents.txt"), probe(base, "/agents.txt")]);
  const agents = wk.ok && /Engine:/i.test(wk.body) ? wk : (root.ok && /Engine:/i.test(root.body) ? root : null);
  if (agents) add("agents", "agents.txt (ADP policy)", 25, 25, `found${wk.ok ? " at /.well-known/" : " at root"} — ${(agents.body.match(/^(Allow|Disallow):/gim) || []).length} policy line(s)`, null);
  else add("agents", "agents.txt (ADP policy)", 0, 25, "not found", "Publish /.well-known/agents.txt — 5 minutes, one text file. See ADP § 3.1.");

  // 2. ADP manifest
  const adp = await probe(base, "/.well-known/adp.json");
  let adpJson = null;
  try { adpJson = adp.ok ? JSON.parse(adp.body) : null; } catch {}
  if (adpJson && adpJson.adp) add("adp", "adp.json (machine manifest)", 15, 15, `ADP ${adpJson.adp}, ${(adpJson.policies || []).length} policy record(s)`, null);
  else add("adp", "adp.json (machine manifest)", 0, 15, "not found or invalid JSON", "Publish /.well-known/adp.json — the machine-grade policy. See ADP § 3.2.");

  // 3. AIX content index
  const aix = await probe(base, "/.well-known/aix.json");
  let aixJson = null;
  try { aixJson = aix.ok ? JSON.parse(aix.body) : null; } catch {}
  if (aixJson && aixJson.aix && Array.isArray(aixJson.entries)) add("aix", "aix.json (content index)", 25, 25, `AIX ${aixJson.aix}, ${aixJson.entries.length} entries indexed`, null);
  else add("aix", "aix.json (content index)", 0, 25, "not found or invalid", "Generate /.well-known/aix.json with the AICC index tool — agents skip unchanged content. See AIX 1.0.");

  // 4. Spec file
  const spec = await probe(base, "/product.aicc.md");
  if (spec.ok && /^---/.test(spec.body)) add("spec", "product.aicc.md (AICC spec)", 15, 15, "found with frontmatter", null);
  else add("spec", "product.aicc.md (AICC spec)", 0, 15, "not found", "Add a product.aicc.md so agents know what governs this origin. Validate it at /validator.html.");

  // 5. Markdown content negotiation
  const neg = await probe(base, "/", { headers: { accept: "text/markdown" } });
  if (/markdown/i.test(neg.contentType)) add("negotiate", "Markdown content negotiation", 10, 10, "origin serves text/markdown on request", null);
  else add("negotiate", "Markdown content negotiation", 0, 10, "origin serves HTML regardless of Accept header", "Serve a text/markdown representation on Accept: text/markdown (ADP § 9.1) — orders of magnitude fewer tokens per read.");

  // 6. Web baseline
  const [robots, sitemap] = await Promise.all([probe(base, "/robots.txt", { body: false }), probe(base, "/sitemap.xml", { body: false })]);
  const basePts = (robots.ok ? 3 : 0) + (sitemap.ok ? 2 : 0);
  add("baseline", "Web baseline (robots, sitemap)", basePts, 5, `robots.txt ${robots.ok ? "✓" : "✗"} · sitemap.xml ${sitemap.ok ? "✓" : "✗"}`, basePts === 5 ? null : "Serve robots.txt and sitemap.xml — the browser-web baseline still counts.");

  // 7. Legacy AI signals
  const llms = await probe(base, "/llms.txt", { body: false });
  if (llms.ok) add("legacy", "llms.txt (legacy AI signal)", 5, 5, "found — this origin already thinks about AI readers", null);
  else add("legacy", "llms.txt (legacy AI signal)", 0, 5, "not found", null);

  const points = checks.reduce((a, c) => a + c.points, 0);
  const max = checks.reduce((a, c) => a + c.max, 0);
  const pct = points / max;
  const grade = pct >= 0.9 ? "A" : pct >= 0.7 ? "B" : pct >= 0.5 ? "C" : pct >= 0.3 ? "D" : pct > 0.05 ? "E" : "F";

  return res.status(200).json({
    scanner: "aicc/1.0",
    origin: base,
    scanned: new Date().toISOString(),
    grade,
    points,
    max,
    checks,
  });
}
