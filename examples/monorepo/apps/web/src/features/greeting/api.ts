import { greetingResponseSchema, type GreetingResponse } from '@example/shared/greeting';

// Endpoint paths and response parsing live in the API client, not in the UI.
export async function fetchGreeting(
  name: string,
  fetchImpl: typeof fetch = fetch,
): Promise<GreetingResponse> {
  const query = name.trim() ? `?name=${encodeURIComponent(name.trim())}` : '';
  const response = await fetchImpl(`/api/hello${query}`);
  if (!response.ok) throw new Error(`Greeting request failed: ${response.status}`);
  return greetingResponseSchema.parse(await response.json());
}
