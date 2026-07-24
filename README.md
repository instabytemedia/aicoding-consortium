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
| AICC-TR-005 | [AICC Interop Mappings 1.0](spec/interop-1.0.html) — translation tables + migration tool | Editor's Draft |
| AICC-TR-006 | [ADP — Agent Discovery & Policy 1.0](spec/adp-1.0.html) | Working Draft |
| AICC-TR-008 | [AIX — Agent Content Index 1.0](spec/aix-1.0.html) — the sitemap.xml successor for agents | Editor's Draft |
| AICC-TR-009…014 | Agent Query Protocol · Chunk Addressing · Provenance · Crawl Economics · Agent Identity · AI Licensing — see [The Agent Web Stack](stack.html) | Reserved |
| AICC-TR-002/003/004/007 | Frontmatter Schema · Conformance & Validation · Agent Directives · Media Type Registration (numbers reserved; content currently lives in TR-001/TR-006) | Reserved |

Community: [Agent-Readiness Scanner](scanner.html) · [Badges](badges.html) · [Adopter Directory](adopters.html) · [Growth Playbook](docs/growth-playbook.md)

See [NEWS.md](NEWS.md) for announcements and [PATENT-POLICY.md](PATENT-POLICY.md) for the RF patent policy.

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

You get the `aicc-markdown` skill (author, migrate, and consume AICC documents) plus three
commands: `/aicc-validate` (reference CLI validator), `/aicc-migrate` (legacy-file converter),
and `/aicc-index` (AIX generator, `plugins/aicc/scripts/aix.mjs`).

## Quick start

1. Copy [`examples/product.aicc.md`](examples/product.aicc.md) to your repository root as `product.aicc.md`.
2. Adapt frontmatter and requirements. One list item, one RFC-2119 keyword.
3. Check it with the [hosted validator](https://aicoding-consortium.vercel.app/validator.html) — or offline: `node plugins/aicc/scripts/validate.mjs product.aicc.md`.
4. Optionally publish [`examples/agents.txt`](examples/agents.txt) at your web origin.

## Licensing

- **Specifications** (`spec/`, `examples/`): text [CC-BY-4.0](LICENSE.md), patents under the AICC Royalty-Free Patent Policy ([GOVERNANCE.md](GOVERNANCE.md) § 4).
- **Code** (validator, site, tooling): [MIT](LICENSE.md).

## Governance

Specifications advance through four public maturity stages — Editor's Draft → Working Draft →
Candidate Recommendation → Recommendation — under working-group consensus with implementation
evidence. See [GOVERNANCE.md](GOVERNANCE.md).
