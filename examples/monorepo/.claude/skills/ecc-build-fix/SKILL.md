---
name: ecc-build-fix
description: 'Resolve TypeScript, Node.js, bundler, lint or build failures with minimal changes.'
---

# ecc-build-fix

Reproduce using the project package manager and existing build/type scripts. Read the first causal diagnostic and trace config, module resolution, runtime and dependency versions. Fix root causes in small diffs; preserve runtime behavior and public contracts.
Do not suppress diagnostics with any, ts-ignore, skipped checks or weakened compiler/security settings. Do not delete lockfiles, upgrade frameworks or reinstall dependencies without evidence that this resolves the fault and is within scope.
Rerun the failing command and relevant behavioral tests. Report original failure, fix, and actual final status. A network or sandbox failure is not a compiler regression.

Provenance: adapted from [Everything Claude Code](https://github.com/affaan-m/ECC) by Affaan Mustafa (MIT; see LICENSE), files commands/build-fix.md, agents/build-error-resolver.md, as found in the [WorldFlowAI copy](https://github.com/WorldFlowAI/everything-claude-code) at revision 432485b.
