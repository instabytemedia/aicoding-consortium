---
description: Migrate CLAUDE.md / AGENTS.md / .cursorrules into a product.aicc.md draft
---

Migrate this repository's legacy engine instruction files to AICC Markdown.

Run: `node ${CLAUDE_PLUGIN_ROOT}/scripts/migrate.mjs $ARGUMENTS`
(default directory: current repo root; pass --id=com.example.myapp to set the document id)

Then: (1) show the generated product.aicc.md, (2) review each inferred MUST/SHOULD/MUST NOT
strength with the user — the tool infers them heuristically, (3) once confirmed, raise
`conformance` to `strict` and re-validate with `/aicc-validate`, (4) offer to slim the legacy
files down to pointers at the new canonical document.
