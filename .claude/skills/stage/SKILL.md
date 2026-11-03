---
name: stage
description: "Run one tracker task or milestone stage end to end: read the task, plan, implement, test, review, verify in a browser, commit once, and record evidence in the tracker. Use when the user names a task ID or says to start/continue a stage. Stops before push and PR."
---

# stage

The full loop and its reasons are in `docs/workflow.md`. This skill is the checklist.

## 1. Read the task

- Fetch the task and its milestone from the tracker: acceptance criteria, dependencies, linked requirements and edge cases, status, earlier evidence. If the tracker is unreachable, say so and stop guessing.
- Read the docs AGENTS.md points to for the touched area, and any module-local instruction files.
- If the task is not started, move it to In Progress (only from Backlog/Todo).

## 2. Plan

- For anything beyond a small change, use `ecc-plan` (or the `planner` agent): affected modules and contracts, ordered steps, risks, verification.
- If the milestone is large, split it into stages that each end in a working, committable state. One stage at a time.
- Consult `architect` before changing a module boundary.

## 3. Implement

- Run the relevant baseline first so you know what passed before.
- Behavior changes and bug fixes go test-first (`ecc-tdd`): a failing test, the fix, the passing test.
- Follow `docs/architecture-rules.md`. Keep unrelated edits.

## 4. Verify

- `ecc-verify`: changed-behavior tests, then `{{CHECK_COMMAND}}`.
- Real browser: walk the changed journey, including reload, retry and error states; for UI work also check widths, keyboard, focus and every supported locale or theme. Use `ecc-e2e` to add or run browser tests; run `{{E2E_COMMAND}}` before any push.
- Fill the verification matrix (`templates/verification-matrix.md`): every check is PASS, FAIL or NOT RUN with its command.

## 5. Review

- `code-reviewer` on the diff; `security-reviewer` if trust boundaries changed; `architect` if boundaries moved.
- Fix findings, then have the reviewer re-check them. The stage is not done while applicable findings remain.

## 6. Commit

- Stage only this stage's files; `git status` must show nothing unexpected. No secrets, local databases, build output or test artifacts.
- One commit, message format from AGENTS.md, including the task ID.
- Do not push, open a PR or rewrite history unless the user said so. Before a PR, run `adversarial-review`.

## 7. Record evidence

Write to the task (and milestone, if it closes there):

- commit hash (link only if pushed);
- exact results: suites and counts, E2E per browser, manual checks;
- reviews run and their outcome;
- what was NOT RUN and remaining limitations.

Mark Done only if every required check and review passed. Otherwise leave it In Progress or Blocked, with the reason.

Report to the user: what changed, the matrix, the commit, and what is left.
