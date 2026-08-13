import pino from 'pino';
const logger = pino({ name: 'hookops-worker' });

export async function start(): Promise<void> {
  logger.info('worker ready');
}
