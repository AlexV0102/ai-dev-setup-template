import assert from 'node:assert/strict';
import { test } from 'node:test';
import { greetingResponseSchema } from '@example/shared/greeting';
import { buildApp } from '../src/app.ts';

test('GET /api/hello greets the world by default and matches the shared contract', async () => {
  const app = buildApp();
  const response = await app.inject({ method: 'GET', url: '/api/hello' });

  assert.equal(response.statusCode, 200);
  assert.equal(greetingResponseSchema.parse(response.json()).message, 'Hello, world!');
});

test('GET /api/hello greets by name', async () => {
  const app = buildApp();
  const response = await app.inject({ method: 'GET', url: '/api/hello?name=Ada' });

  assert.equal(response.json().message, 'Hello, Ada!');
});

test('GET /api/hello rejects invalid or unknown query parameters', async () => {
  const app = buildApp();
  for (const url of ['/api/hello?name=' + 'x'.repeat(41), '/api/hello?admin=true']) {
    const response = await app.inject({ method: 'GET', url });
    assert.equal(response.statusCode, 400, url);
  }
});
