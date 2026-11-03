---
name: ecc-code-review
description: 'Review a diff, branch, or working tree for concrete bugs, regressions, and missing behavioral coverage.'
---

# ecc-code-review

Identify the comparison base, inspect the diff and follow affected callers/data paths. Prioritize correctness, authorization, races, error recovery, API compatibility and performance regressions with realistic impact. Use tests or a minimal reproduction when useful.
Keep review read-only unless fixes were requested. Return only actionable findings with severity, file/line, trigger, impact and suggested correction. Avoid style-only noise or unsupported vulnerability claims. If no issues are found, say so and state what was and was not verified.

Provenance: adapted from [Everything Claude Code](https://github.com/affaan-m/ECC) by Affaan Mustafa (MIT; see LICENSE), files commands/code-review.md, agents/code-reviewer.md, contexts/review.md, as found in the [WorldFlowAI copy](https://github.com/WorldFlowAI/everything-claude-code) at revision 432485b.
