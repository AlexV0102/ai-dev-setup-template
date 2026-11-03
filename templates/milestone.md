# M<N> · <Milestone name>

| Property | Value |
|---|---|
| Status | Backlog / Todo / In Progress / Blocked / Done |
| Scope | MVP / Post-MVP / … |
| Order | <number; decimals allowed, e.g. 7.5> |
| Dependencies | M<N-1>, <external decision> |
| Commit | <final stage commit hash, filled in at close> |
| Tasks | {{TASK_ID_PREFIX}}-NNN, {{TASK_ID_PREFIX}}-NNN |

## Outcome

What is true for users when this milestone is done, in one or two sentences. This is what the milestone is checked against, not the task list.

## Requirements covered

- R<NN> — <how this milestone advances it>

## Stages

| Stage | Task | Commit | Verification |
|---|---|---|---|
| 1 · <rules/contract> | {{TASK_ID_PREFIX}}-NNN | `<hash>` | <reviews, checks; "docs only: E2E N/A"> |
| 2 · <backend> | {{TASK_ID_PREFIX}}-NNN | `<hash>` | <check counts, security review, E2E> |
| 3 · <UI> | {{TASK_ID_PREFIX}}-NNN | `<hash>` | <check, browsers, widths, locales> |

## Exit criteria

- [ ] Every task Done with evidence.
- [ ] Affected rows of the edge-case matrix updated with status and evidence.
- [ ] Full gate and E2E passed on the final commit.
- [ ] Known limitations and NOT RUN items listed below.

## Decisions

- <date>: <decision, who made it, link>

## Evidence and limitations

<Final summary at close: commits, check results, what is NOT RUN, what was not deployed.>
