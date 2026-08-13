import { describe, it, expect } from 'vitest';
import { start } from '../src/index.js';

describe('worker boot', () => {
  it('resolves without throwing', async () => {
    await expect(start()).resolves.not.toThrow();
  });
});
