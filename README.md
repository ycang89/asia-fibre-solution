# Asia Fibre Solution monorepo

Two apps live under `apps/`:

| App | Stack | Dev command |
| --- | --- | --- |
| [apps/web](apps/web) | [Ant Design Pro v6](https://github.com/ant-design/ant-design-pro) (Umi Max 4, React 19, antd 6) | `cd apps/web && npm start` |
| [apps/api](apps/api) | [NestJS](https://nestjs.com/) 11 | `cd apps/api && npm run start:dev` |

## Prerequisites

Use **Node.js 20+** (this repo includes `.nvmrc` with **22**). Ant Design Pro v6 and current Supabase JS expect Node 20 or newer.

## Supabase

1. Create a project at [https://supabase.com](https://supabase.com).
2. Copy `apps/web/.env.example` → `apps/web/.env` and set `SUPABASE_URL` and `SUPABASE_ANON_KEY` (public anon key for the browser).
3. Copy `apps/api/.env.example` → `apps/api/.env` and set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (server only; keep secret).

The web app exposes a browser client in `apps/web/src/supabase/client.ts` (`getSupabaseBrowserClient` / `supabaseBrowserClient`). The API registers a global `SupabaseService` with `getAdmin()` for privileged server work.

## Local dev together

1. Terminal A: `cd apps/api && npm run start:dev` — API on [http://127.0.0.1:3000](http://127.0.0.1:3000), routes under `/api` (e.g. [http://127.0.0.1:3000/api](http://127.0.0.1:3000/api)).
2. Terminal B: `cd apps/web && npm start` — Umi dev server (default port **8000**). `config/proxy.ts` proxies `/api/*` to the Nest app so the frontend can call same-origin `/api/...`.

## Ant Design Pro

Upstream template: [ant-design/ant-design-pro](https://github.com/ant-design/ant-design-pro). Run `npm run simple` inside `apps/web` if you want the minimal layout (irreversible).
