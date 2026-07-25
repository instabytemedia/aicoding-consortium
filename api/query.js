// AQP 1.0 (AICC-TR-009) reference endpoint — answers questions over this origin's AIX index.
import { readFileSync } from "node:fs";
import { join } from "node:path";

export default async function handler(req, res) {
  res.setHeader("access-control-allow-origin", "*");
  const q = ((req.method === "POST" ? req.body?.query : req.query.q) || "").toString().slice(0, 300);
  if (!q) return res.status(400).json({ aqp: "1.0", error: "missing query (POST {query} or GET ?q=)" });
  const idx = JSON.parse(readFileSync(join(process.cwd(), ".well-known", "aix.json"), "utf8"));
  const terms = q.toLowerCase().split(/\W+/).filter(t => t.length > 2);
  const scored = idx.entries.map(e => {
    const hay = (e.title + " " + e.summary + " " + e.url).toLowerCase();
    const score = terms.reduce((s, t) => s + (hay.includes(t) ? 1 : 0), 0);
    return { e, score };
  }).filter(x => x.score > 0).sort((a, b) => b.score - a.score).slice(0, 3);
  const answers = scored.map(({ e }) => ({
    text: `${e.title}: ${e.summary}`,
    citations: [`https://aicoding-consortium.vercel.app${e.url}#top@${e.hash.slice(7, 19)}`],
  }));
  return res.status(200).json({
    aqp: "1.0",
    query: q,
    answers,
    coverage: answers.length ? (answers.length >= 2 ? "full" : "partial") : "none",
  });
}
