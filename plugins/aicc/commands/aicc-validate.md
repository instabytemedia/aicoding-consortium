---
description: Validate an AICC Markdown document against AICC Core 1.0
---

Validate the AICC Markdown document at the path given in $ARGUMENTS (default: ./product.aicc.md).

Run: `node ${CLAUDE_PLUGIN_ROOT}/scripts/validate.mjs <path>`

Report the verdict (claimed vs achieved class), then each finding with its error code,
line number and the fix. If the document does not exist, offer to scaffold one from the
canonical template in the aicc-markdown skill.
