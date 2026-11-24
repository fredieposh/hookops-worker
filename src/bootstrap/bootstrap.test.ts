import { SUPPORTED_SCHEMA_MAJOR } from '@fredieposh/hookops-shared';
import pino from 'pino';
import { describe, it, expect, onTestFinished, vi } from 'vitest';
import { assessContractMajor } from '../health/contract-major.js';
import { buildHealthServer } from '../health/health-server.js';
import { createReadinessCheck } from '../health/readiness.js';
import { type RoleRegistry, startWorker } from './role-registry.js';

function createReadinessServer(contractMajor = SUPPORTED_SCHEMA_MAJOR) {
  const logger = pino({ level: 'silent' });
  const contract = assessContractMajor(contractMajor, logger);
  const server = buildHealthServer(logger, createReadinessCheck(contract));

  onTestFinished(() => server.close());
  return server;
}

describe('worker role bootstrap', () => {
  it('starts_selected_role', async () => {
    const start = vi.fn(async () => undefined);
    const roles: RoleRegistry = {
      bootstrap: {
        start,
      },
    };

    await startWorker('bootstrap', roles);

    expect(start).toHaveBeenCalledOnce();
  });

  it('rejects_unknown_roles', async () => {
    await expect(startWorker('scheduler-control')).rejects.toThrow(
      'Unsupported WORKER_ROLE: "scheduler-control"',
    );
  });
});

describe('contract-major readiness', () => {
  it('readiness_when_contract_major_matches', async () => {
    const server = createReadinessServer();
    const response = await server.inject({
      method: 'GET',
      url: '/health/ready',
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      status: 'ready',
      components: { contract: { status: 'compatible' } },
    });
  });

  it('readiness_on_contract_major_mismatch', async () => {
    const server = createReadinessServer(SUPPORTED_SCHEMA_MAJOR + 1);
    const response = await server.inject({
      method: 'GET',
      url: '/health/ready',
    });

    expect(response.statusCode).toBe(503);
    expect(response.json()).toEqual({
      status: 'not_ready',
      components: { contract: { status: 'incompatible' } },
    });
  });
});
