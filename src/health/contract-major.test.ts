import { SUPPORTED_SCHEMA_MAJOR } from '@fredieposh/hookops-shared';
import { describe, it, vi, expect } from 'vitest';
import { assessContractMajor } from './contract-major.js';

describe('assessContractMajor', () => {
  it.each([SUPPORTED_SCHEMA_MAJOR + 1, SUPPORTED_SCHEMA_MAJOR - 1])(
    'logs only bounded metadata for a mismatch (%i)',
    (configuredMajor) => {
      const logger = { error: vi.fn() };

      assessContractMajor(configuredMajor, logger);

      expect(logger.error).toHaveBeenCalledOnce();
      expect(logger.error).toHaveBeenCalledWith(
        {
          event: 'contract_major_mismatch',
          configuredContractMajor: configuredMajor,
          compiledContractMajor: SUPPORTED_SCHEMA_MAJOR,
        },
        'Configured contract major does not match compiled contract major',
      );
    },
  );
});
