# Workflow: task → plan → implement → tests → manual check → commit → evidence

This is the loop the `stage` skill runs. It turns "the agent wrote some code" into "a reviewed, verified, committed stage with a record anyone can check".

```text
tracker task ──► plan ──► implement ──► automated tests ──► browser check ──► reviews ──► one commit ──► evidence in tracker
     ▲                                                                                                        │
     └──────────────────────────────── next stage starts only after this one is recorded ─────────────────────┘
```

## 1. Start from the tracker

- Read the task, its milestone, acceptance criteria, linked requirements and edge cases, dependencies and earlier evidence before touching code. *Why: the code shows what exists, not what was asked for.*
- Status flow: **Backlog** (not accepted) → **Todo** (can start) → **In Progress** (one task at a time) → **Blocked** (with a written reason) → **Done** (only with evidence). *Why: each state means one thing, so the board can be trusted at a glance.*
- The agent sets In Progress when it starts a Backlog or Todo task and otherwise leaves status alone, flagging anything that looks wrong. *Why: status is the team's decision.*
- A task names its requirements (`R01`) and edge cases (`EC07`); see [templates/](../templates). *Why: traceability lets you see which risks a change touches and which checks prove them.*

## 2. Plan

- Plan anything that spans several modules, changes a contract or migrates data; skip planning for small, local changes. *Why: planning costs time, and only pays for itself where the risk is.*
- The plan lists affected modules and contracts, ordered steps, risks, and how each step will be verified. *Why: a plan without verification steps is a wish.*
- Split large work into **stages**, each ending in a working, committable state. *Why: small stages keep reviews readable and failures local.*
- Settle open product questions with the user before writing code, and record the decision in the tracker. *Why: code written against a guess gets rewritten.*

## 3. Implement

- Run the relevant tests before changing anything. *Why: you need a baseline to tell new failures from old ones.*
- Write the failing test first for bug fixes and new behavior. *Why: it proves the test can detect the problem.*
- Respect [architecture-rules.md](architecture-rules.md); refactor one module at a time; keep HTTP contracts, persisted data and observable behavior. *Why: behavior-preserving steps are the only ones you can verify independently.*

## 4. Automated tests

- Run the changed-behavior tests, then the full gate (`{{CHECK_COMMAND}}`), then browser E2E before any push. *Why: fast feedback first, completeness before anything leaves your machine.*
- Compose the gate from cheap to expensive, and fail fast. A typical `check`: repository hygiene → format check → typecheck → tests → build. *Why: a formatting error should not wait for a ten-minute build.*
- Use disposable test databases and fixtures, never a developer's or production data. *Why: tests that touch real data eventually destroy it.*

## 5. Manual / browser check

- Open the real app with a real API and walk the changed journey: the happy path, reload in the middle, retry after a failed request, empty and error states. *Why: unit tests run on mocks, users don't.*
- For UI: several widths (e.g. 320/390/768/1440), keyboard only, visible focus, reduced motion, every supported locale or theme, no horizontal overflow. *Why: those are the layouts and users that automated suites skip.*
- Check the persisted result (database, API response), not only the success message. *Why: a toast can lie.*
- If something could not be checked (a native browser, a device, a screen reader), record it as NOT RUN. *Why: a gap you write down gets closed; a gap you hide ships.*

## 6. Reviews

| When | Who |
|---|---|
| Every code change | `code-reviewer` on the diff |
| Module boundaries or contracts change | `architect` |
| Auth, sessions, ownership, input validation, uploads, secrets, AI tools | `security-reviewer` |
| Before a PR | `adversarial-review` skill (finder + `review-skeptic`, up to 3 rounds) |

What a review checks beyond "does it compile":

- **Edges of library calls.** Look up what each library or framework call does with empty input, null, time zones and rounding; a function's name is not its contract.
- **The whole data path.** Follow a value from the UI through the API to storage and back, across every async boundary, including retries and cancellation.
- **Sibling entry points.** When a check (authorization, validation, a limit) is added to one route or job, find every other way to reach the same data and confirm it has the check too.
- **Leftover names.** After a rename or move, search code, tests, docs and configuration for the old name.
- **Test data after a contract change.** When a schema or signature changes, make sure mocks and seed data still look like real data, or the tests pass against something that cannot happen.
- **Repeat and concurrency.** Double submit, two tabs, a retry after a lost response: one accepted result, no double side effects.

Fix findings, then have the reviewer re-check them. *Why: a fix can be incomplete or break something else.*

## 7. One commit per stage

- Stage only the files of this stage; check `git status` for anything unexpected. *Why: unrelated changes in a stage commit cannot be reverted separately.*
- Never commit secrets, `.env` files, local databases, dependencies, build output, test reports or generated clients. Enforce it with [`scripts/check-repo-hygiene.mjs`](../scripts/check-repo-hygiene.mjs) in the gate. *Why: a script remembers what people forget.*
- Do not push, open a PR or rewrite history without the user's authorization. *Why: those are shared, visible actions.*

## 8. Evidence in the tracker

Record on the task (and the milestone when it closes):

```markdown
## Stage 2 — API and persistence — DONE
Commit: 1a2b3c4 (local, not pushed)
- PASS `npm run check`: hygiene, format, typecheck, 87 API + 9 UI tests, build
- PASS `npm run test:e2e`: Chrome 24/24, Firefox 24/24, WebKit 24/24, 0 flaky
- PASS manual: export journey at 390/1440 px, keyboard only, reload mid-export
- Reviews: code-reviewer (1 finding, fixed and re-checked), security-reviewer (none)
- NOT RUN: native Safari, screen reader
- Limitations: large exports (>10k rows) not measured
```

- Exact commands and counts, not "tests pass". *Why: "tests pass" cannot be checked later; "87/87" can.*
- Keep failed and retried runs in the record, with their cause. *Why: a test that went green on the third try is a flake, not a pass.*
- Link commits, PRs and CI runs only if they were actually pushed. *Why: a link to nothing is a fabricated claim.*
- No credentials, cookies, personal data or raw payloads in evidence. *Why: trackers are shared widely and kept forever.*
- Distinguish implemented, verified and deployed. *Why: each one is a different promise.*

## Release gates

A milestone or release is ready when every box is checked against the tested commit:

- [ ] All stage acceptance criteria met; no open defect that blocks the core journey or data safety.
- [ ] Required browsers, devices and assistive checks done, with versions recorded.
- [ ] Persistence, retry after a lost response, concurrent tabs and version compatibility checked.
- [ ] Backup and restore, migration and rollback exercised in the target environment.
- [ ] Privacy, retention and deletion behave as specified.
- [ ] Commit, evidence and known limitations recorded; a local build is not reported as a deployment.
