# {{TASK_ID_PREFIX}}-NNN · <Short imperative title>

| Property | Value |
|---|---|
| Status | Backlog / Todo / In Progress / Blocked / Done |
| Type | Task / Bug / Enhancement / Experiment |
| Priority | High / Medium / Low |
| Scope | MVP / Post-MVP / … |
| Milestone | M<N> · <name> |
| Requirements | R01, R07 |
| Edge cases | EC03, EC11 |
| Order | <number for sequencing> |

## Context and goal

Why this task exists and what outcome it produces for the user, in two or three sentences. Link the decision or discussion it comes from.

## Acceptance criteria

Each criterion is observable and testable. Avoid "works correctly".

- [ ] <Given / when / then, or a concrete observable result>
- [ ] <Failure or edge behavior: what happens on retry, reload, invalid input, no permission>
- [ ] <Non-functional: accessibility, performance budget, locales, browsers>

## Out of scope

- <What this task deliberately does not do, so nobody "finishes" it by accident>

## Dependencies

- <Tasks or milestones that must be Done first; external decisions; blocked-by reasons>

## Plan and stages

Filled in when the task starts. Each stage ends in a working commit.

1. <Stage 1: contract/rules> — verification: <how>
2. <Stage 2: backend/persistence> — verification: <how>
3. <Stage 3: UI> — verification: <how>

## Results / evidence

One block per completed stage (see `docs/workflow.md` § Evidence).

### Stage <N> — <name> — <DONE / BLOCKED>

- Commit: `<hash>` (<pushed: link | local, not pushed>)
- PASS/FAIL `<command>`: <counts>
- Browser: <browsers and versions, journeys, widths, locales>
- Reviews: <agents run, findings, resolution>
- NOT RUN: <what and why>
- Limitations: <what this does not prove>
