---
aicc: "1.0"
kind: product-spec
id: com.example.checkout
version: 2.3.0
conformance: strict
engines: [claude-code, cursor]
scope: ["src/checkout/**"]
owner: payments-team
updated: 2026-07-24
context-exclude: ["dist/**", "node_modules/**", "*.lock", "fixtures/**"]
context-prime: ["README.md", "src/checkout/index.ts"]
---

# Checkout Service

## Overview
Handles cart-to-payment conversion for all storefronts.
Talks to the PSP via the payments gateway; never directly.

## Requirements
- [REQ-001] Payments MUST be idempotent per order id.
- [REQ-002] The API MUST NOT expose card data in any response or log.
- [REQ-003] Checkout MUST complete in under 2 s at p95.
- [REQ-004] Retries SHOULD use exponential backoff with jitter.
- [REQ-005] Currencies other than EUR MAY be rejected in v2.

## Non-Goals
- [NG-001] Subscription billing MUST NOT be implemented in this service.

## Constraints <!-- @aicc:directives -->
- [DIR-001] Engines MUST run `pnpm test --filter checkout` before proposing a commit.
- [DIR-002] Engines MUST NOT modify files under `migrations/`.
- [DIR-003] Engines SHOULD keep functions under 40 lines.

## Glossary <!-- @aicc:informative -->
- **PSP** — Payment Service Provider.
