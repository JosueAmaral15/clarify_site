# Vercel Services Configuration

Date: 2026-10-29
Scope: Website repository only; open-source release Phase 2 remains pending.
Status: Configuration prepared; runtime/build validation incomplete due to RAM limits.
Owner confirmed the proposed names, public paths, and no internal bindings.

## Inspected Architecture

- `frontend`: static React/Vite SPA; Axios executes in the browser.
- `backend`: Express entrypoint `backend/src/server.ts`, exporting the app.
- Browser requests already use endpoint paths relative to an `/api` base.
- Express already declares `/api/auth`, `/api/downloads`, and other `/api` routers.
- No server-to-server requests between these services were found. MongoDB and
  SMTP are external infrastructure, not additional services in this repository.
- Internal bindings only resolve in runtime functions. A Vite browser bundle
  cannot use them. No unused binding or proxy service will be invented.
- Additional direct Axios callers in authentication/password/admin screens
  were reconciled with the shared public API base. Newsletter's duplicate
  `/api` prefix was removed.

## Proposed Work

1. Keep service names `frontend` and `backend`, pending owner confirmation.
2. Route `/api` and `/api/*` to backend without stripping the prefix; send all
   other traffic to frontend, with an SPA fallback inside that service.
3. Keep build/runtime settings on each service, not the configuration root.
4. Default the browser client to same-origin `/api`; retain an explicit public
   `VITE_API_URL` override. Add a Vite proxy for ordinary local development.
5. Expose health and API metadata within `/api`; retain existing local aliases.
6. Remove split frontend/Railway deployment automation and use the native Vercel
   Git integration for the repository-root multi-service project.
7. Verify focused API routing tests, both builds, configuration schema, and
   attempt repository-root `vercel dev`. Record missing credentials or services.
8. Present the complete final JSON and request explicit confirmation of service
   names, public/internal paths, and the no-binding topology before publication.

## Validation and Rollback

Run tests/builds serially with limits because this workstation has limited RAM.
Do not use real email deliveries or change the production database for tests.
No deployment or project linking is authorized by this configuration task.

Current evidence and setup: [Vercel Services guide](../VERCEL_SERVICES.md).
The CLI setup and focused test attempts were stopped/refused at the 85% RAM
guard. Configuration validation and diff whitespace checks passed; full build,
integration, and live-service checks remain pending.
Lightweight syntax validation passed for 12 changed/new TypeScript files;
the two retained CI workflow YAML files parsed successfully. The production
deployment workflow was removed after the owner approved native Git deployment.

Rollback consists of reverting this task's scoped commit/patch, preserving
other work, and restoring the previous Vercel deployment if later promoted.
No data migration or repository visibility change is included.

References:
- https://vercel.com/docs/services
- https://vercel.com/docs/services/routing
- https://vercel.com/docs/services/bindings
- https://vercel.com/docs/services/config-reference
- https://vercel.com/docs/frameworks/backend/express
