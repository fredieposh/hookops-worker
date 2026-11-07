export interface WorkerRole {
  start(): Promise<void>;
}

export type RoleRegistry = Readonly<Record<string, WorkerRole>>;

const bootstrapRole: WorkerRole = {
  async start(): Promise<void> {
    //  Stage 0 health and dependency behavior will be added in later tasks.
  },
};

export const roleRegistry: RoleRegistry = {
  bootstrap: bootstrapRole,
};

export async function startWorker(
  roleName: string | undefined,
  roles: RoleRegistry = roleRegistry,
): Promise<void> {
  const role = roleName ? roles[roleName] : undefined;

  if (!role) {
    throw new Error(`Unsupported WORKER_ROLE: ${JSON.stringify(roleName ?? null)}`);
  }

  await role.start();
}
