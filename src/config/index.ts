import * as fs from 'node:fs';
import { SUPPORTED_SCHEMA_MAJOR } from '@fredieposh/hookops-shared';

export interface WorkerConfig {
  readonly serviceName: 'hookops-worker';
  readonly serviceVersion: string;
  readonly role: string;
  readonly healthPort: number;
  readonly contractMajor: number;
}

const packageJson = JSON.parse(
  fs.readFileSync(new URL('../../package.json', import.meta.url), 'utf8'),
);

function invalidConfiguration(name: string): never {
  throw new Error(`Invalid configuration: ${name}`);
}

function parseNumber(name: string, value: string, min: number, max: number) {
  const parsed = Number(value);

  if (value.trim() === '' || !Number.isInteger(parsed) || parsed < min || max < parsed) {
    invalidConfiguration(name);
  }

  return parsed;
}

export function loadConfig(
  environment: NodeJS.ProcessEnv = process.env,
  serviceVersion = packageJson.version,
): WorkerConfig {
  const role = environment.WORKER_ROLE;

  if (!role?.trim()) {
    invalidConfiguration('WORKER_ROLE');
  }

  return {
    serviceName: 'hookops-worker',
    serviceVersion,
    role,
    healthPort: parseNumber('HEALTH_PORT', environment.HEALTH_PORT ?? '3001', 1, 65_535),
    contractMajor: parseNumber(
      'CONTRACT_MAJOR',
      environment.CONTRACT_MAJOR ?? String(SUPPORTED_SCHEMA_MAJOR),
      1,
      Number.MAX_SAFE_INTEGER,
    ),
  };
}
