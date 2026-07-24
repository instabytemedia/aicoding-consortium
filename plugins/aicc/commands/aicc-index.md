---
description: Generate /.well-known/aix.json (AIX Agent Content Index) for a static site
---

Generate an AIX content index (AICC-TR-008) for the site directory in $ARGUMENTS
(default: current directory). The origin URL is required — ask the user if unknown.

Run: `node ${CLAUDE_PLUGIN_ROOT}/scripts/aix.mjs <dir> --origin=<https-origin>`

Then: (1) show the entry count and total indexed tokens, (2) review the generated summaries
with the user — summaries should tell an agent what a page contains, not market it,
(3) remind the user to regenerate the index on every deploy (add it to their build step),
and to declare it via `Index: /.well-known/aix.json` in agents.txt.
