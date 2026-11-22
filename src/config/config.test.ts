import { SUPPORTED_SCHEMA_MAJOR } from '@fredieposh/hookops-shared';
import { describe, it, expect } from 'vitest';
import { loadConfig } from './index.js';

const validEnvironment = {
  WORKER_ROLE: 'bootstrap',
  CONTRACT_MAJOR: String(SUPPORTED_SCHEMA_MAJOR),
  HEALTH_PORT: '3001',
};

describe('loadConfig', () => {
  it('parses validated startup configuration', () => {
    expect(loadConfig(validEnvironment, '1.2.3')).toEqual({
      serviceName: 'hookops-worker',
      serviceVersion: '1.2.3',
      role: 'bootstrap',
      contractMajor: SUPPORTED_SCHEMA_MAJOR,
      healthPort: 3001,
    });
  });

  it('uses safe local defaults', () => {
    expect(loadConfig({ WORKER_ROLE: 'bootstrap' })).toMatchObject({
      contractMajor: SUPPORTED_SCHEMA_MAJOR,
      healthPort: 3001,
    });
  });

  it.each([
    ['WORKER_ROLE', undefined],
    ['WORKER_ROLE', '   '],
    ['HEALTH_PORT', 'invalid'],
    ['HEALTH_PORT', '0'],
    ['HEALTH_PORT', '65536'],
  ])('rejects invalid %s (%s)', (name, value) => {
    expect(() => loadConfig({ ...validEnvironment, [name]: value })).toThrow(
      new RegExp(`^Invalid configuration: ${name}$`),
    );
  });
});
