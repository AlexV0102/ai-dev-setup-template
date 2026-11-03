# Comments and tests

Always loaded. Both are cheap to write and expensive to keep, so each one has to pay for itself.

## Comments

| Write one for                                                                       | Leave it out when it                                                           |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| a business rule the code cannot express ("refunds close after 30 days by contract") | describes what the next line does                                              |
| an invariant callers rely on                                                        | is a heading for a block of code                                               |
| a workaround, with the bug or limit it works around                                 | repeats parameter and return types                                             |
| a choice that looks wrong but is deliberate                                         | names the ticket, the fix or the author (that is what commit messages are for) |

- Default to no comment; a clearer name or a smaller function usually does the job better. _Why: comments are not compiled, so nothing tells you when they become false._
- Keep a comment to the line or two above the code it explains. _Why: a comment far from its code drifts first._

## Tests

A test earns its place when it would **fail for a reason a user or caller would care about**:

- it reproduces a reported bug;
- it pins an acceptance criterion or a requirement;
- it covers a row of the edge-case matrix (retries, ownership, empty states, time zones).

Do not write tests whose only job is a coverage number, that restate the implementation line by line, or that check situations production cannot reach. _Why: they break on every refactor and catch nothing._

- Check results — returned values, stored data, status codes, what is on screen — rather than which internal function ran first. _Why: then a refactor that keeps behavior keeps the tests green._
- When behavior an existing suite covers changes, change that suite in the same commit. _Why: a suite that disagrees with the code is worse than none._
- New logic you chose not to test goes into the verification matrix as a NOT RUN row with the reason. _Why: the reviewer sees the gap and can ask for a test._
