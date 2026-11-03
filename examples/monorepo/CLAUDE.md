# CLAUDE.md

Claude Code guidance for Example monorepo. The rules live in AGENTS.md, imported here so every agent shares one source of truth:

@AGENTS.md

## Commands

Run from the repository root.

| Purpose                                   | Command                                      |
| ----------------------------------------- | -------------------------------------------- |
| Install                                   | `npm ci`                                     |
| Local dev servers (run in the background) | `npm run dev`                                |
| Stage gate                                | `npm run check`                              |
| Browser end-to-end tests                  | `npm run test:e2e`                           |
| One test file                             | `node --test apps/api/test/greeting.test.ts` |

## Claude Code specifics

- Skills in `.claude/skills/`, subagents in `.claude/agents/`, path-scoped rules in `.claude/rules/`, hooks registered in `.claude/settings.json`.
- Use the `stage` skill for tracker tasks, `adversarial-review` before a PR, and the `ecc-*` skills for focused steps (plan, TDD, verify, review, E2E, build fixes, cleanup, docs).
- Run long-running servers in the background, never in the foreground; the `guard-long-running` hook blocks foreground ones.
