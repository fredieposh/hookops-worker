import { resolveCorrelationId } from '@fredieposh/hookops-shared';
import type { IncomingMessage } from 'node:http';

export const CORRELATION_ID_HEADER = 'x-correlation-id';

export function resolveRequestCorrelationId(request: IncomingMessage): string {
  return resolveCorrelationId(request.headers[CORRELATION_ID_HEADER]);
}
