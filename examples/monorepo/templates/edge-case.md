# Edge cases and verification backlog

This matrix is a test backlog, not a list of passed checks. Each stage updates the rows it touches with status and evidence (commit, suite, browser).

| ID   | Condition                                                   | Expected behavior                                                                          | Check                      | Status                                                    | Tasks      |
| ---- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------ | -------------------------- | --------------------------------------------------------- | ---------- |
| EC01 | Double click / repeated request after the response was lost | Exactly one accepted result and one side effect; no false "saved" on failure               | Concurrent HTTP + browser  | <Planned / Partially verified / Verified in M2 / NOT RUN> | <task IDs> |
| EC02 | Reload or server restart mid-flow                           | Correct resource, version and step restored; nothing lost                                  | HTTP + browser + database  |                                                           |            |
| EC03 | Another user's resource ID                                  | No access and no metadata leak                                                             | HTTP security              |                                                           |            |
| EC04 | Failure between two writes that belong together             | Whole transaction rolls back; retry gives one consistent result                            | Fault injection + HTTP     |                                                           |            |
| EC05 | Two tabs, different actions on the same resource            | First accepted action wins; conflict explained; reload syncs                               | Concurrent HTTP + browser  |                                                           |            |
| EC06 | Fast navigation; a stale response arrives late              | Stale response does not overwrite the current view                                         | Model test + browser race  |                                                           |            |
| EC07 | Midnight, DST day, timezone change                          | Calendar logic uses the user's zone; one event never counts twice                          | Unit with controlled clock |                                                           |            |
| EC08 | Long translations, 200% text size, narrow screen            | Text, controls and focus readable; no horizontal overflow                                  | Render + keyboard          |                                                           |            |
| EC09 | Empty state: no data yet, or everything done                | Clear empty state; no empty session or fake reward created                                 | Unit + browser             |                                                           |            |
| EC10 | Unknown version, old client, invalid contract               | Strict validation at the boundary; clear error or upgrade path                             | Schema + HTTP              |                                                           |            |
| EC11 | Storage busy, full or unavailable                           | Controlled error and safe retry; no partial write                                          | Fault integration          |                                                           |            |
| EC12 | Real browsers and assistive tech                            | Core journey passes in each supported browser; one engine is not reported as full coverage | Real browsers, E2E/manual  |                                                           |            |

Status vocabulary: **Planned**, **Partially verified** (say what is missing), **Verified in <milestone>** (with evidence), **NOT RUN**, **Post-release**.

## Reporting a defect

Type = Bug. Record:

- steps to reproduce, expected and actual behavior;
- version or commit, environment, browser and locale;
- minimal anonymized evidence (no cookies, tokens, emails or raw user data);
- the edge case or requirement it violates.

A fix comes with a regression test that fails before it, and a re-review plus E2E of the affected journey.
