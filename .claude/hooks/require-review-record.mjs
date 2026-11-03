#!/usr/bin/env node
// PreToolUse hook. Refuses to open a pull request whose description lacks the
// review record from the `adversarial-review` skill:
//
//   <!-- review-record
//   status: done
//   ...
//   -->
//
// A user-approved exception is written as `status: waived` plus a `reason:`.
//
// Covers two ways an agent opens a PR:
//   - Bash: `gh pr create` with --body/-b inline or --body-file/-F <file>;
//   - any MCP tool whose name ends in `create_pull_request` (body in tool_input.body).
// A PR created without an explicit body (interactive editor, --fill) is refused,
// so the agent retries with the body spelled out.

import { existsSync, readFileSync } from 'node:fs';
import { isAbsolute, join } from 'node:path';

const RECORD = /<!--\s*review-record\b[\s\S]*?\bstatus:\s*(done|waived)\b[\s\S]*?-->/;
const MESSAGE =
  'This pull request has no review record. Run the adversarial-review skill and put its ' +
  '<!-- review-record ... --> block in the description. If the user waived the review, use ' +
  '"status: waived" with a "reason:" line. Pass the description explicitly (--body or --body-file).';

function deny() {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'deny',
        permissionDecisionReason: MESSAGE,
      },
    }),
  );
  process.exit(0);
}

function bodyFileHasRecord(command, cwd) {
  const flag = command.match(/(?:--body-file|-F)(?:=|\s+)("([^"]+)"|'([^']+)'|(\S+))/);
  if (!flag) return false;
  const name = flag[2] ?? flag[3] ?? flag[4];
  if (name === '-') return false;
  const path = isAbsolute(name) ? name : join(cwd, name);
  return existsSync(path) && RECORD.test(readFileSync(path, 'utf8'));
}

let input;
try {
  input = JSON.parse(readFileSync(0, 'utf8'));
} catch {
  process.exit(0);
}

const tool = input.tool_name ?? '';
const cwd = input.cwd ?? process.env.CLAUDE_PROJECT_DIR ?? '.';

if (/create_pull_request$/.test(tool)) {
  if (!RECORD.test(String(input.tool_input?.body ?? ''))) deny();
  process.exit(0);
}

const command = input.tool_input?.command ?? '';
if (!/\bgh\s+pr\s+create\b/.test(command)) process.exit(0);
if (RECORD.test(command) || bodyFileHasRecord(command, cwd)) process.exit(0);
deny();
