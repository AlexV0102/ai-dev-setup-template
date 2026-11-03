#!/usr/bin/env node
// PreToolUse hook for Bash. A dev server or watcher started in the foreground
// never exits, so the agent's turn hangs and the process lingers afterwards.
// Such commands are denied unless they run in the background; the reason tells
// the agent what to do instead. Edit LONG_RUNNING for your stack.
//
// Opt out per repository: create an empty `.claude/allow-long-running` file.

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const LONG_RUNNING = [
  [
    /(^|[\s;&|(])(npm|pnpm|yarn|bun)\s+(run\s+)?(dev|start|serve|watch|preview)(:[\w-]+)?\b/,
    'a dev, start or preview script',
  ],
  [
    /(^|[\s;&|(])(npx\s+)?turbo\s+(run\s+)?(dev|start|watch)\b|(^|[\s;&|(])(npx\s+)?turbo\s+watch\b/,
    'a persistent Turborepo task',
  ],
  [/(^|[\s;&|(])(npx\s+)?vite(\s+(dev|serve|preview)\b|\s+-|\s*($|[;&|)]))/, 'a Vite server'],
  [
    /(^|[\s;&|(])(npx\s+)?(next\s+(dev|start)|nodemon|webpack\s+serve|astro\s+(dev|preview))\b/,
    'a dev server',
  ],
  [/\s--watch(All)?\b/, 'a watch mode'],
  [
    /(^|[\s;&|(])docker\s+compose\s+up\b(?![^;&|]*\s(-d|--detach|--wait)\b)/,
    'an attached docker compose',
  ],
];

function decide(reason) {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'deny',
        permissionDecisionReason: reason,
      },
    }),
  );
}

let input;
try {
  input = JSON.parse(readFileSync(0, 'utf8'));
} catch {
  process.exit(0);
}

const projectDir = process.env.CLAUDE_PROJECT_DIR ?? input.cwd ?? '.';
if (existsSync(join(projectDir, '.claude', 'allow-long-running'))) process.exit(0);

const command = input.tool_input?.command ?? '';
if (!command || input.tool_input?.run_in_background) process.exit(0);

const match = LONG_RUNNING.find(([pattern]) => pattern.test(command));
if (match) {
  decide(
    `This command starts ${match[1]} in the foreground and will not exit. ` +
      'Run it with run_in_background, or use the one-shot equivalent (build, test without watch, compose up --wait).',
  );
}
process.exit(0);
