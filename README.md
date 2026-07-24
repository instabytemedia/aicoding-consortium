# AI Coding Consortium (AICC)

**The standards body for AI-readable specifications.**
One normative format for the markdown that drives every AI code engine.

CLAUDE.md, AGENTS.md, `.cursorrules`, scattered spec files — every engine invents its own dialect.
The AI Coding Consortium maintains **AICC Markdown**, the open, versioned,
machine-readable specification standard, and **ADP** (Agent Discovery & Policy), the discovery
and policy layer for the agent-native web. Write once. Parse everywhere.

> First conformance target: **Claude Code**. Designed to interoperate with Cursor, GitHub
> Copilot, Codex, Gemini CLI, Windsurf, and any engine — registered or reverse-DNS-identified.

## Technical Reports

| Series | Specification | Status |
|---|---|---|
| AICC-TR-001 | [AICC Core — Level 1.0](spec/aicc-core-1.0.html) — document model, frontmatter, taxonomy, keywords, directives, conformance | Candidate Recommendation |
| AICC-TR-005 | AICC Interop Mappings (to be split from Core § 11) | Editor's Draft |
| AICC-TR-006 | [ADP — Agent Discovery & Policy 1.0](spec/adp-1.0.html) | Working Draft |

## Repository layout

```
index.html            — consortium homepage
validator.html        — the official AICC validation service (runs in-browser)
spec/                 — published technical reports
examples/             — canonical, validator-clean example artifacts
registry/             — the AICC engine registry
GOVERNANCE.md         — the AICC process: how specs advance
CONTRIBUTING.md       — how to file errata and join working groups
```

## Claude Code plugin

This repository is an installable Claude Code plugin marketplace:

```
/plugin marketplace add instabytemedia/aicoding-consortium
/plugin install aicc
```

You get the `aicc-markdown` skill (author, migrate, and consume AICC documents) and the
`/aicc-validate` command backed by the reference CLI validator
(`plugins/aicc/scripts/validate.mjs`).

## Quick start

1. Copy [`examples/product.aicc.md`](examples/product.aicc.md) to your repository root as `product.aicc.md`.
2. Adapt frontmatter and requirements. One list item, one RFC-2119 keyword.
3. Check it with the [validator](validator.html).
4. Optionally publish [`examples/agents.txt`](examples/agents.txt) at your web origin.

## Licensing

- **Specifications** (`spec/`, `examples/`): text [CC-BY-4.0](LICENSE.md), patents under the AICC Royalty-Free Patent Policy ([GOVERNANCE.md](GOVERNANCE.md) § 4).
- **Code** (validator, site, tooling): [MIT](LICENSE.md).

## Governance

Specifications advance through four public maturity stages — Editor's Draft → Working Draft →
Candidate Recommendation → Recommendation — under working-group consensus with implementation
evidence. See [GOVERNANCE.md](GOVERNANCE.md).
