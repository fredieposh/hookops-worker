import { startWorker } from './bootstrap/role-registry.js';

await startWorker(process.env.WORKER_ROLE);
