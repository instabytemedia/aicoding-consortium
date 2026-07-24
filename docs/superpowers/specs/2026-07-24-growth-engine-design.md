# Design: AICC Growth Engine + Full Roadmap Build-Out

Date: 2026-07-24 · Status: approved by user (conversation)

## Part 1 — Growth Engine

Mechanism-first adoption strategy modeled on what actually made W3C-era standards win:
consumer commitment (sitemap.xml/schema.org pattern), selfish adopter value (AEO — Agent
Engine Optimization), zero-friction tooling, badges (Valid-HTML pattern), public directory.

1. **Agent-Readiness Scanner** — `scanner.html` + Vercel function `api/scan.js`.
   Input origin → checks: agents.txt (well-known + root), adp.json (JSON + version),
   aix.json (entries), product.aicc.md, robots.txt, sitemap.xml, llms.txt (legacy signal),
   HTML link/meta signals, markdown content negotiation probe. Weighted score → grade A–F,
   per-check fix hints. Shareable via `?url=`. SSRF guards: https only, hostname/IP
   denylist (localhost, RFC1918, link-local), 5s timeout, 512KB cap, HEAD/GET only.
2. **Badges** — `badges.html` + `assets/badge-*.svg` (AICC READY, AIX INDEXED, grades A–F),
   copy-paste HTML/Markdown snippets linking to scanner results.
3. **Adopter Directory** — `adopters.html` + `registry/adopters.json`; entry via PR;
   "verified" = scanner grade ≥ B. Seeded with the consortium site.
4. **Launch Kit** — `docs/launch-kit.md`: Show HN, Reddit, X thread, dev.to outline,
   vendor outreach template.
5. **Growth Playbook** — `docs/growth-playbook.md`: 5 phases with KPIs
   (Foundation ✓ → Proof → Social Proof → Consumer Commitment → Institutionalization).

## Part 2 — Roadmap Build-Out (TR-009…TR-014)

Six Editor's Drafts, one per reserved stack layer, sharing `spec/spec.css`:

- TR-009 AQP — Agent Query Protocol: declared query endpoint (`query` member in adp.json),
  request/response schema, grounding citations (AIX chunk refs), fallback rules.
- TR-010 Chunk Addressing: full chunk model extracted from AIX §4 (id grammar, stability,
  hashing, citation format `url#id`, markdown slug algorithm).
- TR-011 Provenance & Freshness: `verified` timestamps, `source` classes, content signing
  envelope (detached sig over AIX §3.1 extraction), ai-generated labeling.
- TR-012 Crawl Economics: budget declaration in adp.json (`rate`, `batch`), HTTP 402 flow
  with `Agent-Price` header, receipts.
- TR-013 Agent Identity: `Agent-Attestation` header (signed profile URI + principal class),
  verification via registry-published keys, privacy rules (no user-identifying data).
- TR-014 AI Licensing Signals: `license` member per AIX entry + `Content-Usage` header
  (quote/process/train grants), interaction with existing licenses.

Each: abstract, status, 2–4 core normative sections, conformance, security, example.
Wire-up: stack.html statuses Roadmap → Editor's Draft (links), TR register, README, NEWS.

## Part 3 — Verification

10-expert panel workflow over the six drafts + scanner; apply critical/major findings;
conformance suite stays green; deploy + live smoke tests (scanner tested against own origin).
