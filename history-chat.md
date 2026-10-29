# Conversation History

Date: 2026-10-29
Project: Clarify Site
Scope: Vercel multi-service configuration, before open-source release Phase 2.

## User Request and Decisions

- Configure the repository as one Vercel project with multiple services.
- Inspect actual service callers and add bindings only for runtime function calls.
- Present the final JSON and confirm service names, public paths, and bindings.
- Owner confirmed `frontend` public at remaining paths including `/`, `backend`
  public at `/api` and `/api/*`, and no bindings.

## Inspected State

- Started on clean `main`, HEAD `1d57369`.
- Created `COM-97c8f3af-43e4-4dfb-9c43-70432b0bfe95` for this task.
- Frontend is a static SPA. Its browser calls Express; neither service calls
  the other server-side. SMTP/MongoDB are external infrastructure.
- Existing root services config lacked exact `/api` handling and SPA fallback.
- Auth/password/admin callers had separate localhost defaults and newsletter
  duplicated `/api`. Deployment automation still targeted frontend plus Railway.

## Changes Prepared

- Service-owned install/build/output/entrypoint settings and routing in root JSON.
- Shared public API base `/api`, caller fixes, and local Vite proxy.
- `/api` metadata and `/api/health`; keep existing local aliases. Export Express
  without opening its own listener in Vercel or tests.
- Repository-root Vercel deployment workflow, preserving main push deployment;
  corrected CI API variable
  and config-change triggers. No Railway deployment job remains.
- Focused regression tests, deployment guide, task entry, and execution plan.

## Verification and Limits

- Downloaded public Vercel schema and validated config with existing Ajv;
  meta-validation disabled for the upstream mixed-draft schema.
- Syntax-only transforms passed for 12 changed/new TypeScript files.
- Three changed workflow YAML files parsed. Diff whitespace check passed.
- Builds/focused tests were stopped or refused by the protocol's 85% system
  RAM guard. No successful full typecheck or test run is claimed.
- Temporary-cache `vercel dev` setup also hit that guard; CLI integration,
  project linking, runtime routing, database, and SMTP remain unverified.
- No deployment, push, production settings change, or toolkit edit was made.

## Next Steps

- Review final JSON with the owner.
- Run both builds/tests with adequate memory, then repository-root `vercel dev`
  and a preview with test infrastructure. Verify assets and SPA deep links.
- Configure the existing Vercel project at repository root and confirm Preview/
  Production environment values without exposing secrets.
- Obtain deployment approval separately. Open-source release Phase 2 stays pending.

Guide: [Vercel Services](docs/VERCEL_SERVICES.md).
Plan: [Execution plan](docs/plans/VERCEL_SERVICES_PLAN.md).

Keep this record summarized and free of secrets and unnecessary personal data.
