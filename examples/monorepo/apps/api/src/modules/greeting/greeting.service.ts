import type { GreetingQuery, GreetingResponse } from '@example/shared/greeting';

export function createGreeting(query: GreetingQuery, now: Date = new Date()): GreetingResponse {
  return { message: `Hello, ${query.name ?? 'world'}!`, servedAt: now.toISOString() };
}
