import { startWorker } from './bootstrap/role-registry.js';
import { buildHealthServer } from './health/health-server.js';

await startWorker(process.env.WORKER_ROLE);

const healthServer = buildHealthServer(async () => ({ ready: true, components: {} }));

await healthServer.listen({
  host: '0.0.0.0',
  port: Number(process.env.PORT ?? 3001),
});
