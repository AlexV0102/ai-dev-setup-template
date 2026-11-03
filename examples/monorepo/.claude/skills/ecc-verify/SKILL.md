---
name: ecc-verify
description: 'Verify an implementation or release candidate with appropriate build, type, lint, test, and integration checks.'
---

# ecc-verify

Inspect package.json, packageManager, lockfiles and CI to discover the actual checks. Run changed-behavior tests and required repository checks. Typecheck, lint and build where applicable; avoid redundant reruns after unchanged passing results.
Review git diff and status for unintended edits, configuration drift and credentials without printing secret values. For full-stack changes trace browser -> API -> data -> response, including auth restoration and failures. A static review, mocked test, local build, push and live deployment are different evidence.
Return PASS/FAIL/NOT RUN per relevant check with the command and concise evidence. Explain environment failures separately from code failures. Do not claim deployment or runtime success from a local build.

Provenance: adapted from [Everything Claude Code](https://github.com/affaan-m/ECC) by Affaan Mustafa (MIT; see LICENSE), files skills/verification-loop/SKILL.md, commands/verify.md, as found in the [WorldFlowAI copy](https://github.com/WorldFlowAI/everything-claude-code) at revision 432485b.
