---
name: ecc-e2e
description: "Create or run browser end-to-end tests for a real user journey using existing Playwright or browser tooling."
---

# ecc-e2e

Identify the user role, start/end states, test environment and existing runner. Cover the critical journey plus relevant auth, persistence, empty and failure states. Prefer accessible role/label selectors and deterministic test data; use assertions/waits for state rather than arbitrary sleeps.
Use installed browser tooling. Explain missing dependencies before adding them; never use production money or destructive real-user data. Keep screenshots, traces and logs local unless upload is authorized. Verify API/data effects rather than only a success toast.
Report the exact command, environment, pass/fail, artifacts and unresolved flakes. Browser checks that were not run remain NOT RUN.

Provenance: adapted from [Everything Claude Code](https://github.com/affaan-m/ECC) by Affaan Mustafa (MIT; see LICENSE), files commands/e2e.md, agents/e2e-runner.md, as found in the [WorldFlowAI copy](https://github.com/WorldFlowAI/everything-claude-code) at revision 432485b.
