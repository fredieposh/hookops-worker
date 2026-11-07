import { describe, it, expect, vi } from 'vitest';
import { type RoleRegistry, startWorker } from './role-registry.js';

describe('worker role bootstrap', () => {
  it('starts_selected_role', async () => {
    const start = vi.fn(async () => undefined);
    const roles: RoleRegistry = {
      bootstrap: {
        start,
      },
    };

    await startWorker('bootstrap', roles);

    expect(start).toHaveBeenCalledOnce();
  });

  it('rejects_unknown_roles', async () => {
    await expect(startWorker('scheduler-control')).rejects.toThrow(
      'Unsupported WORKER_ROLE: "scheduler-control"',
    );
  });
});
