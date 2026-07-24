#!/usr/bin/env node
// AIX generator — builds /.well-known/aix.json for a static site directory (AICC-TR-008).
// Usage: node aix.mjs <site-dir> --origin=https://example.com [--out=.well-known/aix.json]
// Hash input follows AIX § 3.1: extracted text, whitespace-normalised.
import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync } from "node:fs";
import { join, relative, dirname, extname } from "node:path";
import { createHash } from "node:crypto";
import { pathToFileURL } from "node:url";

const SKIP_DIRS = new Set(["node_modules", ".git", ".vercel", "assets", ".github", ".claude-plugin", "conformance", "docs"]);
const INDEXABLE = new Set([".html", ".md"]);

export function extractText(source, ext) {
  let text = source;
  if (ext === ".html") {
    text = text
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/<[^>]+>/g, " ");
    text = text.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ");
  }
  return text.replace(/\s+/g, " ").trim();
}

export function entryFor(file, root, ext) {
  const source = readFileSync(file, "utf8");
  const text = extractText(source, ext);
  const hash = "sha256-" + createHash("sha256").update(text, "utf8").digest("hex");
  const tokens = Math.round(text.length / 4);
  let title = relative(root, file);
  const t = source.match(/<title>([^<]+)<\/title>/i) || source.match(/^#\s+(.+)$/m);
  if (t) title = t[1].trim();
  const summary = (source.match(/<meta name="description" content="([^"]+)"/i)?.[1]
    || text.slice(0, 240)).slice(0, 280);
  const mtime = statSync(file).mtime.toISOString().slice(0, 10);
  const rel = "/" + relative(root, file).replace(/\\/g, "/");
  const type = /ugc|comments/.test(rel) ? "ugc" : ext === ".md" ? "docs" : /spec\//.test(rel) ? "docs" : "article";
  return { url: rel, title, summary, hash, tokens, updated: mtime, type };
}

export function generate(root, origin) {
  const entries = [];
  const walk = (dir) => {
    for (const name of readdirSync(dir).sort()) {
      const p = join(dir, name);
      const st = statSync(p);
      if (st.isDirectory()) { if (!SKIP_DIRS.has(name) && !name.startsWith(".")) walk(p); continue; }
      const ext = extname(name);
      if (INDEXABLE.has(ext)) entries.push(entryFor(p, root, ext));
    }
  };
  walk(root);
  return { aix: "1.0", origin, generated: new Date().toISOString(), entries };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = process.argv.slice(2);
  const dir = args.find(a => !a.startsWith("--")) || ".";
  const origin = (args.find(a => a.startsWith("--origin=")) || "").split("=")[1];
  const out = (args.find(a => a.startsWith("--out=")) || "").split("=")[1] || join(dir, ".well-known", "aix.json");
  if (!origin) { console.error("aix: --origin=https://example.com is required"); process.exit(2); }
  const index = generate(dir, origin);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, JSON.stringify(index, null, 2) + "\n");
  const total = index.entries.reduce((a, e) => a + e.tokens, 0);
  console.log(`✓ wrote ${out} — ${index.entries.length} entries, ~${total.toLocaleString("en-US")} tokens indexed`);
}
