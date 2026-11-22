import { SUPPORTED_SCHEMA_MAJOR } from '@fredieposh/hookops-shared';
import { describe, it, vi, expect } from 'vitest';
import { assessContractMajor } from './contract-major.js';

describe('assessContractMajor', () => {
  it('logs only bounded metadata for a mismatch', () => {
    const logger = { error: vi.fn() };

    assessContractMajor(SUPPORTED_SCHEMA_MAJOR + 1, logger);

    expect(logger.error).toHaveBeenCalledOnce();
    expect(logger.error).toHaveBeenCalledWith(
      {
        event: 'contract_major_mismatch',
        configurationContractMajor: SUPPORTED_SCHEMA_MAJOR + 1,
        compiledContractMajor: SUPPORTED_SCHEMA_MAJOR,
      },
      'Configured contract major does not match compiled contract major',
    );
  });
});
