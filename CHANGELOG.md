# Changelog

All notable changes to this template. Versions follow [Semantic Versioning](https://semver.org/).

## [0.1.0] — 2026-11-03

### Added

- `AGENTS.md` template with placeholders and a one-line reason for every rule; `CLAUDE.md` that imports it.
- Workflow (`docs/workflow.md`): tracker task → plan → implement → tests → browser check → reviews → one commit per stage → evidence.
- Architecture rules (`docs/architecture-rules.md`) with a TypeScript / npm workspaces / Turborepo example.
- Ten subagents, twelve skills (including nine adapted from everything-claude-code), three rules (one path-scoped) and two hooks in `.claude/`.
- Templates for tasks, milestones, requirements, edge cases and verification matrices, plus one filled-in example task.
- `scripts/check-repo-hygiene.mjs` to keep secrets and build output out of Git.
- `examples/monorepo/`: a ready-to-use repo with the setup filled in and a minimal Fastify + Vite + shared-contract app, unit tests, Playwright smoke tests and a passing `npm run check`; kept in sync by `scripts/sync-example.mjs`.
