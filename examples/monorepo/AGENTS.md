# Example monorepo: agent instructions

This file is the single source of truth for every coding agent working in this repository (Claude Code reads it through `CLAUDE.md`; Codex and other agents read it directly). Each rule carries a one-line _why_, so whoever edits this file later knows what a rule protects before removing it.

A minimal full-stack TypeScript monorepo: a web page asks the API for a greeting. It exists to show the agent setup working on real code; replace it with your product.

## Sources of truth

- Product backlog, milestones, requirements and edge cases live in GitHub Issues (this repository's Issues tab). Task IDs use `EX-NNN`. _Why: the agent must read real acceptance criteria, not guess them from the code._
- Repository architecture and workflow rules live here and in [docs/architecture-rules.md](docs/architecture-rules.md) and [docs/workflow.md](docs/workflow.md). _Why: rules the agent cannot see do not exist for it._
- If the tracker and this file disagree, do not silently overwrite either; follow the user's explicit instruction or ask. _Why: either side may be the stale one._
- If the tracker connector is unavailable, say so and do not invent task contents or claim a status update. _Why: a fabricated status is worse than a missing one._

## How work is done

The full loop is in [docs/workflow.md](docs/workflow.md); the `stage` skill runs it.

- Plan complex features before writing code; small changes go straight to implementation. _Why: planning cost should scale with risk._
- Split a milestone into stages. Finish one stage — implementation, review findings, checks, browser verification, one commit — before starting the next. _Why: each commit is a known-good point you can review, bisect and roll back._
- Bug fixes start from the root cause and add a regression test that fails before the fix. _Why: a fix without a failing test may fix nothing._
- Inspect existing tests and run the relevant baseline before a migration or refactor. _Why: you cannot tell what you broke without knowing what passed before._
- Refactor one module at a time and preserve HTTP contracts, persisted data and observable behavior. _Why: a big-bang refactor hides which step caused a regression._
- Remove a transitional implementation only after its callers and tests use the replacement. _Why: deleting first leaves a window where nothing works._
- Keep unrelated edits, including the user's uncommitted changes. _Why: the working tree is shared with a human._

## Checks

| Purpose                                              | Command                                      |
| ---------------------------------------------------- | -------------------------------------------- |
| Install exactly what the lockfile pins               | `npm ci`                                     |
| Stage gate: hygiene, format, typecheck, tests, build | `npm run check`                              |
| Browser end-to-end tests                             | `npm run test:e2e`                           |
| One test file                                        | `node --test apps/api/test/greeting.test.ts` |

- `npm run check` must pass from a clean clone before a stage is done. _Why: "works on my machine" is not a gate._
- Run `npm run test:e2e` locally and get it green before opening a pull request or pushing, and report the result in the PR. _Why: browser tests catch what unit tests cannot, and if CI skips them nobody else will run them._
- Report every check as PASS, FAIL or NOT RUN, with the command. Never claim a check passed unless you ran it against the current code. _Why: an unrun check reported as green is how regressions ship._
- Keep environment failures (network, ports, missing browsers) separate from code failures. _Why: they have different owners and fixes._
- A local build, a push and a deployment are different evidence; never infer one from another. _Why: "it built" does not mean users have it._

## Reviews

- After code changes, review the diff with the `code-reviewer` agent; consult `architect` before changing module boundaries; request `security-reviewer` when trust boundaries change (auth, sessions, ownership, input validation, secrets, uploads, AI tool access). _Why: an independent read catches what the author's context hides._
- Before opening a PR, run the `adversarial-review` skill and put its review record in the PR description. _Why: a finder and a separate skeptic filter out both missed bugs and false alarms._
- A stage is not complete while applicable review findings are unresolved. _Why: "fix later" findings are rarely fixed._

## Git

- One commit per completed stage, staging only that stage's files. _Why: mixed commits cannot be reverted cleanly._
- Never commit secrets, `.env` files, local databases, dependencies, build output, test artifacts or generated clients; `scripts/check-repo-hygiene.mjs` enforces this inside `npm run check`. _Why: once pushed, a secret must be treated as leaked._
- Do not rewrite history, push or open PRs without the user's authorization. _Why: those actions are visible to others and hard to undo._
- Commit message format: `type(scope): summary (EX-NNN)` (e.g. `fix(accounts): handle expired link (EX-123)`). _Why: the task ID links code history back to the tracker._

## Tracker updates

- When you start a task that is in Backlog or Todo, set it to In Progress. Any other status stays as you found it; if it looks wrong, say so to the user. _Why: status is a team decision, and the agent only reports on it._
- Mark a task Done only after the required checks, reviews and browser checks actually passed. _Why: Done is a promise to the rest of the team._
- Record per stage: commit hash, exact check results (counts per suite, E2E per browser), reviews run, and what was NOT RUN. Link commits and PRs only if they were actually pushed. _Why: evidence makes "done" checkable later without rerunning everything._
- Never paste credentials, cookies, user data or private request/response payloads into the tracker. _Why: trackers are widely shared and long-lived._
- Do not change tracker schemas, dates, owners, estimates or sharing unless asked. _Why: those belong to whoever plans the work._

## Writing code

- Follow [docs/architecture-rules.md](docs/architecture-rules.md): feature/domain modules, thin UI and transport, explicit public entry points, no upward or cross-feature imports. _Why: an agent will take the shortest path through any boundary that is not written down._
- Read a module's own `AGENTS.md`/`CLAUDE.md` (if present) before editing inside it. _Why: local rules override general ones and are cheap to read._
- Validate untrusted data at boundaries and enforce resource authorization on the server. _Why: the client is not a trust boundary._
- Prefer existing scripts, packages and patterns; do not add a dependency or abstraction without a concrete need. _Why: every addition is maintenance the user pays for._
- Comments and tests follow [.claude/rules/comments-and-tests.md](.claude/rules/comments-and-tests.md). _Why: agents over-produce both, and noise hides the signal._
- Logs, data dumps, drafts and throwaway scripts go in the git-ignored `scratch/` folder; anything committed must be meant to stay. _Why: a stray script in the tree looks like supported code to the next reader._

## UI changes

- Respect the existing design system and use its shared primitives. _Why: one-off styles fragment the product._
- Review the rendered UI in a real browser (responsive widths, keyboard, focus, loading/error/empty states) before calling UI work done; if rendering is blocked, report visual verification as NOT RUN. _Why: tests pass on layouts no human could use._

## Messages other people read

- Follow [.claude/rules/public-messages.md](.claude/rules/public-messages.md) before posting comments, reviews or messages in shared tools. _Why: an AI-written post carries your name._

## Project specifics

npm workspaces + Turborepo, Node.js 24 (runs TypeScript tests directly through type stripping).

- `packages/shared`: runtime schemas (Zod) and their inferred types, one entry point per domain (`@example/shared/greeting`). Imports no app code. Build it before consumers; Turborepo does this through `^build`.
- `apps/api`: Fastify. `src/app.ts` is the only composition root, used by `server.ts` and by tests (`app.inject()`, no TCP port). Modules live in `src/modules/<domain>/`: routes validate and delegate, services hold the logic, `index.ts` is the public entry point.
- `apps/web`: Vite, plain TypeScript. `app/` composes, `features/<name>/` holds UI (`ui.ts`) and the API client (`api.ts`, which parses responses with the shared schema). The dev and preview servers proxy `/api` to the API on 127.0.0.1:3001.
- `tests/e2e`: Playwright against the built app in Chrome (the installed Google Chrome), Firefox and WebKit; install the last two once with `npx playwright install firefox webkit`.
- `AGENTS.md`, `CLAUDE.md`, `.claude/`, `docs/`, `templates/` and `scripts/check-repo-hygiene.mjs` are generated from the template by `scripts/sync-example.mjs`; edit the template, not these copies.
