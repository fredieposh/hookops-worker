import { startWorker } from './bootstrap/role-registry.js';
import { buildHealthServer } from './health/health-server.js';
import { createLogger } from './observability/logger.js';
import { loadConfig } from './config/index.js';

const config = loadConfig();
const logger = createLogger(config);

await startWorker(process.env.WORKER_ROLE);
logger.info({ event: 'worker_role_started' }, 'Worker role started');

const healthServer = buildHealthServer(logger, async () => ({ ready: true, components: {} }));

await healthServer.listen({
  host: '0.0.0.0',
  port: config.healthPort,
});
