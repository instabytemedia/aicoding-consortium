#!/usr/bin/env node
// AICC conformance suite runner — checks the reference validator against expected error codes.
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { validate } from "../plugins/aicc/scripts/validate.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const expected = JSON.parse(readFileSync(join(here, "expected.json"), "utf8"));
let pass = 0, fail = 0;
for (const file of readdirSync(join(here, "fixtures")).sort()) {
  const exp = expected[file];
  if (!exp) { console.log(`SKIP ${file} (no expectation)`); continue; }
  const { findings, strictViolations } = validate(readFileSync(join(here, "fixtures", file), "utf8"));
  const got = findings.filter(f => f.sev === "error").map(f => f.code).sort();
  const want = [...exp.errors].sort();
  const coreErrors = findings.filter(f => f.sev === "error" && !["E301","E202","E303"].includes(f.code)).length;
  const strictWarnings = findings.filter(f => f.sev === "warning" && f.code === "E302").length;
  const achieved = coreErrors > 0 ? "—" : (strictViolations === 0 && strictWarnings === 0 ? "AA (strict)" : "A (basic)");
  const ok = JSON.stringify(got) === JSON.stringify(want) && achieved === exp.achieved;
  console.log(`${ok ? "PASS" : "FAIL"} ${file} — errors [${got}] (want [${want}]) · achieved ${achieved} (want ${exp.achieved})`);
  ok ? pass++ : fail++;
}
console.log(`${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
