# Verification matrix — <task or stage> — <date>

Tested commit: `<hash>` · Environment: <OS, runtime version, database, browsers with versions>

Every row is PASS, FAIL or NOT RUN. A check that ran against an older commit is NOT RUN for this one.

## Automated checks

| Check | Command | Result | Evidence |
|---|---|---|---|
| Baseline before change | `<command>` | PASS / FAIL | <counts; pre-existing failures> |
| Changed-behavior tests | `<command>` | | <RED run, then GREEN run> |
| Full gate | `{{CHECK_COMMAND}}` | | <hygiene, format, typecheck, N tests, build> |
| Browser E2E | `{{E2E_COMMAND}}` | | <per browser: passed/total, retries, flaky> |
| Repository hygiene / staged diff | `git status`, `git diff --cached --check` | | <only this stage's files> |

## Manual / browser checks

| Journey or state | Widths | Input | Locales / themes | Result | Notes |
|---|---|---|---|---|---|
| <Happy path, end to end> | 390 / 768 / 1440 | mouse, keyboard | <all> | | |
| <Reload mid-flow; server restart> | | | | | |
| <Request failure, then retry> | | | | | |
| <Empty and error states> | | | | | |
| <Persisted result checked in DB/API> | | | | | |

## Reviews

| Review | Scope | Findings | Resolution |
|---|---|---|---|
| code-reviewer | diff `<base>..<head>` | <n> | <fixed and re-checked / deferred with reason> |
| architect | <if boundaries changed> | | |
| security-reviewer | <if trust boundaries changed> | | |
| adversarial-review | <before PR> | <held/unproven/refuted> | |

## Not run and limitations

- NOT RUN: <check> — <why: missing device, deferred by user, needs production>
- Limitations: <what these results do not prove, e.g. emulated WebKit is not native Safari; no deployment performed>

## History

- <Failed or retried runs and their cause, e.g. "first run failed on a wrong fixture selector; corrected, behavior assertions unchanged">
