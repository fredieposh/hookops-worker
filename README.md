# hookops-worker

Independently deployable background process roles for HookOps.

## Ownership

This repository owns worker process bootstrap and the background roles that
will coordinate schedules, dispatch ticks, execute outbound requests, maintain
results, and emit telemetry. Stage 0 implements only bootstrap, health,
observability, contract compatibility, and bounded dependency probes; queue and
domain behavior are introduced in later stages.

The worker consumes an exact version of `@fredieposh/hookops-shared`. Compose
files and cross-service smoke tests belong in `hookops-infra`, not this
repository.

## Repository layout

HookOps repositories are expected to be cloned as sibling directories:

```text
hookops/
├── hookops-shared/
├── hookops-api/
├── hookops-worker/
└── hookops-infra/
```

This layout allows `hookops-infra` to use sibling build contexts for local
integration testing.

## Package authentication

`@fredieposh/hookops-shared` is hosted on GitHub Packages. Before installing
dependencies, provide `NODE_AUTH_TOKEN` as a classic GitHub personal access
token with `read:packages` and access to the package.

For local development, copy `.env.example` to the ignored `.env` file, add your
local token value, and load it in a temporary subshell:

```bash
cp .env.example .env
# Edit .env and set NODE_AUTH_TOKEN without committing it.
(set -a; source .env; set +a; npm ci)
```

Never commit `.env`, a token value, or an authenticated `.npmrc`.

## Worker roles

Select the process role with `WORKER_ROLE`.

Stage 0 supports only:

- `bootstrap` — starts the worker's health and dependency-readiness process.

Run it locally with:

```bash
WORKER_ROLE=bootstrap npm run dev
```

The following role names are reserved for later stages and are not currently
implemented:

- `scheduler-control`
- `tick-dispatcher`
- `http-executor`
- `result-maintenance`
- `telemetry-emitter`

Selecting an unsupported or missing role causes startup to fail immediately.

## Local development

Node.js is pinned in `.nvmrc`.

```bash
nvm install
nvm use
npm run dev
```

Common commands:

```bash
npm run format
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
npm start
```

`npm start` runs the compiled output and therefore requires `npm run build`
first.
