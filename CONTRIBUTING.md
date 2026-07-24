# Contributing to AICC

Everything the consortium does is public. There are four ways in, in ascending order of commitment.

## 1. File errata

Found an error, ambiguity, or contradiction in a published Technical Report?
Open an issue titled `[TR-00X] <short description>` describing:

- the section (e.g. "AICC Core § 8.2"),
- what the text says,
- why it is wrong or ambiguous,
- proposed replacement text (optional but accelerates everything).

Editorial errata (typos, broken links) are merged directly. Substantive errata are triaged by
the owning working group in its public minutes.

## 2. Propose a change to a spec

Working Drafts and Editor's Drafts take substantive proposals as pull requests:

1. One proposal per PR. Normative text changes must use RFC-2119 keywords correctly.
2. State the problem before the solution — PRs that only contain text changes without a
   problem statement are returned.
3. Every new normative requirement must be machine-checkable or carry a rationale for why it
   cannot be.
4. Breaking changes to a Candidate Recommendation are out of scope; propose them against the
   next Level instead.

## 3. Contribute to the conformance suite

The validator and test suites are the standard's teeth. New test cases (valid documents,
invalid documents with expected error codes) are the highest-leverage contribution and are
reviewed by WG-CONF within two weeks.

## 4. Join a working group

Individual participation is free (see GOVERNANCE.md § 5). Introduce yourself on the WG's
issue tracker, attend one call, and an editor will add you to the roll.

## Ground rules

- All contributions are licensed per [LICENSE.md](LICENSE.md), including the patent grant in
  GOVERNANCE.md § 4.
- The [Code of Conduct](CODE_OF_CONDUCT.md) applies in every consortium space.
- Decisions happen in public. Private channels can discuss; only public threads decide.
