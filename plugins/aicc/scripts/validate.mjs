#!/usr/bin/env node
// AICC Markdown reference validator (CLI) — implements AICC Core 1.0 § 10.3
// Usage: node validate.mjs <file.aicc.md>
import { readFileSync, existsSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { resolve, dirname } from "node:path";

const KIND_ENUM = ["product-spec","feature-spec","agent-config","architecture","constraint-set"];
const CONF_ENUM = ["basic","strict"];
const KNOWN_KEYS = ["aicc","kind","id","version","conformance","engines","extends","scope","owner","updated","context-exclude","context-prime"];
const CANONICAL = { overview:"informative", requirements:"normative", constraints:"directives", architecture:"informative", interfaces:"normative", "non-goals":"normative", glossary:"informative" };
const REQUIRED_SECTIONS = { "product-spec":["overview","requirements"], "feature-spec":["overview","requirements"], "agent-config":["constraints"], "constraint-set":["constraints"], architecture:[] };
const ANNOTATIONS = ["normative","informative","directives","example","deprecated"];
const KW_RE = /\b(MUST NOT|SHALL NOT|SHOULD NOT|MUST|SHALL|SHOULD|MAY|REQUIRED|RECOMMENDED|OPTIONAL)\b/g;

export function validate(text) {
  const findings = [];
  const err  = (code, line, msg) => findings.push({ code, sev: "error", line, msg });
  const warn = (code, line, msg) => findings.push({ code, sev: "warning", line, msg });
  const lines = text.replace(/\r\n/g, "\n").split("\n");

  if (lines[0] !== "---") { err("E101", 1, "Document must begin with a '---' frontmatter block as its first bytes."); return { findings, strictViolations: 0 }; }
  let fmEnd = -1;
  for (let i = 1; i < lines.length; i++) if (lines[i] === "---") { fmEnd = i; break; }
  if (fmEnd === -1) { err("E101", 1, "Frontmatter block is never closed."); return { findings, strictViolations: 0 }; }

  const fm = {};
  for (let i = 1; i < fmEnd; i++) {
    const raw = lines[i];
    if (!raw.trim() || raw.trim().startsWith("#")) continue;
    const m = raw.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!m) { err("E104", i + 1, `Line is outside the Level 1.0 YAML subset: "${raw.trim()}"`); continue; }
    if (m[2].trim() === "") { err("E104", i + 1, `Key '${m[1]}' has no inline value — block constructs are outside the Level 1.0 subset.`); continue; }
    let val = m[2].trim();
    if (val.startsWith("[") && val.endsWith("]")) val = val.slice(1, -1).split(",").map(s => s.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
    else val = val.replace(/^["']|["']$/g, "");
    fm[m[1]] = { value: val, line: i + 1 };
  }

  for (const k of ["aicc","kind","id","version"]) if (!(k in fm)) err("E102", 1, `Required frontmatter key '${k}' is missing.`);
  if (fm.aicc && !/^1\.[0-9]+$/.test(fm.aicc.value)) err("E102", fm.aicc.line, `'aicc' must declare a 1.x level (got "${fm.aicc.value}").`);
  if (fm.kind && !KIND_ENUM.includes(fm.kind.value)) err("E102", fm.kind.line, `'kind' must be one of ${KIND_ENUM.join(", ")}.`);
  if (fm.id && !/^[a-z0-9]+(\.[a-z0-9-]+)+$/.test(fm.id.value)) err("E102", fm.id.line, `'id' must be a reverse-DNS identifier.`);
  if (fm.version && !/^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?(\+[0-9A-Za-z.-]+)?$/.test(fm.version.value)) err("E102", fm.version.line, `'version' must be SemVer 2.0.0.`);
  if (fm.conformance && !CONF_ENUM.includes(fm.conformance.value)) err("E102", fm.conformance.line, `'conformance' must be 'basic' or 'strict'.`);
  if (fm.updated && !/^\d{4}-\d{2}-\d{2}$/.test(fm.updated.value)) err("E102", fm.updated.line, `'updated' must be YYYY-MM-DD.`);
  for (const k of Object.keys(fm)) if (!KNOWN_KEYS.includes(k) && !k.startsWith("x-")) err("E103", fm[k].line, `Unknown top-level key '${k}' ('x-' prefix required for extensions).`);
  for (const key of ["scope","context-exclude","context-prime"]) {
    if (!fm[key]) continue;
    const globs = Array.isArray(fm[key].value) ? fm[key].value : [fm[key].value];
    for (const g of globs) if (g.startsWith("/") || g.includes("..")) err("E502", fm[key].line, `'${key}' glob "${g}" must be repository-relative and must not escape the root.`);
  }
  if (fm["context-prime"] && Array.isArray(fm["context-prime"].value) && fm["context-prime"].value.length > 8) err("E102", fm["context-prime"].line, `'context-prime' maximum is 8 paths.`);
  if (fm.extends && typeof fm.extends.value === "string") {
    const v = fm.extends.value;
    if (v.startsWith("/") || /^[a-z][a-z0-9+.-]*:/i.test(v)) err("E501", fm.extends.line, `'extends' must be a repository-relative path — absolute paths and URLs are forbidden (§ 8.2 trust boundary).`);
    else if (v.includes("..")) warn("E501", fm.extends.line, `'extends' uses '..' — cannot verify it stays inside the repository root in single-file mode.`);
  }

  const sections = [];
  let cur = null, inFence = false, fenceChar = "", fenceLen = 0, inComment = false;
  for (let i = fmEnd + 1; i < lines.length; i++) {
    const ln = lines[i];
    const fk = ln.match(/^ {0,3}(`{3,}|~{3,})/);
    if (fk && !inComment) {
      if (!inFence) { inFence = true; fenceChar = fk[1][0]; fenceLen = fk[1].length; continue; }
      if (fk[1][0] === fenceChar && fk[1].length >= fenceLen) { inFence = false; continue; }
    }
    if (inFence) continue;
    /* multi-line HTML comment spans: content is dead text, never live sections */
    if (inComment) { if (ln.includes("-->")) inComment = false; continue; }
    if (ln.includes("<!--") && !ln.includes("-->")) { inComment = true; continue; }
    /* annotations on non-level-2 headings are E401 (§ 7) */
    if (/^#{1,6}\s/.test(ln) && !/^##[^#]/.test(ln) && /@aicc:[a-z-]+/.test(ln)) {
      err("E401", i + 1, "Annotations attach only to '##' headings (§ 7).");
    }
    const h = ln.match(/^##\s+([^#].*?)\s*(<!--.*-->)?\s*$/);
    if (h) {
      const name = h[1].trim();
      const canon = name.toLowerCase().replace(/\s+/g, "-");
      cur = { name, canon, line: i + 1, cls: CANONICAL[canon] || null, items: [], annotated: false };
      sections.push(cur);
      const annHere = (h[2] || "").match(/@aicc:([a-z-]+)/);
      let annNext = null;
      if (!annHere && lines[i + 1]) { const nm = lines[i + 1].match(/^\s*<!--\s*@aicc:([a-z-]+)([^>]*)-->\s*$/); if (nm) annNext = nm; }
      const ann = annHere ? annHere[1] : (annNext ? annNext[1] : null);
      if (ann && ANNOTATIONS.includes(ann)) { cur.annotated = true; cur.cls = ann === "deprecated" ? "deprecated" : ann; }
      continue;
    }
    const stray = ln.match(/^\s*<!--\s*@aicc:([a-z-]+)([^>]*)-->\s*$/);
    if (stray) {
      const prev = (lines[i - 1] || "");
      const attached = /^##[^#]/.test(prev.trim());
      if (!attached && ANNOTATIONS.includes(stray[1])) err("E401", i + 1, `Annotation '@aicc:${stray[1]}' must appear on, or immediately after, a '##' heading.`);
      continue;
    }
    /* the first list item of a section sets the top-level indent; deeper items elaborate (§ 6.1) */
    const li = cur && ln.match(/^(\s*)(?:[-*+]|\d{1,3}[.)])\s+(.*)$/);
    if (li) {
      const indent = li[1].length;
      if (cur.topIndent === undefined && indent <= 3) cur.topIndent = indent;
      if (cur.topIndent !== undefined && indent <= cur.topIndent) {
        let text = li[2], rid = null;
        const idm = text.match(/^\[([A-Z][A-Z0-9]{0,7}-[0-9]{1,5})\]\s*/);
        if (idm) { rid = idm[1]; text = text.slice(idm[0].length); }
        cur.items.push({ line: i + 1, text, rid });
      } else {
        cur.nested = (cur.nested || []).concat([{ line: i + 1, text: li[2] }]);
      }
    }
  }

  const kind = fm.kind ? fm.kind.value : null;
  if (kind && REQUIRED_SECTIONS[kind]) for (const req of REQUIRED_SECTIONS[kind])
    if (!sections.some(s => s.canon === req)) err("E201", 1, `Documents of kind '${kind}' must contain '## ${req[0].toUpperCase() + req.slice(1)}'.`);

  const strict = fm.conformance && fm.conformance.value === "strict";
  let strictViolations = 0;
  const seenIds = new Set();
  for (const s of sections) {
    const isNormative = s.cls === "normative" || s.cls === "directives";
    if (isNormative) {
      const withId = s.items.filter(it => it.rid).length;
      for (const it of s.items) {
        const n = (it.text.match(KW_RE) || []).length;
        if (n !== 1) {
          strictViolations++;
          const msg = n === 0 ? `Requirement in '## ${s.name}' contains no RFC-2119 keyword.` : `Requirement in '## ${s.name}' contains ${n} RFC-2119 keywords — exactly one is allowed.`;
          (strict ? err : warn)("E301", it.line, msg);
        }
        if (it.rid) {
          if (seenIds.has(it.rid)) { strictViolations++; (strict ? err : warn)("E303", it.line, `Duplicate requirement identifier [${it.rid}].`); }
          seenIds.add(it.rid);
        }
      }
      if (withId > 0 && withId < s.items.length) { strictViolations++; (strict ? err : warn)("E303", s.line, `'## ${s.name}' mixes identified and unidentified requirements.`); }
      for (const nit of (s.nested || [])) {
        if ((nit.text.match(KW_RE) || []).length > 0) { strictViolations++; (strict ? err : warn)("E301", nit.line, `Nested list item in '## ${s.name}' contains an RFC-2119 keyword — nested items elaborate and must not carry keywords (§ 6.1).`); }
      }
    } else {
      for (const it of s.items) if ((it.text.match(KW_RE) || []).length > 0) warn("E302", it.line, `RFC-2119 keyword in non-normative section '## ${s.name}'.`);
    }
    if (!CANONICAL[s.canon] && !s.annotated) {
      strictViolations++;
      if (strict) err("E202", s.line, `Class 'strict' requires an explicit @aicc annotation on non-canonical section '## ${s.name}'.`);
    }
  }
  return { findings, fm, strictViolations };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const file = process.argv[2] || "product.aicc.md";
  let text;
  try { text = readFileSync(file, "utf8"); }
  catch { console.error(`aicc: cannot read ${file}`); process.exit(2); }
  const { findings, fm, strictViolations } = validate(text);
  if (fm && fm.extends && typeof fm.extends.value === "string" && !/^[a-z][a-z0-9+.-]*:/i.test(fm.extends.value) && !fm.extends.value.startsWith("/")) {
    const target = resolve(dirname(resolve(file)), fm.extends.value);
    if (!existsSync(target)) findings.push({ code: "E501", sev: "error", line: fm.extends.line, msg: `'extends' target not found: ${fm.extends.value}` });
  }
  const errors = findings.filter(f => f.sev === "error").length;
  const warnings = findings.filter(f => f.sev === "warning").length;
  /* achieved class is claim-independent (§ 10.1): evaluate each class's check set */
  const coreErrors = findings.filter(f => f.sev === "error" && !["E301","E202","E303"].includes(f.code)).length;
  const strictWarnings = findings.filter(f => f.sev === "warning" && f.code === "E302").length;
  const claimed = fm && fm.conformance && CONF_ENUM.includes(fm.conformance.value) ? fm.conformance.value : "basic";
  const achieved = coreErrors > 0 ? "—" : (strictViolations === 0 && strictWarnings === 0 ? "AA (strict)" : "A (basic)");
  for (const f of findings.sort((a, b) => a.line - b.line))
    console.log(`${file}:${f.line} ${f.sev.toUpperCase()} ${f.code} ${f.msg}`);
  console.log(`${errors === 0 ? "✓ CONFORMS" : "✗ DOES NOT CONFORM"} · AICC/1.0 · claimed: ${claimed} · achieved: ${achieved} · ${errors} error(s) · ${warnings} warning(s)`);
  process.exit(errors === 0 ? 0 : 1);
}
