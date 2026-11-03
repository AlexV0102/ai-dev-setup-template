#!/usr/bin/env node
// Fails when Git tracks files that must never be committed: environment files,
// local databases, dependencies, build and test output, generated code.
// Run it first in your check script; adjust FORBIDDEN and ALLOWED to the repo.

import { execFileSync } from 'node:child_process';

const FORBIDDEN = [
  [/(^|\/)\.env(\..+)?$/, 'environment file'],
  [/\.(sqlite|sqlite3|db)(-wal|-shm|-journal)?$/, 'local database'],
  [/\.(dump|bak)$/, 'database dump or backup'],
  [/(^|\/)node_modules\//, 'dependencies'],
  [/(^|\/)(dist|build|out)\//, 'build output'],
  [/(^|\/)(coverage|playwright-report|test-results)\//, 'test output'],
  [/(^|\/)\.(turbo|nx|next|cache)\//, 'tool cache'],
  [/(^|\/)scratch\//, 'scratch files'],
  [/\.(pem|key|p12|pfx)$/, 'private key or certificate'],
];
const ALLOWED = new Set(['.env.example']);

let tracked;
try {
  tracked = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })
    .split('\0')
    .filter(Boolean);
} catch {
  console.log('Repository hygiene: not a Git checkout, skipped.');
  process.exit(0);
}

const violations = tracked.flatMap((path) => {
  if (ALLOWED.has(path) || path.endsWith('/.env.example')) return [];
  const match = FORBIDDEN.find(([pattern]) => pattern.test(path));
  return match ? [`${path} (${match[1]})`] : [];
});

if (violations.length) {
  console.error(`Repository hygiene failed; these must not be tracked:\n${violations.join('\n')}`);
  process.exit(1);
}
console.log(`Repository hygiene: ${tracked.length} tracked files, none forbidden.`);
