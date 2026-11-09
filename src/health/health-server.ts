import Fastify from 'fastify';

export interface Readiness {
  readonly ready: boolean;
  readonly components: Readonly<Record<string, { readonly status: string }>>;
}

export type ReadinessCheck = () => Promise<Readiness>;

export function buildHealthServer(checkReadiness: ReadinessCheck) {
  const app = Fastify();

  app.get('/health/live', () => ({ status: 'live' }));

  app.get('/health/ready', async (_request, reply) => {
    const { ready, components } = await checkReadiness();

    return reply.code(ready ? 200 : 503).send({
      status: ready ? 'ready' : 'not_ready',
      components,
    });
  });

  return app;
}
