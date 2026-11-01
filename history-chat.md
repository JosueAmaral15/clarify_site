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

## Security Follow-up (2026-11-01)

- Reviewed GitHub code-scanning alert #9 (CWE-829) and the linked project chat.
- Confirmed the alert was valid: `bervProject/railway-deploy@main` executed mutable
  third-party code while receiving a production Railway token.
- Confirmed GitHub `main` still contained that workflow; the earlier local Vercel
  workflow removed Railway but used a mutable `vercel@latest` CLI invocation.
- Owner approved using Vercel's native Git integration for both services.
- Removed `.github/workflows/deploy.yml` so GitHub Actions no longer handles
  Railway or Vercel production deployment tokens.
- Updated current operational documentation. Historical Railway instructions remain
  labeled as historical; no Vercel project setting, push, or deployment occurred.
- The alert should be verified by a fresh code scan after this branch is merged.

## Pull Request Validation (2026-11-01)

- Rebasing onto current `origin/main` completed without conflicts.
- Published the task branch and opened PR #36 against `main`.
- Repaired Dependabot merge damage in frontend package JSON and added the missing
  ESLint 9 backend flat configuration.
- Established an explicit lint migration baseline and recorded stricter rules as
  follow-up debt instead of refactoring unrelated legacy code in this deployment PR.
- Corrected duplicate coverage flags, removed an unavailable frontend coverage
  provider path, and repaired the jsdom Router/IntersectionObserver test setup.
- Final GitHub checks passed: frontend CI, backend CI, Vercel Preview build, and
  Vercel Preview Comments.
- Direct Preview HTTP checks reached Vercel's Deployment Protection login. Runtime
  route validation remains pending authenticated access; no production merge or
  deployment was performed.

## Authenticated Preview Validation (2026-11-01)

- Authenticated Vercel access exposed the backend's initial missing-`express`
  failure. The Services beta build output had lost dependency resolution.
- Switched the backend to its source entrypoint with `outputDirectory: "."`, the
  workaround tracked in Vercel issue #17651. Express then initialized correctly.
- Kept health and metadata routes alive without `MONGODB_URI`; database-backed
  routes return HTTP 503 immediately instead of waiting for Mongoose buffering.
- Configured Express proxy trust on Vercel and skipped SMTP verification when
  credentials are absent, removing startup validation errors and external calls.
- Commit `3ce4284` passed frontend CI, backend CI, Vercel, and Preview Comments.
  Its authenticated Preview rendered `/` and direct `/docs`; the frontend invoked
  the backend, whose runtime logs contained no warning, error, or fatal entries.
- The browser client blocked direct top-level navigation to JSON `/api` paths, so
  those response bodies were not claimed as observed. MongoDB, SMTP, login, and
  email delivery remain unverified until Preview-safe environment values exist.
- No local secrets were transmitted, and no merge or Production deployment was
  performed. Promotion remains a separate owner approval.
