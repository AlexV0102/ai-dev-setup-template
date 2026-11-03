# AI dev setup template

A drop-in set of rules, skills, subagents, hooks and tracker templates for working with coding agents (Claude Code first; Codex and other agents through `AGENTS.md`). It is extracted from the setup of a real full-stack TypeScript monorepo that was built almost entirely with an agent, stage by stage.

## The problem

An agent without rules optimizes for "the task looks done":

- it takes the shortest path through any boundary nobody wrote down, so business logic ends up in handlers and features import each other's internals;
- it reports "tests pass" without saying which tests, against which commit, or what it skipped;
- it mixes three changes into one commit, or commits a `.env` file;
- it adds comments that restate the code and tests that check nothing;
- it marks tasks done that were never checked in a browser, and confuses "it built" with "it is deployed".

None of this is malice; it is missing context. This template supplies the context: a fixed loop (task → plan → implement → tests → browser check → reviews → one commit → evidence), architecture boundaries with a reason for each rule, and enough automation (hooks, a hygiene script) to enforce the parts people forget.

## What's inside

| Path | What it is |
|---|---|
| [`AGENTS.md`](AGENTS.md) | The rules every agent reads. Placeholders like `{{PROJECT_NAME}}`, `{{CHECK_COMMAND}}`, `{{TASK_TRACKER_URL}}`. Each rule has a one-line *why*. |
| [`CLAUDE.md`](CLAUDE.md) | Imports `AGENTS.md` (one source of truth) and adds commands and Claude Code specifics. |
| [`docs/workflow.md`](docs/workflow.md) | The full loop, status flow, what a review checks, evidence format, release gates. |
| [`docs/architecture-rules.md`](docs/architecture-rules.md) | Feature modules, layer responsibilities, dependency direction, contracts, monorepo rules; TypeScript/npm-workspaces example. |
| [`.claude/agents/`](.claude/agents) | `planner`, `architect`, `code-reviewer`, `security-reviewer`, `tdd-guide`, `e2e-runner`, `build-error-resolver`, `refactor-cleaner`, `doc-updater`, `review-skeptic`. Read-only where they review. |
| [`.claude/skills/`](.claude/skills) | `stage` (the whole loop for one task), `adversarial-review` (finder + skeptic before a PR), `compact-instructions`, and nine `ecc-*` step skills: plan, tdd, verify, code-review, security-review, e2e, build-fix, refactor-clean, update-docs. |
| [`.claude/rules/`](.claude/rules) | `comments-and-tests` and `public-messages` (always loaded) and `migrations` (path-scoped example: loads only for migration files). |
| [`.claude/hooks/`](.claude/hooks) | `guard-long-running` blocks foreground dev servers and watchers; `require-review-record` blocks `gh pr create` without a review record. |
| [`.claude/settings.json`](.claude/settings.json) | Registers the hooks and denies reading local `.env` files. |
| [`scripts/check-repo-hygiene.mjs`](scripts/check-repo-hygiene.mjs) | Fails the gate if Git tracks env files, databases, keys, build or test output. |
| [`templates/`](templates) | Task, milestone, requirement, edge-case matrix and verification matrix. Plain Markdown: paste into Notion, Linear, Jira, GitHub Issues or keep in the repo. |
| [`examples/example-task.md`](examples/example-task.md) | A filled-in task for a fictional feature, with three stages and their evidence. |
| [`examples/monorepo/`](examples/monorepo) | A complete, ready-to-use repo: the whole setup with placeholders filled in, plus a minimal npm-workspaces/Turborepo app (Fastify API, Vite web page, shared Zod contract), unit tests, a Playwright smoke suite and a passing `npm run check`. |
| [`scripts/sync-example.mjs`](scripts/sync-example.mjs) | Regenerates the example's copies of the setup from the template; `--check` fails when they drift. |

## Start a new repo from the example

```sh
cp -R examples/monorepo ../my-app && cd ../my-app
git init && npm ci && npx playwright install firefox webkit
npm run check && npm run test:e2e
```

Everything is already wired: the agent rules, skills, subagents and hooks, the gate and the browser tests. Replace the greeting feature with your own, then update the "Project specifics" section of `AGENTS.md`. In your copy, the setup files are yours to edit; the generation note only applies inside this template. `npm run test:e2e` runs Chrome (your installed Google Chrome), Firefox and WebKit; install the last two once with `npx playwright install firefox webkit`, or drop projects from `playwright.config.ts`.

## Adopt it in an existing repo (~15 minutes)

1. **Copy the files** into your repository root:

   ```sh
   git clone --depth 1 https://github.com/AlexV0102/ai-dev-setup-template.git /tmp/ai-dev-setup
   cd your-repo
   cp -R /tmp/ai-dev-setup/{AGENTS.md,CLAUDE.md,.claude,docs,templates} .
   mkdir -p scripts && cp /tmp/ai-dev-setup/scripts/check-repo-hygiene.mjs scripts/
   ```

   If you already have an `AGENTS.md` or `CLAUDE.md`, merge by hand: keep your project facts, add the sections you are missing. Add `scratch/`, `.claude/settings.local.json` and `CLAUDE.local.md` to your `.gitignore` (see this repo's [`.gitignore`](.gitignore)).

2. **Fill the placeholders** (about 5 minutes). Find them with:

   ```sh
   grep -rn '{{' AGENTS.md CLAUDE.md docs .claude templates
   ```

   `examples/monorepo/AGENTS.md` shows every placeholder filled in. The important ones: `{{CHECK_COMMAND}}` (your one-command gate), `{{E2E_COMMAND}}`, `{{TASK_TRACKER_NAME}}`/`{{TASK_TRACKER_URL}}`, `{{TASK_ID_PREFIX}}`, `{{COMMIT_FORMAT}}`, and the "Project specifics" section at the end of `AGENTS.md`.

3. **Wire the gate.** Make sure one command runs hygiene, formatting, typecheck, tests and build, cheapest first. For npm:

   ```json
   "check": "node scripts/check-repo-hygiene.mjs && prettier --check . && tsc -b && npm test && npm run build"
   ```

   Run it once, fix what it finds, and adjust the patterns in `check-repo-hygiene.mjs` to your repo.

4. **Check the hooks.** They need Node.js 18+ on `PATH`. Adjust the command patterns in `guard-long-running.mjs` for your dev scripts. If you do not use the PR review gate, remove `require-review-record` from `.claude/settings.json`.

5. **Delete what does not apply**: rules for a database you do not have, skills you will not use, the TypeScript example. Smaller instructions are followed more reliably.

6. **Try it**: ask the agent to run `stage` on a small real task and read the evidence it produces.

## Adapt the rules to another stack

The rules are written in terms of responsibilities, not frameworks. To port them:

- **Commands.** Replace the npm scripts with your build tool (`make check`, `./gradlew check`, `just check`, `uv run …`). Keep the order: hygiene → format → static analysis → tests → build.
- **Boundaries.** Map the layer table in `docs/architecture-rules.md` to your folders, then enforce dependency direction with a tool (Nx module-boundary rules, dependency-cruiser, ArchUnit, Go `internal/`, import-linter).
- **Contracts.** Swap Zod for your runtime schema (Pydantic, JSON Schema, protobuf); the rule stays the same: one authoritative schema, derived types.
- **Skills.** The `ecc-build-fix` and `ecc-e2e` skills mention TypeScript and Playwright as examples; edit their first lines for your toolchain.
- **Template maintenance.** Edit the setup at the template root, then run `node scripts/sync-example.mjs` so the example follows; run it with `--check` before committing.
- **Path-scoped rules.** Copy `.claude/rules/migrations.md` as the pattern for any rule that only matters in part of the tree (`paths:` frontmatter with globs).
- **Codex and other agents.** They read `AGENTS.md` directly. Skills in `.claude/skills/` use the shared `SKILL.md` format; link or copy them to the location your agent expects (e.g. `.agents/skills/`).

## Principles

- **One source of truth.** Rules live in `AGENTS.md`; tools import it instead of copying it.
- **Every rule has a reason.** A rule without a *why* gets deleted the first time it is inconvenient.
- **Evidence over claims.** PASS, FAIL or NOT RUN, with the command and the commit.
- **Automate what people forget.** Hooks and scripts for the rules that must not depend on attention.
- **Keep it small.** Long instructions dilute the important ones; use path-scoped rules and on-demand skills for the rest.

## Credits

The nine `ecc-*` skills are adapted from [Everything Claude Code](https://github.com/affaan-m/ECC) by Affaan Mustafa (MIT), taken from the [WorldFlowAI copy](https://github.com/WorldFlowAI/everything-claude-code) of that project; each skill names the upstream files it is based on, and [LICENSE](LICENSE) carries the original copyright and license text. The rest of the template was written for this repository.

## License

[MIT](LICENSE)
