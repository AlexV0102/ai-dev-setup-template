---
name: ecc-refactor-clean
description: 'Remove dead code or simplify implementation while preserving observable behavior.'
---

# ecc-refactor-clean

Inspect references, exports, dynamic imports, routing conventions and tests before declaring code dead. Make one bounded cleanup at a time. Treat dependency removal and public API changes as behavior-affecting until verified.
Run existing behavioral checks before and after when practical. Preserve user edits; avoid unrelated renames or formatting churn. Do not delete files based solely on a text search. Report removed paths, evidence of non-use and validation limits.

Provenance: adapted from [Everything Claude Code](https://github.com/affaan-m/ECC) by Affaan Mustafa (MIT; see LICENSE), files commands/refactor-clean.md, agents/refactor-cleaner.md, as found in the [WorldFlowAI copy](https://github.com/WorldFlowAI/everything-claude-code) at revision 432485b.
