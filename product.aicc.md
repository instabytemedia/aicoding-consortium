---
aicc: "1.0"
kind: product-spec
id: org.aicodingconsortium.site
version: 1.0.0
conformance: strict
engines: [claude-code]
owner: wg-core
updated: 2026-07-24
context-exclude: ["*.lock"]
context-prime: ["README.md", "GOVERNANCE.md"]
---

# AI Coding Consortium Website

## Overview
The public website and reference tooling of the AI Coding Consortium: homepage,
technical reports, and the in-browser reference validator.

## Requirements
- [REQ-001] Every page MUST render correctly with no external dependency except Google Fonts.
- [REQ-002] The validator MUST implement the complete error taxonomy of AICC Core § 10.3.
- [REQ-003] Specification pages MUST carry a Status of This Document section.
- [REQ-004] All borders MUST use 50% grey, never white.
- [REQ-005] Pages SHOULD pass WCAG 2.1 AA contrast requirements.

## Non-Goals
- A server-side backend MUST NOT be introduced; the site stays static.

## Constraints <!-- @aicc:directives -->
- Engines MUST validate examples/product.aicc.md with the reference validator before committing changes to it.
- Engines MUST NOT modify published Technical Reports outside the errata process.
- Engines SHOULD keep all styling in each page's single embedded stylesheet.

## Glossary <!-- @aicc:informative -->
- **TR** — Technical Report, the consortium's publication unit.
