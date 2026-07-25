# AICC Monetization Plan

Constraint that makes everything else work: **the standards, validators, and scanner stay free
forever.** Standards bodies monetize trust and services around a free core — never the spec
itself (W3C, USB-IF, Linux Foundation all follow this shape). Charging for the core kills
adoption, and adoption is the asset.

## Revenue streams, in launch order

### 1. Scanner Monitoring (first revenue, lowest lift)
The free scanner is a one-shot check. The paid layer is continuity:
- **AICC Watch** (~19–49 €/mo per origin): scheduled re-scans, alerts on grade drops,
  agent-readiness history, badge auto-verification, API access, team dashboards.
- Buyer: the site owner who just framed their grade-A badge. The SSL-Labs→commercial pattern.
- Build: cron + the existing /api/scan + a results store. Weeks, not months.

### 2. Certification Program ("AICC Certified")
- Per-product certification against the conformance suite: engines, CMS plugins, site
  generators. Annual fee (tiered by company size, e.g. 1k–15k €/yr) for the right to carry
  the mark; testing itself is automated and cheap for us.
- Buyer: vendors who need to prove interop ("USB-IF model"). Unlocks when 2+ engines adopt.

### 3. Corporate & Steering Membership
- Tiers already defined in GOVERNANCE.md: Individual (free, forever), Corporate (WG seats,
  certification bundle, e.g. 5k €/yr), Steering (board seat, roadmap vote, e.g. 25–50k €/yr).
- Buyer: engine vendors and platforms once the standard has gravity. This is the long-term
  backbone (it's how W3C is funded) but it monetizes *last* — membership is worthless until
  the standard matters.

### 4. AEO Partner Program
- Agencies/consultancies get trained + listed as certified implementers ("make your clients
  agent-ready"); listing + training fee. We never do implementation work ourselves — the
  partner network scales adoption *and* pays us.

### 5. Registry Services (later, TR-013 era)
- Verified engine-registry entries and attestation-key hosting as a paid tier for commercial
  engines (free tier always exists — neutrality is the moat).

## What we never sell
- Spec access, validator, basic scanner, directory listing, or favorable treatment in any
  spec decision. One pay-for-outcome scandal ends a standards body.

## Sequencing against the Growth Playbook
- Phase 1–2 (Proof, Social Proof): everything free; build the funnel. Optional: pre-launch
  waitlist for AICC Watch.
- Phase 2→3: launch **AICC Watch** (needs only adopters, not vendors).
- Phase 3 (Consumer Commitment): launch **Partner Program** (demand for implementation
  appears the day one engine honors the formats).
- Phase 4 (Institutionalization): launch **Certification** and **Membership** — now the mark
  and the seat are worth money.

## Honest numbers frame
100 Watch subscribers ≈ 3–5k €/MRR (covers infra + tools). 10 corporate members ≈ 50k €/yr
(part-time staff). Certification at scale is where standards bodies become institutions —
that requires Phase 4. This plan funds the journey; it does not pretend the journey is done.
