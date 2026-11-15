import { describe, expect, vi, onTestFinished, it } from 'vitest';
import { buildHealthServer, type Readiness } from './health-server.js';
import pino from 'pino';

function createTestServer(readiness: Readiness = { ready: true, components: {} }) {
  const checkReadiness = vi.fn(async () => readiness);
  const server = buildHealthServer(pino({ level: 'silent' }), checkReadiness);

  onTestFinished(() => server.close());
  return { server, checkReadiness };
}

describe('worker health server', () => {
  it('liveness', async () => {
    const { server, checkReadiness } = createTestServer();
    const response = await server.inject({ method: 'GET', url: '/health/live' });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ status: 'live' });
    expect(checkReadiness).not.toHaveBeenCalled();
  });

  it.each([
    { ready: true, statusCode: 200, status: 'ready' },
    { ready: false, statusCode: 503, status: 'not_ready' },
  ])('readiness reports $status', async ({ ready, statusCode, status }) => {
    const components = { postgres: { status: ready ? 'healthy' : 'unavailable' } };
    const { server, checkReadiness } = createTestServer({ ready, components });

    const response = await server.inject({ method: 'GET', url: '/health/ready' });

    expect(response.statusCode).toBe(statusCode);
    expect(response.json()).toEqual({ status, components });
    expect(checkReadiness).toHaveBeenCalledOnce();
  });
});
