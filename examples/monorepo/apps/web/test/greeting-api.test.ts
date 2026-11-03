import assert from 'node:assert/strict';
import { test } from 'node:test';
import { fetchGreeting } from '../src/features/greeting/api.ts';

const respond = (status: number, body: unknown) => async () =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

test('fetchGreeting returns a response that matches the contract', async () => {
  const greeting = await fetchGreeting(
    'Ada',
    respond(200, { message: 'Hello, Ada!', servedAt: '2026-01-01T00:00:00.000Z' }),
  );
  assert.equal(greeting.message, 'Hello, Ada!');
});

test('fetchGreeting rejects a response that breaks the contract', async () => {
  await assert.rejects(fetchGreeting('', respond(200, { message: 42 })));
});

test('fetchGreeting rejects an error status', async () => {
  await assert.rejects(fetchGreeting('', respond(500, { error: 'boom' })), /500/);
});
