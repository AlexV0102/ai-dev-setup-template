# CLAUDE.md

Claude Code guidance for {{PROJECT_NAME}}. The rules live in AGENTS.md, imported here so every agent shares one source of truth:

@AGENTS.md

## Commands

Run from the repository root.

| Purpose | Command |
|---|---|
| Install | `{{INSTALL_COMMAND}}` |
| Local dev servers (run in the background) | `{{DEV_COMMAND}}` |
| Stage gate | `{{CHECK_COMMAND}}` |
| Browser end-to-end tests | `{{E2E_COMMAND}}` |
| One test file | `{{SINGLE_TEST_COMMAND}}` |

## Claude Code specifics

- Skills in `.claude/skills/`, subagents in `.claude/agents/`, path-scoped rules in `.claude/rules/`, hooks registered in `.claude/settings.json`.
- Use the `stage` skill for tracker tasks, `adversarial-review` before a PR, and the `ecc-*` skills for focused steps (plan, TDD, verify, review, E2E, build fixes, cleanup, docs).
- Run long-running servers in the background, never in the foreground; the `guard-long-running` hook blocks foreground ones.
