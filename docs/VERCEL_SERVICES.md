# One Vercel Project, Two Services

Updated: 2026-11-01
Status: Local configuration prepared; deployment validation pending.

This is the current deployment guide for this task. Older Railway and
frontend-only instructions do not describe the multi-service configuration.

## Topology Confirmed by the Owner

| Service | Root | Framework | Public paths | Internal bindings |
| --- | --- | --- | --- | --- |
| `backend` | `backend` | Express | `/api` and `/api/*` | None |
| `frontend` | `frontend` | Vite | All remaining paths | None |

Both services share one domain and deployment. The browser calls `/api` on
that domain. There are no server-side calls between the two services; MongoDB
and SMTP are external infrastructure, not Vercel services in this repository.

The owner explicitly confirmed: "Keep frontend/backend public; no bindings".
Review the final JSON before deployment as requested.

## Routing Contract

Root `vercel.json` owns public traffic. The exact `/api` rewrite and then
`/api/(.*)` go to Express before the frontend catch-all. Vercel preserves the
original request path, so backend routers retain their `/api` prefix.

The frontend service's own rewrite falls back to `index.html` for React Router
navigation. It cannot consume API traffic already routed to the backend.

Expected responses:

- `/`: frontend HTML.
- `/docs` and nested UI URLs: frontend SPA, including a direct page refresh.
- `/api`: backend metadata.
- `/api/health`: backend process health (not proof of database/SMTP readiness).
- `/api/users/me`: backend authentication required.
- `/api/not-a-route`: backend JSON 404, never frontend HTML.
- Static frontend assets: actual JavaScript/CSS/images, not index HTML.

`frontend/src/services/apiConfig.ts` defines the shared public API base,
defaulting to `/api`. All browser clients append paths without another `/api`.
`VITE_API_URL` may override this with a complete public API base ending in
`/api`; it is not an origin-only setting. Do not use `VITE_API_BASE_URL`.

## Why There Are No Bindings

Bindings only resolve inside server-side functions at runtime. The frontend
here is a static Vite bundle executing on a user's computer. Injecting a
`BACKEND_URL` binding would not make it usable in that browser or at build time.

If an actual server-side caller is introduced later, declare its binding on
that caller with all fields, for example:

```json
{"type":"service","service":"backend","format":"url","env":"BACKEND_URL"}
```

Only that new server function should read `process.env.BACKEND_URL`. Never set
a bound variable manually, expose it through `VITE_*`, or read it in middleware.
Making the backend private would also require a server-side proxy for browsers.
That architecture is not part of the confirmed two-service configuration.

## Vercel Setup

1. Use one Vercel project connected to this repository, with repository root
   `.` rather than `frontend`. The root `vercel.json` defines both services.
2. Remove old project-wide build/output/framework overrides that conflict with
   service-owned settings. Use the current Services import/setup flow.
3. Each service installs with `npm ci` and builds with its own `npm run build`.
   Frontend output is `dist`; backend entrypoint is `src/server.ts`.
4. Set environment values in Vercel for the intended Preview/Production scope.
   Do not copy a development `.env` into a production deployment.
5. Keep `VITE_API_URL` unset or set it to `/api` for this same-domain topology.
   Replace any existing localhost, Railway, or fixed production-host override
   before building a preview. `VITE_*` values are public build-time data.
6. Configure `MONGODB_URI`, `JWT_SECRET`, and `JWT_REFRESH_SECRET` for the backend.
   Configure SMTP variables for email features: `SMTP_HOST`, `SMTP_PORT`,
   `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, and `ADMIN_EMAIL`.
7. Set `FRONTEND_URL` to the actual public site origin for CORS and links in
   email. Preview email links need a preview-specific origin; do not invent a
   domain or assume the production origin works for every preview.
8. Verify a preview before production promotion. No project settings, secrets,
   database contents, repository visibility, or deployment were changed here.

## Local Development

From the repository root, with the current Vercel CLI installed and the project
linked to the correct existing project:

```bash
vercel dev --listen 3100
```

This is the integration test command for both services and the public route
table. Supply local/test MongoDB and email settings, not production data.

Ordinary development also works with backend `npm run dev` and frontend
`npm run dev` in separate terminals. Vite proxies `/api` to
`http://localhost:5000` without changing the prefix. This proxy exists only in
the Vite dev server; it is not an internal binding or deployment configuration.

## Deployment Automation

Use Vercel's native Git integration as the only deployment mechanism. Connect
this repository to one Vercel project at repository root `.` and configure
`main` as its Production Branch. Pull requests should create Preview deployments;
pushes to `main` should create Production deployments.

There is deliberately no `.github/workflows/deploy.yml`. The previous workflow
executed third-party deployment code while exposing production tokens, which was
reported as CWE-829 by GitHub code scanning. Removing it also avoids duplicate
deployments and keeps `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID`
out of GitHub Actions. Retain the frontend and backend CI workflows for checks.

After the Vercel project is connected, verify the configured root, Production
Branch, Preview behavior, and environment scopes in the Vercel dashboard before
merging or promoting a deployment. No dashboard setting was changed locally.

## Validation and Limits

- Root configuration checked against the downloaded public Vercel schema:
  passed using the existing Ajv validator with schema meta-validation disabled
  because the upstream schema mixes draft-04 metadata and newer constraints.
  This is not a cloud build or full Vercel runtime validation.
- Diff whitespace check: passed.
- Syntax-only esbuild transforms: passed for 12 changed/new TypeScript files.
  This does not replace TypeScript semantic checking or production builds.
- The two retained CI workflow files parsed successfully with `js-yaml`; the
  production deployment workflow was removed.
- Browser API caller inventory: shared base used; localhost fallbacks and the
  duplicate newsletter prefix removed.
- Regression tests added for the API base, public override, token refresh,
  newsletter prefix, metadata/health paths, authentication, and API 404s.
- Builds, focused tests, and `vercel dev` are not certified as passing. This
  workstation repeatedly exceeded the protocol's 85% RAM guard. The baseline
  backend build was stopped; guarded checks were refused or terminated.
- Vercel CLI was not installed globally. Its temporary-cache `vercel dev`
  attempt was stopped during setup. The project has not been linked or deployed.

Before promotion, run both builds and focused tests on a machine with enough
RAM, then test the full route table and assets with `vercel dev` and a preview:

```bash
npm --prefix frontend run build
npm --prefix backend run build
cd frontend
npx vitest run src/__tests__/utils/api.test.ts --maxWorkers=1
cd ../backend
npx jest src/__tests__/unit/service-routing.test.ts --runInBand
```

Run the existing CI suites too. The mocked routing test does not certify live
MongoDB, SMTP, login, or email delivery. Production rate limits use the existing
implementation; distributed rate-limit storage is outside this change.

## Rollback

Revert only this task's scoped changes/commit; no data migration is involved.
If deployed later, restore the last known-good Vercel deployment and associated
settings, then verify frontend routes, `/api/health`, and API authentication.

## Official References

- [Services](https://vercel.com/docs/services)
- [Routing and original paths](https://vercel.com/docs/services/routing)
- [Runtime service bindings](https://vercel.com/docs/services/bindings)
- [Service-owned configuration](https://vercel.com/docs/services/config-reference)
- [Express entrypoints and exports](https://vercel.com/docs/frameworks/backend/express)
