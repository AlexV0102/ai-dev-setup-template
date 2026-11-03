---
paths:
  - '**/migrations/**'
  - '**/*.sql'
  - '**/schema.prisma'
---

# Database migrations

Example of a path-scoped rule: it loads only when the agent reads or edits a matching file. Adjust `paths` and the rules to your database and migration tool.

- Applied migrations are immutable; correct a mistake with a new migration. _Why: every environment that ran the old file would silently diverge._
- Create migrations with the tool's own generator. _Why: it keeps names and ordering consistent across branches._
- Expand, then contract: add the new shape, move the data, switch the code, and drop the old shape in a later release. _Why: during a rollout old and new code share one database._
- On big tables, change data in batches and prefer schema operations that do not hold long locks. _Why: a migration that blocks writes is downtime._
- One-time data corrections are operations, not migrations: review them separately and record what ran in the task evidence. _Why: migrations must replay cleanly on an empty database._
- Make sure a restorable backup exists before a destructive migration outside development. _Why: dropped data does not come back with a code revert._
- Run the migration against a disposable database, then the tests that use the changed tables. _Why: a valid schema does not prove the queries still work._
