---
name: ecc-security-review
description: 'Perform an explicitly requested application security review of code or an API/auth/payment change.'
---

# ecc-security-review

Establish the requested scope and trust boundaries. Trace untrusted data to SQL, shell, HTML, URLs, file paths, AI tools, and external providers. Check server-side auth, ownership and tenant isolation; cookie/session/CSRF design; upload limits; SSRF; rate limits; and secret exposure.
For AI integrations examine prompt injection, tool authorization, data exfiltration, output validation and retry/cost limits. Keep findings grounded in a reachable code path with file/line evidence, impact, prerequisites, and a practical remediation. Distinguish hypotheses from verified findings; avoid checklist-only allegations.
Stay read-only for a review request. Do not run active probes against production or reveal credential values. Report findings by severity and include verification limits. Existing specialist security plugins may be used when available and relevant.

Provenance: adapted from [Everything Claude Code](https://github.com/affaan-m/ECC) by Affaan Mustafa (MIT; see LICENSE), files skills/security-review/SKILL.md, agents/security-reviewer.md, as found in the [WorldFlowAI copy](https://github.com/WorldFlowAI/everything-claude-code) at revision 432485b.
