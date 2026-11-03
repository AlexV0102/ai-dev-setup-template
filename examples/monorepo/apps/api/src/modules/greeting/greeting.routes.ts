import type { FastifyInstance } from 'fastify';
import { greetingQuerySchema } from '@example/shared/greeting';
import { createGreeting } from './greeting.service.ts';

export async function greetingRoutes(app: FastifyInstance) {
  app.get('/hello', async (request, reply) => {
    const query = greetingQuerySchema.safeParse(request.query);
    if (!query.success) {
      return reply.code(400).send({ error: 'INVALID_QUERY' });
    }
    return createGreeting(query.data);
  });
}
