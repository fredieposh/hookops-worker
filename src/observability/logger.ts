import { PINO_REDACTION_CENSOR, createPinoRedactionPaths } from '@fredieposh/hookops-shared';
import pino from 'pino';
import type { WorkerConfig } from '../config/index.js';

export type loggerConfig = Pick<WorkerConfig, 'serviceName' | 'serviceVersion' | 'role'>;

export function createLogger(
  config: loggerConfig,
  destination?: pino.DestinationStream,
): pino.Logger {
  const options: pino.LoggerOptions = {
    base: {
      serviceName: config.serviceName,
      serviceVersion: config.serviceVersion,
      role: config.role,
    },
    redact: {
      paths: createPinoRedactionPaths(),
      censor: PINO_REDACTION_CENSOR,
    },
  };

  return destination ? pino(options, destination) : pino(options);
}
