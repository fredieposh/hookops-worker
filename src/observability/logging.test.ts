import { PINO_REDACTION_CENSOR } from '@fredieposh/hookops-shared';
import { describe, it, expect, onTestFinished } from 'vitest';
import { buildHealthServer } from '../health/health-server.js';
import { createLogger } from './logger.js';
import { CORRELATION_ID_HEADER } from './request-correlation.js';

const config = {
  serviceName: 'hookops-worker' as const,
  serviceVersion: '1.0.0',
  role: 'bootstrap',
};

describe('worker logging', () => {
  it('structured_context_and_redaction', async () => {
    let output = '';

    const destination = {
      write(message: string): void {
        output += message;
      },
    };

    const logger = createLogger(config, destination);

    const server = buildHealthServer(logger, async () => ({ ready: true, components: {} }));
    onTestFinished(() => server.close());

    server.post('/test/log-request', (request) => {
      request.log.info({ headers: request.headers, body: request.body }, 'fixture-text');
      return { status: 'ok' };
    });

    const correlationId = 'worker-request-123';

    const response = await server.inject({
      method: 'POST',
      url: '/test/log-request',
      headers: {
        [CORRELATION_ID_HEADER]: correlationId,
        authorization: 'Bearer authorization-sercret',
      },
      payload: { password: 'password-secret' },
    });

    expect(response.statusCode).toBe(200);
    expect(response.headers[CORRELATION_ID_HEADER]).toBe(correlationId);

    const entries = output
      .trim()
      .split('\n')
      .map((line) => JSON.parse(line) as Record<string, unknown>);

    expect(entries.length).toBeGreaterThan(0);
    for (const entry of entries) {
      expect(entry).toMatchObject({
        serviceName: 'hookops-worker' as const,
        serviceVersion: '1.0.0',
        role: 'bootstrap',
        correlationId,
      });
    }

    expect(output).toContain(PINO_REDACTION_CENSOR);
    expect(output).not.toContain('authorization-sercret');
    expect(output).not.toContain('password-secret');
  });
});
