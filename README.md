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
2. Copy `apps/api/.env.example` → `apps/api/.env` and set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (server only; never expose in the browser).

The **web app does not talk to Supabase directly**; it calls your **Nest API** (`/api/...`). Nest owns the Supabase client (`SupabaseService` in `apps/api/src/supabase/`). You only add a `apps/web/.env` if you need other frontend-only variables.

If you later want **Supabase Auth in the browser** (PKCE, magic links, etc.), you can add `@supabase/supabase-js` back on the web with the **anon** key, or keep auth entirely in the API and use cookies / session tokens from Nest.

## Local dev together

1. Terminal A: `cd apps/api && npm run start:dev` — API on [http://127.0.0.1:3000](http://127.0.0.1:3000), routes under `/api` (e.g. [http://127.0.0.1:3000/api](http://127.0.0.1:3000/api)).
2. Terminal B: `cd apps/web && npm start` — Umi dev server (default port **8000**). `config/proxy.ts` forwards `/api/*` to **`http://localhost:3000`** (Nest). Override with `API_PROXY_TARGET` in `apps/web/.env`, or set `UMI_APP_API_ORIGIN=http://localhost:3000` to call Nest directly from the browser (bypasses proxy; Nest CORS already allows the dev UI origin).

## Ant Design Pro

Upstream template: [ant-design/ant-design-pro](https://github.com/ant-design/ant-design-pro). Run `npm run simple` inside `apps/web` if you want the minimal layout (irreversible).
