import { z } from 'zod';

// The schemas are the contract; the types are derived from them, never written by hand.
export const greetingQuerySchema = z.strictObject({
  name: z.string().trim().min(1).max(40).optional(),
});
export type GreetingQuery = z.infer<typeof greetingQuerySchema>;

export const greetingResponseSchema = z.strictObject({
  message: z.string(),
  servedAt: z.iso.datetime(),
});
export type GreetingResponse = z.infer<typeof greetingResponseSchema>;
