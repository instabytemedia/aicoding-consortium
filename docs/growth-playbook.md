# AICC Growth Playbook

How standards actually win, applied. The through-line: **standards follow implementations,
and adoption follows consumer commitment.** Nobody adopted sitemap.xml because it was elegant;
they adopted it the day Google said "we read this."

## The narrative: AEO

The public story is never "help the agents." It is **Agent Engine Optimization**: AI agents
are becoming the web's biggest readers. Origins they can read cheaply get found, quoted, and
transacted with; origins they can't are invisible. agents.txt + aix.json is to 2026 what
sitemap.xml + robots.txt was to 2005. Every artifact we ship reinforces this selfish reason
to adopt.

## Phase 0 — Foundation ✓ (done)

Specs (TR-001…TR-008), two interoperable validators, conformance suite, plugin, migration
tool, dogfooded site. KPI: everything a skeptic checks in the first 10 minutes holds up.

## Phase 1 — Proof

- **Benchmark report**: measure real token cost of common agent tasks (read docs site,
  answer a question, check for changes) with and without AIX/markdown negotiation on 10
  popular sites. Publish the numbers; numbers travel further than arguments.
- **Scanner launch**: the shareable artifact. SSL-Labs mechanics — grades get screenshotted,
  compared, defended.
- KPI: first 1,000 scans; benchmark cited by a third party.

## Phase 2 — Social Proof

- **Badges** (the Valid-HTML play) + **adopter directory** (permanent "since" dates reward
  moving early).
- **First 100 adopters**: personally recruit developer-tool sites, docs platforms, OSS
  projects — the origins agents already read most.
- Launch content per docs/launch-kit.md (Show HN, r/ClaudeAI, r/webdev, X, dev.to).
- KPI: 100 directory entries; badges spotted in the wild without prompting.

## Phase 3 — Consumer Commitment (the sitemap moment)

The single most important milestone: **one engine publicly commits to honoring the stack**
("Claude Code reads agents.txt/aix.json and skips your context-exclude"). The moment reading
the formats is real, publishing them stops being altruism. Then a second engine follows for
competitive reasons — that is the flywheel.

- Vendor path: plugin proves it → community demand ("why doesn't X honor aix.json?") →
  official support.
- KPI: one engine announcement; a second implementation passing the engine test vectors.

## Phase 4 — Institutionalization

Working groups with real members, TR-001 to Recommendation (needs the two implementations),
domain + org neutrality, liaison with IETF/W3C where layers touch (media types, well-known
URIs, HTTP fields). KPI: a standard nobody can afford to ignore — or fork.

## Principles

1. Mechanism over persuasion — ship loops, not pitches.
2. Selfish value on day one — every artifact must pay off with zero other adopters.
3. Radical verifiability — every claim one click from proof (scanner, validator, suite).
4. Neutrality is the moat — first conformance target ≠ owner; rivals must be able to join
   without swallowing pride.
5. Honest maturity labels — Editor's Draft means Editor's Draft; credibility compounds.
