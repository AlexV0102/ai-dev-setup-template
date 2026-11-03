import { buildApp } from './app.ts';

const port = Number(process.env.PORT ?? 3001);
const app = buildApp();

await app.listen({ host: '127.0.0.1', port });
for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.once(signal, () => void app.close());
}
