import Fastify, { LogController } from 'fastify';
import type { Logger } from 'pino';
import {
  CORRELATION_ID_HEADER,
  resolveRequestCorrelationId,
} from '../observability/request-correlation.js';

export interface Readiness {
  readonly ready: boolean;
  readonly components: Readonly<Record<string, { readonly status: string }>>;
}

export type ReadinessCheck = () => Promise<Readiness>;

export function buildHealthServer(logger: Logger, checkReadiness: ReadinessCheck) {
  const app = Fastify({
    loggerInstance: logger,
    requestIdHeader: false,
    genReqId: resolveRequestCorrelationId,
    logController: new LogController({ requestIdLogLabel: 'correlationId' }),
  });

  app.addHook('onRequest', (request, reply, done) => {
    reply.header(CORRELATION_ID_HEADER, request.id);
    done();
  });

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
