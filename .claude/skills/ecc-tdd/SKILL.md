---
name: ecc-tdd
description: "Implement a requested test-first workflow or reproduce a behavior regression with focused automated tests."
---

# ecc-tdd

Identify an observable requirement and existing test runner. Write the smallest meaningful behavior test that fails for the expected reason, run it, implement the change, then rerun it. Refactor only after the behavior passes.
Prefer integration tests at API/data boundaries and focused unit tests for pure logic. Cover invalid input, auth/tenant isolation, failures, and races when relevant. Mock external providers at their boundary; avoid tests that merely mirror implementation. Use the project's coverage policy; do not invent an 80% requirement or add tests for trivial cosmetic edits.
Record RED and GREEN evidence, executed commands, and any untested paths.

Provenance: adapted from [Everything Claude Code](https://github.com/affaan-m/ECC) by Affaan Mustafa (MIT; see LICENSE), files skills/tdd-workflow/SKILL.md, commands/tdd.md, as found in the [WorldFlowAI copy](https://github.com/WorldFlowAI/everything-claude-code) at revision 432485b.
