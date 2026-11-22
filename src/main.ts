import { startWorker } from './bootstrap/role-registry.js';
import { buildHealthServer } from './health/health-server.js';
import { createLogger } from './observability/logger.js';
import { loadConfig } from './config/index.js';
import { createReadinessCheck } from './health/readiness.js';
import { assessContractMajor } from './health/contract-major.js';

const config = loadConfig();
const logger = createLogger(config);

await startWorker(process.env.WORKER_ROLE);
logger.info({ event: 'worker_role_started' }, 'Worker role started');

const contractStatus = assessContractMajor(config.contractMajor, logger);
const readinessCheck = createReadinessCheck(contractStatus);

const healthServer = buildHealthServer(logger, readinessCheck);

await healthServer.listen({
  host: '0.0.0.0',
  port: config.healthPort,
});
