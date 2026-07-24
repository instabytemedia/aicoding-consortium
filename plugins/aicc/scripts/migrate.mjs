#!/usr/bin/env node
// AICC migration tool — converts legacy engine instruction files into a product.aicc.md draft.
// Usage: node migrate.mjs [repo-dir] [--id com.example.myapp] [--out product.aicc.md]
//
// Reads (whichever exist): CLAUDE.md, AGENTS.md, .cursorrules, .cursor/rules/*.mdc,
// .github/copilot-instructions.md, GEMINI.md, .windsurfrules
//
// The output is a DRAFT: keyword strengths are inferred heuristically and MUST be
// reviewed by a human before the document is treated as normative.
import { readFileSync, readdirSync, writeFileSync, existsSync } from "node:fs";
import { join, basename } from "node:path";
import { pathToFileURL } from "node:url";
import { validate } from "./validate.mjs";

const SOURCES = [
  "CLAUDE.md", "AGENTS.md", ".cursorrules", "GEMINI.md", ".windsurfrules",
  ".github/copilot-instructions.md",
];

function toDirective(item) {
  // rewrite the leading imperative so the RFC-2119 keyword carries the original polarity
  let m;
  if ((m = item.match(/^(?:never|do not|don't)\s+(.*)$/i)))
    return `Engines MUST NOT ${m[1]}`;
  if ((m = item.match(/^always\s+(.*)$/i)))
    return `Engines MUST ${m[1]}`;
  if ((m = item.match(/^(?:optionally|you may)\s+(.*)$/i)))
    return `Engines MAY ${m[1]}`;
  // generic imperative ("Use X", "Run Y") → default to SHOULD, lowercase the verb
  return `Engines SHOULD ${item.charAt(0).toLowerCase()}${item.slice(1)}`;
}

function hasKeyword(line) {
  return /\b(MUST NOT|SHALL NOT|SHOULD NOT|MUST|SHALL|SHOULD|MAY|REQUIRED|RECOMMENDED|OPTIONAL)\b/.test(line);
}

export function migrate(dir, opts = {}) {
  const found = [];
  for (const rel of SOURCES) {
    const p = join(dir, rel);
    if (existsSync(p)) found.push({ rel, text: readFileSync(p, "utf8") });
  }
  const mdcDir = join(dir, ".cursor", "rules");
  if (existsSync(mdcDir)) {
    for (const f of readdirSync(mdcDir).filter(f => f.endsWith(".mdc")).sort()) {
      found.push({ rel: `.cursor/rules/${f}`, text: readFileSync(join(mdcDir, f), "utf8") });
    }
  }
  if (found.length === 0) return { output: null, sources: [] };

  const constraints = [];
  const overview = [];
  for (const { rel, text } of found) {
    // strip legacy frontmatter blocks (e.g. .mdc files)
    let body = text.replace(/^---\n[\s\S]*?\n---\n/, "");
    let inFence = false;
    for (const raw of body.split("\n")) {
      if (/^ {0,3}(```|~~~)/.test(raw)) { inFence = !inFence; continue; }
      if (inFence) continue;
      const line = raw.trim();
      if (!line || line.startsWith("<!--")) continue;
      const bullet = line.match(/^(?:[-*+]|\d{1,3}[.)])\s+(.*)$/);
      if (bullet) {
        let item = bullet[1].trim();
        if (!item) continue;
        if (hasKeyword(item)) constraints.push({ text: `Engines ${item.replace(/^engines?\s+/i, "")}`, src: rel });
        else constraints.push({ text: `${toDirective(item.replace(/\.\s*$/, ""))}.`, src: rel });
      } else if (!line.startsWith("#")) {
        overview.push({ text: line, src: rel });
      }
    }
  }

  const id = opts.id || `com.example.${basename(process.cwd()).toLowerCase().replace(/[^a-z0-9-]/g, "-")}`;
  const today = opts.date || new Date().toISOString().slice(0, 10);
  const lines = [];
  lines.push("---");
  lines.push(`aicc: "1.0"`);
  lines.push(`kind: agent-config`);
  lines.push(`id: ${id}`);
  lines.push(`version: 0.1.0`);
  lines.push(`conformance: basic`);
  lines.push(`updated: ${today}`);
  lines.push("---");
  lines.push("");
  lines.push(`# ${opts.title || "Project Agent Configuration"}`);
  lines.push("");
  lines.push("## Overview <!-- @aicc:informative -->");
  lines.push(`Migrated from: ${found.map(f => f.rel).join(", ")}.`);
  lines.push("Keyword strengths below were inferred heuristically — review before treating as normative.");
  if (overview.length) {
    lines.push("");
    for (const o of overview.slice(0, 40)) lines.push(o.text);
  }
  lines.push("");
  lines.push("## Constraints <!-- @aicc:directives -->");
  let n = 0;
  for (const c of constraints) {
    n++;
    lines.push(`- [DIR-${String(n).padStart(3, "0")}] ${c.text}`);
  }
  if (n === 0) lines.push("- Engines SHOULD consult the Overview above; no explicit rules were found to migrate.");
  lines.push("");
  return { output: lines.join("\n"), sources: found.map(f => f.rel), constraints: n };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = process.argv.slice(2);
  const dir = args.find(a => !a.startsWith("--")) || ".";
  const id = (args.find(a => a.startsWith("--id")) || "").split("=")[1];
  const out = (args.find(a => a.startsWith("--out")) || "").split("=")[1] || "product.aicc.md";
  const { output, sources, constraints } = migrate(dir, { id });
  if (!output) { console.error("aicc migrate: no legacy instruction files found in " + dir); process.exit(2); }
  const { findings } = validate(output);
  const errors = findings.filter(f => f.sev === "error");
  writeFileSync(join(dir, out), output);
  console.log(`✓ wrote ${out} — migrated ${sources.length} file(s), ${constraints} directive(s), validator: ${errors.length} error(s)`);
  for (const f of errors) console.log(`  ${out}:${f.line} ${f.code} ${f.msg}`);
  console.log("Review the inferred MUST/SHOULD strengths, then raise conformance to 'strict'.");
}
