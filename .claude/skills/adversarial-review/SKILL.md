---
name: adversarial-review
description: "Two-agent review of the current branch before a pull request: a reviewer tuned for recall, a skeptic tuned for precision, then fixes for what survives. Produces the review record the PR description needs. Use before opening a PR or when the user asks for a deep branch review."
---

# adversarial-review

One reviewer has to trade recall against noise. Splitting the job removes the trade: `code-reviewer` lists everything suspicious, `review-skeptic` checks each item against the code, and you only spend time on what is confirmed.

## Steps

1. **Collect.** Give `code-reviewer` the branch diff against its target (`git diff <target>...HEAD`) and the task's goal, so intended behavior is not flagged. Ask for high recall: anything suspicious, ranked by severity, each with a reproduction recipe — entry point, input, expected result, actual result. Tooling findings (format, lint, types) are out; the gate already covers them.
2. **Check.** Give `review-skeptic` the numbered findings and the diff. It answers holds / unproven / refuted per finding.
3. **Act.**
   - holds → fix it, ideally with a test that failed before the fix;
   - unproven → write the test or probe that decides it, or ask the user;
   - refuted → no change; keep it in the record so it is not raised again.
4. **Second pass.** Review the fix commits on their own (`git diff <last reviewed commit>...HEAD`) the same way: fixes are new code. Stop when a pass confirms nothing, or after three passes, and list whatever is still open.
5. Run `{{CHECK_COMMAND}}` again.

## Review record

The `require-review-record` hook will not open a PR without this block in the description:

```markdown
<!-- review-record
status: done
passes: 2
findings: 6 (2 fixed, 1 settled by a test, 3 rejected)
-->

#### Review
- fixed: `src/orders/refund.ts:41` refund allowed after the window closed (test added)
- settled: concurrent cancel — test shows the second request gets 409
- rejected: `api/routes.ts:12` missing auth — the router-level guard covers it (`api/app.ts:30`)
```

If the user decides to waive the review (a docs-only change, an urgent fix), write `status: waived` and a `reason:` line instead of the counts, so the exception is on record for human reviewers.
