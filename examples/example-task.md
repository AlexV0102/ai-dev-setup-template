# NOTE-042 · Export saved notes as CSV

A filled-in example of [templates/task.md](../templates/task.md) for a fictional notes app. Commit hashes and numbers are invented.

| Property | Value |
|---|---|
| Status | Done |
| Type | Task |
| Priority | Medium |
| Scope | MVP |
| Milestone | M4 · Data portability |
| Requirements | R09 (users can take their data with them), R03 (ownership) |
| Edge cases | EC01 (repeated request), EC03 (another user's data), EC08 (long text, narrow screen) |

## Context and goal

Users asked to move their notes to a spreadsheet. A signed-in user can download all their notes as a CSV file from the Account page.

## Acceptance criteria

- [x] "Export CSV" on the Account page downloads `notes-YYYY-MM-DD.csv` with columns `title, created_at, updated_at, tags, body`.
- [x] Only the signed-in user's notes are exported; an export request carrying another user's ID is rejected with 404 and no data.
- [x] Commas, quotes, newlines and non-Latin text survive a round trip through a spreadsheet; cells starting with `=`, `+`, `-` or `@` are escaped against formula injection.
- [x] A user with no notes gets a file with only the header row, and the button explains that.
- [x] Double-clicking the button starts one download; a failed request shows a retry message and no partial file.
- [x] Keyboard accessible; works at 320 px without horizontal scroll.

## Out of scope

- Import from CSV (NOTE-051).
- Scheduled or emailed exports.

## Dependencies

- NOTE-030 (account sessions) — Done.

## Plan and stages

1. Contract and serializer: `GET /api/notes/export` response schema; pure CSV serializer with escaping — unit tests.
2. Endpoint: owner-scoped query, streaming response, rate limit — HTTP tests, security review.
3. UI: button, empty and error states — browser E2E, manual check.

## Results / evidence

### Stage 1 — contract and serializer — DONE

- Commit: `0a1b2c3` (local, not pushed)
- PASS serializer unit tests 14/14 (RED first: 9/14 failed on quoting and formula escaping)
- PASS `npm run check`: hygiene, format, typecheck, 212 API + 31 UI tests, build
- Reviews: code-reviewer — no findings
- NOT RUN: E2E (no UI yet)

### Stage 2 — endpoint — DONE

- Commit: `4d5e6f7` (local, not pushed)
- PASS HTTP tests 9/9: owner-only, foreign ID → 404, empty export, rate limit after 5 requests/minute
- PASS `npm run check`: 221 API + 31 UI tests
- Reviews: security-reviewer — 1 finding (export reused a cached list across sessions), fixed and re-checked; code-reviewer — none
- NOT RUN: browser E2E (UI pending)

### Stage 3 — UI — DONE

- Commit: `8a9b0c1` (local, not pushed)
- PASS `npm run check`: 221 API + 35 UI tests
- PASS `npm run test:e2e`: Chrome 48/48, Firefox 48/48, WebKit 48/48, 0 retries
- PASS manual: export with 3 notes and with none; opened the file in a spreadsheet app with Cyrillic and emoji titles; double click → one download; API stopped → retry message, then success after restart; keyboard only; 320/768/1440 px
- Reviews: code-reviewer — 1 finding (focus lost after download), fixed; adversarial-review before PR — 2 rounds, 4 findings: 1 held (fixed), 3 refuted
- NOT RUN: native Safari, screen reader
- Limitations: exports above 10,000 notes not measured; nothing deployed

### Edge-case matrix updates

| ID | Status | Evidence |
|---|---|---|
| EC01 | Verified in M4 | Stage 3 E2E double-click case, Stage 2 rate-limit test |
| EC03 | Verified in M4 | Stage 2 foreign-ID test, security review |
| EC08 | Partially verified | 320 px and long titles PASS; 200% text size NOT RUN |
