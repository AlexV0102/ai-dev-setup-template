# Requirements

A living list of testable requirements. It is a working specification, not a promise to list every future case. Refine scope and criteria before each milestone; do not assign dates, budgets or owners without a reason.

## How to write one

- One requirement per row, phrased so a test or a check can prove it.
- **State** is the honest current status: "Not started", "Implemented, not verified", "Verified in M3 (Chrome, Firefox)", "Partially verified; native Safari NOT RUN".
- **Tasks** links every task that implements or verifies it.

## Requirements

| ID  | Area               | Testable requirement                                                       | State   | Tasks      |
| --- | ------------------ | -------------------------------------------------------------------------- | ------- | ---------- |
| R01 | <Audience / value> | <Who gets what benefit, observable in use>                                 | <state> | <task IDs> |
| R02 | <Persistence>      | <Data survives reload and restart; the correct step is restored>           | <state> | <task IDs> |
| R03 | <Security>         | <Resources are authorized by owner on the server; strict input validation> | <state> | <task IDs> |
| R04 | <Accessibility>    | <Keyboard, visible focus, contrast, labels, reduced motion>                | <state> | <task IDs> |

## Release boundaries

- **Done:** <what already shipped or is verified>
- **Next release:** <milestones in scope>
- **Later:** <post-release ideas, only after feedback>
- **Out of scope:** <explicitly excluded, so agents do not build it>

## Shared criteria

Every stage keeps: <localization, data ownership, correct save and restore, accessibility, strict contracts>. New functionality is not done if it breaks existing behavior or data.

## Open decisions

- <Question> — <task where it will be decided>
