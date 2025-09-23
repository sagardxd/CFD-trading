# Trading Monorepo

A CDF trading application on turborepo

https://github.com/user-attachments/assets/b1239a46-385b-4a16-bb09-d46957193b88

## Architecture ()

- **apps/backend**: HTTP API (Express). Auth, balances, orders. Uses Prisma + Postgres and Redis.
- **apps/ws-server**: WebSocket broadcaster for live price/order updates.
- **apps/engine**: Price/order engine and workers.
- **apps/poller**: Market data poller/ingestion.
- **apps/storage**: Background workers and storage helpers.
- **apps/client**: Mobile app (Expo React Native) consuming the API + WS.
- **packages/db**: Prisma schema, migrations, and generated client (shared).
- **packages/types**: Shared TypeScript types.
- **packages/config**: Shared config (env, logger, redis, response helpers).

Turbo orchestrates everything, Bun runs scripts.

## Prerequisites

- Bun installed s
- Postgres running (DATABASE_URL)
- Redis running (REDIS_URL)

## Setup

1) Install deps

```sh
bun install
```

2) Env files 

Create a `.env` at repo and `apps/client`, checkout .env.example

3) Prisma generate + migrate

```sh
turbo run db:generate   # runs prisma generate
turbo run db:migrate    # runs prisma migrate dev
turbo run db:deploy     # runs prisma migrate deploy

```

## Develop

Run all dev tasks via Turbo

```sh
bun run dev
```

Tip: You can also run per-app if desired (see scripts in each `apps/*/package.json`).
