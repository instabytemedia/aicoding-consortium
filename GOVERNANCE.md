# AICC Governance

The AI Coding Consortium (AICC) is an independent standards body. It is funded by its members
and owned by no vendor. This document defines how the consortium works and how its
specifications advance.

## 1. Bodies

| Body | Role |
|---|---|
| **Steering Board** | Elected by Steering Members. Charters working groups, ratifies Recommendations, owns budget and trademark. |
| **Working Groups (WGs)** | Own specifications. Operate in public: public repositories, public minutes, public issue trackers. |
| **Advisory Assembly** | All members. Reviews Candidate Recommendations; can veto advancement with a ⅔ vote. |

### Standing Working Groups

- **WG-CORE** — Core Format: AICC Core, Frontmatter Schema (TR-001, TR-002)
- **WG-INTEROP** — Engine Interop: interop mappings, engine registry, ADP (TR-005, TR-006)
- **WG-CONF** — Conformance: validator, test suites, certification (TR-003)
- **WG-SEC** — Directive Safety: injection and privilege-escalation review of all TRs (TR-004 co-owner)

## 2. The AICC Process (maturity stages)

Every Technical Report (TR) advances through four public stages:

1. **Editor's Draft** — open exploration inside a WG. No standing.
2. **Working Draft** — published for community review. Breaking changes expected.
3. **Candidate Recommendation** — feature-frozen. Advancement requires **two independent,
   interoperable implementations** passing the conformance suite.
4. **Recommendation** — normative and versioned. Changes only via errata or a new Level.

Transitions require WG consensus, a public disposition of comments, and (for stage 4)
Steering Board ratification with no sustained Advisory Assembly veto.

## 3. Consensus and appeals

WGs decide by rough consensus, recorded in minutes. Any member may appeal a WG decision to the
Steering Board within 30 days; Board decisions are final and published with rationale.

## 4. Royalty-Free Patent Policy

- Specifications are published under **CC-BY-4.0**.
- Every working-group participant commits, as a condition of participation, to license all
  patent claims essential to implementing the specifications they contribute to on a
  royalty-free, irrevocable, worldwide basis (W3C-style RF licensing).
- Participants must disclose known essential claims during the review period of each maturity
  transition; undisclosed claims of a participant are automatically RF-licensed.
- An exclusion process (modeled on the W3C Patent Policy) lets a participant withdraw specific
  claims within 45 days of a Working Draft — at the cost of leaving the working group.
- Implementing any AICC specification requires no license or fee, forever.

## 5. Membership

| Tier | Rights |
|---|---|
| Individual Contributor | Free. WG participation, errata, test-suite contributions. |
| Corporate Member | WG seats, certification program access, roadmap input. |
| Steering Member | Board seat, ratification vote, trademark license for "AICC Certified". |

No tier buys a decision. Consensus and implementation evidence do.
