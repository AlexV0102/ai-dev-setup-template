#!/usr/bin/env node
// Copies the template's agent setup into examples/monorepo with the
// placeholders filled in, so the example is a complete, ready-to-use repo.
// The template files are the source; never edit the copies in the example.
// The copies are formatted with the example's Prettier, so run `npm ci` in
// examples/monorepo once before syncing.
//
//   node scripts/sync-example.mjs           write the copies
//   node scripts/sync-example.mjs --check   exit 1 if any copy is out of date

import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const example = join(root, 'examples', 'monorepo');
const SYNCED = [
  'LICENSE',
  'AGENTS.md',
  'CLAUDE.md',
  '.claude',
  'docs',
  'templates',
  'scripts/check-repo-hygiene.mjs',
];
const VALUES = {
  PROJECT_NAME: 'Example monorepo',
  ONE_PARAGRAPH_PRODUCT_SUMMARY:
    'A minimal full-stack TypeScript monorepo: a web page asks the API for a greeting. It exists to show the agent setup working on real code; replace it with your product.',
  TASK_TRACKER_NAME: 'GitHub Issues',
  TASK_TRACKER_URL: "this repository's Issues tab",
  TASK_ID_PREFIX: 'EX',
  INSTALL_COMMAND: 'npm ci',
  DEV_COMMAND: 'npm run dev',
  CHECK_COMMAND: 'npm run check',
  E2E_COMMAND: 'npm run test:e2e',
  SINGLE_TEST_COMMAND: 'node --test apps/api/test/greeting.test.ts',
  COMMIT_FORMAT: 'type(scope): summary (EX-NNN)',
  STACK_AND_LAYOUT: `npm workspaces + Turborepo, Node.js 24 (runs TypeScript tests directly through type stripping).

- \`packages/shared\`: runtime schemas (Zod) and their inferred types, one entry point per domain (\`@example/shared/greeting\`). Imports no app code. Build it before consumers; Turborepo does this through \`^build\`.
- \`apps/api\`: Fastify. \`src/app.ts\` is the only composition root, used by \`server.ts\` and by tests (\`app.inject()\`, no TCP port). Modules live in \`src/modules/<domain>/\`: routes validate and delegate, services hold the logic, \`index.ts\` is the public entry point.
- \`apps/web\`: Vite, plain TypeScript. \`app/\` composes, \`features/<name>/\` holds UI (\`ui.ts\`) and the API client (\`api.ts\`, which parses responses with the shared schema). The dev and preview servers proxy \`/api\` to the API on 127.0.0.1:3001.
- \`tests/e2e\`: Playwright against the built app in Chrome (the installed Google Chrome), Firefox and WebKit; install the last two once with \`npx playwright install firefox webkit\`.
- \`AGENTS.md\`, \`CLAUDE.md\`, \`.claude/\`, \`docs/\`, \`templates/\` and \`scripts/check-repo-hygiene.mjs\` are generated from the template by \`scripts/sync-example.mjs\`; edit the template, not these copies.`,
};

function files(path) {
  if (!existsSync(path)) return [];
  if (statSync(path).isFile()) return [path];
  return readdirSync(path).flatMap((name) => files(join(path, name)));
}

function fill(text) {
  return text
    .replace(/<!-- TEMPLATE:[\s\S]*?-->\n\n?/g, '')
    .replace(/\{\{([A-Z0-9_]+)\}\}/g, (match, key) => VALUES[key] ?? match);
}

const prettier = join(example, 'node_modules', 'prettier', 'bin', 'prettier.cjs');

function format(target) {
  if (!existsSync(prettier)) {
    console.error('Prettier is missing: run `npm ci` in examples/monorepo first.');
    process.exit(1);
  }
  execFileSync(
    process.execPath,
    [prettier, '--config', join(example, '.prettierrc.json'), '--ignore-unknown', '--log-level', 'warn', '--write', ...SYNCED],
    { cwd: target, stdio: 'inherit' },
  );
}

function render(target) {
  for (const entry of SYNCED) {
    rmSync(join(target, entry), { recursive: true, force: true });
    cpSync(join(root, entry), join(target, entry), { recursive: true });
    for (const file of files(join(target, entry))) {
      writeFileSync(file, fill(readFileSync(file, 'utf8')));
    }
  }
  format(target);
}

if (!process.argv.includes('--check')) {
  render(example);
  console.log(`Synced ${SYNCED.join(', ')} into ${relative(root, example)}.`);
  process.exit(0);
}

const scratch = mkdtempSync(join(tmpdir(), 'sync-example-'));
try {
  render(scratch);
  const stale = SYNCED.flatMap((entry) => {
    const expected = files(join(scratch, entry)).map((f) => relative(scratch, f));
    const actual = files(join(example, entry)).map((f) => relative(example, f));
    const names = new Set([...expected, ...actual]);
    return [...names].filter((name) => {
      const a = join(scratch, name);
      const b = join(example, name);
      return !existsSync(a) || !existsSync(b) || readFileSync(a, 'utf8') !== readFileSync(b, 'utf8');
    });
  });
  if (stale.length) {
    console.error(`Example is out of date; run node scripts/sync-example.mjs:\n${stale.join('\n')}`);
    process.exit(1);
  }
  console.log('Example agent setup is in sync with the template.');
} finally {
  rmSync(scratch, { recursive: true, force: true });
}
