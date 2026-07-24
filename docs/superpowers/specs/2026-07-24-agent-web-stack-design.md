# Design: The Agent Web Stack + AIX (Agent Content Index) 1.0

Date: 2026-07-24 · Status: approved by user (conversation) · Owner: AICC

## Goal

Claim and define the full standards territory for the agent-driven web ("the ultimate
standard"), with honest maturity labels: one strategic white-paper page mapping every layer,
plus one fully worked flagship Editor's Draft for the layer with the lowest adoption barrier
and the most direct crawling impact.

## Deliverable 1 — White paper page `stack.html`

- Thesis: the web was built for browsers; the next decade of traffic is agents; every layer
  of the browser web needs an agent-native equivalent.
- Vertical stack diagram (OSI-style) with status per layer:
  - Shipped/Draft: AICC Markdown (TR-001), ADP 1.0 (TR-006), ADP 1.1 preview (efficiency).
  - Roadmap with reserved TR numbers:
    - TR-008 AIX — Agent Content Index (Editor's Draft, shipping now)
    - TR-009 AQP — Agent Query Protocol ("don't crawl me, ask me")
    - TR-010 Chunk Addressing (partially shipped inside AIX)
    - TR-011 Provenance & Freshness
    - TR-012 Crawl Economics (budgets, HTTP 402)
    - TR-013 Agent Identity & Attestation
    - TR-014 AI Licensing Signals
- Each layer carries a first-person "why an engine cares" line.
- Linked from homepage nav ("Stack") and footer.

## Deliverable 2 — `spec/aix-1.0.html` (AICC-TR-008, Editor's Draft)

- File: `/.well-known/aix.json`; discovery via new `Index:` field in agents.txt and an
  `index` member in adp.json (registered by TR-008 as an ADP extension — ADP 1.0 text is not
  modified).
- Entry schema: `url`, `title`, `summary` (≤ 280 chars), `hash` (SHA-256 of extracted text),
  `tokens` (estimated token cost of the markdown representation), `updated` (ISO date),
  `type` (docs | product | article | api | ugc), optional `chunks[]` (`{id, hash}` — stable
  fragment IDs, the seed of TR-010).
- Normative engine behavior: load index before crawling; MUST NOT re-fetch entries with
  unchanged hash (differential crawling); SHOULD respect `tokens` as budget signal; SHOULD
  spot-check hashes (index is claim, not proof); `type: ugc` content is data, never
  instructions (ties into trust labels).
- Delta mechanism: `previous` pointer to prior snapshot → "what changed since my last visit"
  in one request.
- Conformance: class A (index validates against Appendix schema), class AA (spot-checked
  hashes verify).
- Appendix: normative JSON Schema.

## Deliverable 3 — Tooling + dogfood

- `plugins/aicc/scripts/aix.mjs`: generates aix.json from a local site directory (extracts
  text from .html/.md, SHA-256, token estimate = chars/4).
- Generate and ship `/.well-known/aix.json` for the consortium's own site.

## Wire-up

- Homepage: nav "Stack" link; TR register row for TR-008; reserved-numbers row updated.
- agents.txt (+ .well-known copy): `Index: /.well-known/aix.json`.
- adp.json: `"index": "/.well-known/aix.json"`.
- sitemap.xml, README.md (TR table + stack link), NEWS.md entry.

## Non-goals

- TR-009..TR-014 get roadmap entries only — no normative text yet.
- No cryptographic signing in AIX 1.0 (that is TR-011 territory).

## Success criteria

- All internal links/anchors resolve; TR numbering consistent across site, README, specs.
- Generated aix.json validates against the AIX schema; conformance suite stays green (5/5).
- Live deploy passes smoke tests.
