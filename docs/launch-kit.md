# AICC Launch Kit — ready-to-post

## Show HN

**Title:** Show HN: Agent-Readiness Scanner – is your site visible to AI agents?

**Body:** AI agents are becoming the web's biggest readers, but the web has no standard way
to tell them what a site contains, what they may do, or what changed since yesterday — so
agents burn tokens crawling blind, and sites have no say. We built the missing layer as open
standards (an evolution of the robots.txt/sitemap.xml pattern): agents.txt (policy),
aix.json (content index with hashes + token costs → differential crawling), and AICC Markdown
(one spec format instead of CLAUDE.md/AGENTS.md/.cursorrules fragmentation). The scanner
grades any origin A–F and shows the exact fixes — most are one text file. Everything is
CC-BY/MIT, two reference validators, conformance suite, no vendor owns it. Feedback on the
drafts is the point of posting.

## X/Twitter thread (6 tweets)

1. Your site is about to get more AI readers than human ones. Can they actually read it?
   We built a scanner that grades any origin A–F: [scanner link]
2. The problem: agents crawl blind. 150k tokens of HTML for 2k tokens of content, re-read
   every session because nothing says "unchanged."
3. The fix is boring on purpose: text files. agents.txt = what agents may do.
   aix.json = what each page contains, its hash, its token cost. Like robots.txt + sitemap,
   for the agent era.
4. Site owners: this is SEO in 2005. Origins agents can read cheaply get found and quoted.
   The grade is shareable. The fixes take minutes.
5. Engineers: the whole stack is open — specs, validators, conformance suite, migration
   tool. First conformance target: Claude Code. Built to be adopted by every engine.
6. Scan your site, wear the badge, claim your "since" date: [links]

## Reddit r/ClaudeAI

**Title:** We standardized CLAUDE.md — and built the agent-web layer around it

**Body:** Every engine invents its own instruction file (CLAUDE.md, AGENTS.md, .cursorrules…).
We wrote an open standard that unifies them (with a one-command migrator), plus the web layer:
agents.txt, a content index that lets agents skip unchanged pages, and context directives that
measurably cut token use. There's a Claude Code plugin (marketplace install), a validator, and
a scanner that grades any site. All drafts are open for comments — tear them apart.

## dev.to article outline

"The Agent Web needs its robots.txt moment" — history (robots/sitemap/schema.org won via
consumer commitment + zero friction) → the gap today → the stack, layer by layer → measured
token numbers → how to adopt in 15 minutes → call for second implementations.

## Vendor outreach (short)

Subject: One spec format instead of five — interop mapping for [Engine] ready for review

We maintain AICC, an open standards effort for agent instruction files and the agent web
(validators, conformance suite, RF patent policy — CC-BY/MIT, no vendor owns it). The interop
mapping for [Engine's file] is drafted (TR-005) and we'd rather get it right with you than
around you. 30 minutes with the right engineer on your side?
