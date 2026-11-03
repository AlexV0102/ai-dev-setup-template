# {{PROJECT_NAME}}: agent instructions

<!-- TEMPLATE: replace every {{...}} placeholder, delete rules that do not apply, then delete this comment. -->

This file is the single source of truth for every coding agent working in this repository (Claude Code reads it through `CLAUDE.md`; Codex and other agents read it directly). Each rule carries a one-line *why*, so whoever edits this file later knows what a rule protects before removing it.

{{ONE_PARAGRAPH_PRODUCT_SUMMARY}}

## Sources of truth

- Product backlog, milestones, requirements and edge cases live in {{TASK_TRACKER_NAME}} ({{TASK_TRACKER_URL}}). Task IDs use `{{TASK_ID_PREFIX}}-NNN`. *Why: the agent must read real acceptance criteria, not guess them from the code.*
- Repository architecture and workflow rules live here and in [docs/architecture-rules.md](docs/architecture-rules.md) and [docs/workflow.md](docs/workflow.md). *Why: rules the agent cannot see do not exist for it.*
- If the tracker and this file disagree, do not silently overwrite either; follow the user's explicit instruction or ask. *Why: either side may be the stale one.*
- If the tracker connector is unavailable, say so and do not invent task contents or claim a status update. *Why: a fabricated status is worse than a missing one.*

## How work is done

The full loop is in [docs/workflow.md](docs/workflow.md); the `stage` skill runs it.

- Plan complex features before writing code; small changes go straight to implementation. *Why: planning cost should scale with risk.*
- Split a milestone into stages. Finish one stage — implementation, review findings, checks, browser verification, one commit — before starting the next. *Why: each commit is a known-good point you can review, bisect and roll back.*
- Bug fixes start from the root cause and add a regression test that fails before the fix. *Why: a fix without a failing test may fix nothing.*
- Inspect existing tests and run the relevant baseline before a migration or refactor. *Why: you cannot tell what you broke without knowing what passed before.*
- Refactor one module at a time and preserve HTTP contracts, persisted data and observable behavior. *Why: a big-bang refactor hides which step caused a regression.*
- Remove a transitional implementation only after its callers and tests use the replacement. *Why: deleting first leaves a window where nothing works.*
- Keep unrelated edits, including the user's uncommitted changes. *Why: the working tree is shared with a human.*

## Checks

| Purpose | Command |
|---|---|
| Install exactly what the lockfile pins | `{{INSTALL_COMMAND}}` |
| Stage gate: hygiene, format, typecheck, tests, build | `{{CHECK_COMMAND}}` |
| Browser end-to-end tests | `{{E2E_COMMAND}}` |
| One test file | `{{SINGLE_TEST_COMMAND}}` |

- `{{CHECK_COMMAND}}` must pass from a clean clone before a stage is done. *Why: "works on my machine" is not a gate.*
- Run `{{E2E_COMMAND}}` locally and get it green before opening a pull request or pushing, and report the result in the PR. *Why: browser tests catch what unit tests cannot, and if CI skips them nobody else will run them.*
- Report every check as PASS, FAIL or NOT RUN, with the command. Never claim a check passed unless you ran it against the current code. *Why: an unrun check reported as green is how regressions ship.*
- Keep environment failures (network, ports, missing browsers) separate from code failures. *Why: they have different owners and fixes.*
- A local build, a push and a deployment are different evidence; never infer one from another. *Why: "it built" does not mean users have it.*

## Reviews

- After code changes, review the diff with the `code-reviewer` agent; consult `architect` before changing module boundaries; request `security-reviewer` when trust boundaries change (auth, sessions, ownership, input validation, secrets, uploads, AI tool access). *Why: an independent read catches what the author's context hides.*
- Before opening a PR, run the `adversarial-review` skill and put its review record in the PR description. *Why: a finder and a separate skeptic filter out both missed bugs and false alarms.*
- A stage is not complete while applicable review findings are unresolved. *Why: "fix later" findings are rarely fixed.*

## Git

- One commit per completed stage, staging only that stage's files. *Why: mixed commits cannot be reverted cleanly.*
- Never commit secrets, `.env` files, local databases, dependencies, build output, test artifacts or generated clients; `scripts/check-repo-hygiene.mjs` enforces this inside `{{CHECK_COMMAND}}`. *Why: once pushed, a secret must be treated as leaked.*
- Do not rewrite history, push or open PRs without the user's authorization. *Why: those actions are visible to others and hard to undo.*
- Commit message format: `{{COMMIT_FORMAT}}` (e.g. `fix(accounts): handle expired link ({{TASK_ID_PREFIX}}-123)`). *Why: the task ID links code history back to the tracker.*

## Tracker updates

- When you start a task that is in Backlog or Todo, set it to In Progress. Any other status stays as you found it; if it looks wrong, say so to the user. *Why: status is a team decision, and the agent only reports on it.*
- Mark a task Done only after the required checks, reviews and browser checks actually passed. *Why: Done is a promise to the rest of the team.*
- Record per stage: commit hash, exact check results (counts per suite, E2E per browser), reviews run, and what was NOT RUN. Link commits and PRs only if they were actually pushed. *Why: evidence makes "done" checkable later without rerunning everything.*
- Never paste credentials, cookies, user data or private request/response payloads into the tracker. *Why: trackers are widely shared and long-lived.*
- Do not change tracker schemas, dates, owners, estimates or sharing unless asked. *Why: those belong to whoever plans the work.*

## Writing code

- Follow [docs/architecture-rules.md](docs/architecture-rules.md): feature/domain modules, thin UI and transport, explicit public entry points, no upward or cross-feature imports. *Why: an agent will take the shortest path through any boundary that is not written down.*
- Read a module's own `AGENTS.md`/`CLAUDE.md` (if present) before editing inside it. *Why: local rules override general ones and are cheap to read.*
- Validate untrusted data at boundaries and enforce resource authorization on the server. *Why: the client is not a trust boundary.*
- Prefer existing scripts, packages and patterns; do not add a dependency or abstraction without a concrete need. *Why: every addition is maintenance the user pays for.*
- Comments and tests follow [.claude/rules/comments-and-tests.md](.claude/rules/comments-and-tests.md). *Why: agents over-produce both, and noise hides the signal.*
- Logs, data dumps, drafts and throwaway scripts go in the git-ignored `scratch/` folder; anything committed must be meant to stay. *Why: a stray script in the tree looks like supported code to the next reader.*

## UI changes

- Respect the existing design system and use its shared primitives. *Why: one-off styles fragment the product.*
- Review the rendered UI in a real browser (responsive widths, keyboard, focus, loading/error/empty states) before calling UI work done; if rendering is blocked, report visual verification as NOT RUN. *Why: tests pass on layouts no human could use.*

## Messages other people read

- Follow [.claude/rules/public-messages.md](.claude/rules/public-messages.md) before posting comments, reviews or messages in shared tools. *Why: an AI-written post carries your name.*

## Project specifics

<!-- TEMPLATE: workspace layout, apps and packages, what each owns, and anything an agent repeatedly gets wrong here. Keep it short; link to docs for detail. -->

{{STACK_AND_LAYOUT}}
