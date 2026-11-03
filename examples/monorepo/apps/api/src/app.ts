import Fastify from 'fastify';
import { greetingRoutes } from './modules/greeting/index.ts';

// The one composition root: the server and the tests both build the app here.
export function buildApp() {
  const app = Fastify({ logger: false });
  app.register(greetingRoutes, { prefix: '/api' });
  return app;
}
