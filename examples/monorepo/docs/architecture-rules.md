# Architecture rules

Stack-agnostic rules for monorepos and module boundaries, with a TypeScript / npm workspaces example at the end. Copy the parts that fit; delete the rest. An agent follows boundaries only if they are written down, so write down the ones you have.

## Organize by feature, separate by responsibility

- Group code by business feature or domain (`billing/`, `accounts/`), not by technical kind (`controllers/`, `services/` at the top). _Why: a change to one feature should touch one folder._
- Inside a module, separate the responsibilities that actually exist: _Why: each layer can then change and be tested on its own._

  | Responsibility             | Examples                                      |
  | -------------------------- | --------------------------------------------- |
  | Presentation               | pages, components, rendering, interaction     |
  | Application logic          | use cases, workflows, state transitions       |
  | Domain logic               | business rules, domain types                  |
  | Transport and integrations | HTTP handlers, API clients, external services |
  | Persistence                | queries, repositories, storage                |
  | Contracts and validation   | request/response schemas, boundary validation |

- Keep UI components and HTTP handlers thin: they adapt input, call one use case and render or return the result. _Why: business rules in handlers cannot be reused or tested without the framework._
- No database queries in presentation or transport code. _Why: it couples the API shape to the storage shape._
- Scale layering to real complexity: no empty layers, no repository interface without concrete queries, no forwarding service that only calls the next layer. _Why: ceremony makes the next change slower, not safer._

## Boundaries and dependency direction

- Each module exposes a deliberate public entry point (e.g. `index.ts`); other modules import only from it. Inside a module, import local files directly, not the module's own entry point. _Why: internals can change without breaking callers, and self-imports create cycles._
- Dependencies point one way. A typical frontend: `app → pages → features → entities → shared`. Lower layers never import upward; a feature never imports another feature's internals. _Why: one-way dependencies keep modules replaceable and builds incremental._
- No circular dependencies between modules. If two modules need each other, extract the shared part or invert one dependency. _Why: cycles make every change a change to both._
- When composition needs a cross-module read, expose an explicit read projection from the owning module instead of reaching into its storage. _Why: the owner stays the only writer of its data._
- Change a boundary deliberately: consult the `architect` agent, update this file, then move the code. _Why: boundaries that drift silently stop being boundaries._

## Contracts and types

- A runtime schema (Zod, JSON Schema, Pydantic, …) is the single source of truth for a request or response; infer the static type from it. _Why: a hand-written interface next to a schema drifts._
- Shared contracts live in a shared package and import no app code, UI framework, server framework or database client. _Why: anything a contract imports, every consumer inherits._
- Keep domain models, API contracts, persistence models and UI state distinct, but do not duplicate identical shapes just to have separate files. _Why: different lifecycles need different types; identical ones need one._
- Do not collect unrelated domains into global `types.ts`, `utils.ts` or `schemas.ts` files. _Why: a global grab-bag becomes everyone's dependency._
- The module that persists a payload owns its serialization and its migrations. _Why: only the owner knows every stored version._

## Security boundaries

- Validate untrusted input at the boundary, strictly (reject unknown fields). _Why: whatever passes the boundary is trusted everywhere after it._
- Authorize every resource on the server by owner or tenant, not by an ID the client sent. _Why: IDs are guessable; ownership checks are not._
- Keep credentials and provider keys on the server. _Why: anything sent to a browser is public._
- Request a security review whenever any of these change. _Why: trust-boundary bugs rarely show up in functional tests._

## Tests and runtime use the same wiring

- Tests build the application through the same factory or composition root as production. _Why: a test that wires providers differently tests a different app._
- Tests get disposable databases, and test infrastructure refuses any database that does not look disposable (for example by name). _Why: one misconfigured env var should not wipe a real database._

## Monorepo rules

- One package manager, a pinned lockfile, and a pinned runtime version (`.node-version`, `engines`). _Why: reproducible installs are the base of reproducible checks._
- Shared packages build before their consumers; let the task runner enforce the order (`dependsOn: ["^build"]`). _Why: consumers otherwise typecheck against stale output._
- Root scripts are the interface: `build`, `typecheck`, `test`, `test:unit`, `test:e2e`, `format`, `check`. Agents run these, not underlying tools with ad-hoc flags. _Why: one known command per job is easier to keep correct._
- If the task runner caches results, declare every environment variable a build reads in the task's inputs. _Why: an undeclared input serves a stale build from cache._
- Never cache tasks that depend on external state (databases, network). _Why: a cached pass of a database test proves nothing._

## Example: TypeScript with npm workspaces and Turborepo

```text
apps/
  web/          # React SPA:  app/ → pages/ → features/ → entities/ → shared/
  api/          # HTTP API:   src/modules/<domain>/{http, service, repository}
packages/
  shared/       # runtime schemas + inferred types, per domain: @acme/shared/billing
  ui/           # presentation primitives; React as a peer dependency, no app imports
scripts/
  check-repo-hygiene.mjs
```

`package.json`:

```json
{
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "build": "turbo run build",
    "typecheck": "turbo run typecheck",
    "test": "turbo run test",
    "test:e2e": "npm run build && playwright test",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "check:hygiene": "node scripts/check-repo-hygiene.mjs",
    "check": "npm run check:hygiene && npm run format:check && npm run typecheck && npm test && npm run build"
  }
}
```

`turbo.json`:

```json
{
  "tasks": {
    "build": { "dependsOn": ["^build"], "env": ["NODE_ENV"], "outputs": ["dist/**"] },
    "typecheck": { "dependsOn": ["^build"], "outputs": [] },
    "test": { "dependsOn": ["build"], "outputs": [] },
    "api#test": { "dependsOn": ["build"], "cache": false }
  }
}
```

For another stack, keep the rules and swap the mechanics: Gradle or Maven modules with dependency rules, Go packages with `internal/`, Python packages with import-linter, Nx with module-boundary lint rules. What matters is that the boundary is enforced by a tool or a review, not just described.
