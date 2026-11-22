import type { ContractMajorStatus } from './contract-major.js';
import type { ReadinessCheck } from './health-server.js';

export function createReadinessCheck(contract: ContractMajorStatus): ReadinessCheck {
  const readiness = {
    ready: contract.compatible,
    components: {
      contract: { status: contract.compatible ? 'compatible' : 'incompatible' },
    },
  };

  return async () => readiness;
}
