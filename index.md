# AI Coding Consortium (AICC)

> The standards body for AI-readable specifications and the agent-native web.
> One normative format for the markdown that drives every AI code engine — plus the
> discovery, policy, indexing and efficiency layers agents need to read the web cheaply.

## Standards (Technical Reports)

- [AICC Core 1.0](/spec/aicc-core-1.0.html) — Candidate Recommendation. Document model,
  typed frontmatter, RFC-2119 requirement keywords, requirement IDs, context directives
  (context-exclude/context-prime), conformance classes, error taxonomy E101–E502.
- [ADP 1.0](/spec/adp-1.0.html) — Working Draft. agents.txt, /.well-known/adp.json,
  action classes read→propose→write→execute, HTTP signalling, Level 1.1 efficiency preview.
- [AIX 1.0](/spec/aix-1.0.html) — Editor's Draft. Content index: per-URL summary, SHA-256
  hash, token cost, chunks → differential crawling.
- [Interop Mappings 1.0](/spec/interop-1.0.html) — Editor's Draft. AICC ↔ CLAUDE.md,
  AGENTS.md, .cursor/rules, copilot-instructions.md.
- Stack drafts (Editor's Drafts): [AQP](/spec/aqp-1.0.html), [Chunk Addressing](/spec/chunks-1.0.html),
  [Provenance](/spec/provenance-1.0.html), [Crawl Economics](/spec/economics-1.0.html),
  [Agent Identity](/spec/identity-1.0.html), [AI Licensing Signals](/spec/licensing-1.0.html).

## Tools

- [Spec Validator](/validator.html) — validate .aicc.md documents in-browser (error codes E101–E502).
- [Agent-Readiness Scanner](/scanner.html) — grade any origin A–F (`/api/scan?url=`).
- Claude Code plugin: `/plugin marketplace add instabytemedia/aicoding-consortium` → `/plugin install aicc`
  (skill aicc-markdown, commands /aicc-validate, /aicc-migrate, /aicc-index).

## Machine endpoints on this origin

- /.well-known/agents.txt — ADP policy (read+propose allowed; write/execute disallowed)
- /.well-known/adp.json — machine manifest
- /.well-known/aix.json — AIX content index (differential crawling)
- /product.aicc.md — the spec governing this origin

## Governance

Maturity stages Editor's Draft → Working Draft → Candidate Rec. → Recommendation; four working
groups; CC-BY-4.0 text + royalty-free patent policy. Repo:
https://github.com/instabytemedia/aicoding-consortium
