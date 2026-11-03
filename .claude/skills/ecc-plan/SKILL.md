---
name: ecc-plan
description: "Produce a concrete implementation plan for a feature, migration, or complex bug fix."
---

# ecc-plan

Read relevant repository instructions and trace current behavior before planning. Restate the desired outcome, identify affected modules and data contracts, then propose a small ordered sequence with dependencies, risks and verification steps.
Make routine implementation choices using existing conventions. Ask only for missing constraints that materially change the result. If the user asked for a plan, deliver a plan; if implementation is already authorized, continue through the work without introducing a blanket confirmation gate.
Do not create planning documents or modify application code merely to answer a planning-only request.

Provenance: adapted from [Everything Claude Code](https://github.com/affaan-m/ECC) by Affaan Mustafa (MIT; see LICENSE), files commands/plan.md, agents/planner.md, as found in the [WorldFlowAI copy](https://github.com/WorldFlowAI/everything-claude-code) at revision 432485b.
