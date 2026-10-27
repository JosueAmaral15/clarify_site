# Clarify Open-Source Release Plan

Created: 2026-10-27 17:33 America/Sao_Paulo
Task group: OSS in [docs/TASKS.md](../TASKS.md)
Protocol: Simplicity Protocol 3, supplied by the owner (version header 4.5)
Objective: Prepare an MIT source release on GitHub and a working website on Vercel.
Current state: Phase 1 complete; subsequent phases pending approval and evidence.

## Scope and Decisions

- Keep the Python/PySide6 toolkit and React/Vite website in their existing repos.
- Prepare MIT licensing, consistent with the README and the owner's acceptance
  of the recommendation. Dependency terms remain separate.
- Start with source installation. Produce installers in later release tasks,
  after platform-specific verification; do not invent download metadata.
- Preserve the existing frameworks, design, language conventions, and features.
- Use GitHub Issues and existing contribution guidance for community entry points.
- Validate the existing Vercel Services approach before changing its architecture.
- Use COM-UUID branches. Toolkit edits require an isolated worktree because its
  active worktree already contains unrelated editor changes.
- Keep reports and plans in `docs/`; keep summarized conversation memory in
  `history-chat.md`. Never record secrets in either.

## Phases

| Phase | Task | Deliverable | Status |
| --- | --- | --- | --- |
| 1 | OSS.1 | Protocol read; initial evidence and release plan | Complete |
| 2 | OSS.2 | Isolated toolkit candidate; MIT metadata and project reporting policy | Pending |
| 3 | OSS.3 | Source/history hygiene review and dependency notice inventory | Pending |
| 4 | OSS.4 | Consistent source release version, installation guide, and validation evidence | Pending |
| 5 | OSS.5 | Website source/release links, accurate download state, and tested Vercel preview | Pending |
| 6 | OSS.6 | Owner-approved GitHub publication and Vercel production deployment | Pending |

The supplied protocol says to wait for confirmation between phases. Report
the completed phase with its exact commit and validation, then request the
next phase. Keep publication approval separate from preparatory edits.

## Phase 2: Licensing and Community Files

1. Record the release base and create an isolated toolkit worktree on its own
   COM-UUID branch. Do not switch or stage the active editor worktree.
2. Read applicable repository instructions, contribution rules, packaging code,
   existing security guidance, and related history before editing.
3. Add the standard MIT text with the verified project copyright owner/year.
   Declare its license in `pyproject.toml` using the supported packaging syntax.
4. Add project-wide vulnerability reporting instructions. Preserve the old
   feature-specific security checklist under an appropriate documentation path.
5. Update README/contribution links only as needed to match actual files.
6. Validate metadata/lock consistency and document changed files and results.

Expected result: A reviewable licensing candidate; no public visibility change.
Rollback: Revert this phase's commit on its isolated branch. Never reset or
clean the original toolkit worktree.

## Phase 3: Publication Hygiene and Dependencies

1. Inventory tracked source, docs, examples, assets, plugins, and Git history
   reachable from all branches/tags intended for publication.
2. Run a redacting secret scanner on both current files and history. Reports
   should contain locations and rule identifiers, never secret values.
3. Review tracked chat histories and examples for private/restricted content.
   Present any proposed removal or history rewrite before executing it.
4. Add appropriate ignore rules for local credentials and generated artifacts.
   Preserve safe example templates; explain that ignore rules are not retroactive.
5. Inventory dependency licenses, the actual Qt modules, bundled code, fonts,
   icons, and other assets. Create accurate notices for each intended artifact.
6. Record confirmed findings, false positives, scanner version/commands, exact
   commit, and remaining limitations. Rotate any confirmed exposed credential.

Expected result: Documented publication hygiene evidence, with unresolved
findings explicitly blocking publication. No automatic history rewrite.
Rollback: Revert additive hygiene changes; credential rotation and public
disclosure cannot be undone by reverting code.

## Phase 4: Source Release Candidate

1. Reconcile package, runtime, README, and website version sources around the
   chosen candidate. Select the version from release history and current work.
2. Document clone, Python compatibility, locked dependency installation, GUI/CLI
   startup, tests, and optional AI-provider configuration.
3. Use a clean lock-only environment; the existing toolkit `.venv` is not proof
   of reproducibility. Do not replace the owner's environment.
4. Validate metadata/lock, CLI help, a temporary-file smoke workflow, test
   collection, then the existing module-based tests with offscreen Qt and limits.
5. Run current dependency/security checks and obtain CI, measured coverage,
   and quality-gate evidence required by the protocol for this exact commit.
6. Prepare release notes. Add platform binaries only when tested independently,
   with checksums and their required notices.

Expected result: A source candidate with reproducible installation and recorded
checks, including failed/skipped tests and external gate limitations.
Rollback: Revert candidate commits; preserve user data and existing environments.

## Phase 5: Website and Vercel Preview

1. Read affected routes, download components/services, backend entry points,
   tests, deployment workflows, and current Vercel documentation.
2. Fix duplicated documentation paths. Link source, license, contribution,
   issues, and release pages to the toolkit repository.
3. Replace placeholder installer metadata with an honest source-first state.
   Avoid promising downloads until GitHub visibility/releases make them usable.
4. Align the Vercel project root/services configuration with the actual topology.
   Configure `VITE_API_URL=/api` for a validated same-origin Services deployment,
   or use the actual HTTPS API URL if a separate backend is selected.
5. Keep database, SMTP, JWT, and service credentials server-side. Review any
   `VITE_*` setting as public browser data.
6. Run frontend/backend builds and focused tests for changed behavior; test
   desktop/mobile routes and navigation in a preview, including direct refresh
   on `/docs` and a nested docs route.
7. Smoke-test API routing/health, downloads, and any exposed login, contact,
   and newsletter workflows using disposable test data.
8. Record preview URL, commit, environment-variable names, test results,
   external quality gates, and the last known-good rollback target.

Expected result: A reviewable preview with functioning navigation and deployment
configuration. A build passing alone is not evidence of a functioning deployment.
Rollback: Revert this phase's commits and restore the recorded Vercel deployment
and settings. No database migration is included.

## Phase 6: Publication

Present the owner with the exact repository/commit, MIT text, review findings,
release contents, preview URL, validation evidence, and rollback target.

After explicit publication approval:

1. Promote reviewed candidates through passing pull requests/required checks.
2. Make the toolkit public and publish the approved tagged source release.
3. Deploy/promote the verified website candidate to Vercel production.
4. Test source access without authentication, license recognition, release
   links, documentation deep links, and any public API-dependent features.

If credentials or external quality platforms are unavailable, document exactly
which checks remain pending. Do not mark publication complete or substitute
historical reports for current evidence.

## Operational Limits

Run tests serially or by the repository's existing module runner. Use temporary
files/settings, offscreen Qt, per-test timeouts, and an overall wall limit.
For heavy jobs follow the protocol's RAM limits: default abort/reduce at 85%,
controlled shutdown at 90%, immediate termination at 95%. Do not run an
unbounded GUI suite in the owner's dirty active worktree.

## Evidence and Rollback

- [Initial assessment](../reports/OPEN_SOURCE_READINESS_2026_10_27.md)
- [Existing website rollback guide](../ROLLBACK_PLAN.md)
- Website starting HEAD: `7012b120419c6b001180e7ee9949bd589e370765`
- Toolkit inspected HEAD: `dc6b7c09f32e02421f5bbcc8d1cbc5565c513b5b`

Commit each approved phase separately with an English Conventional Commit
message. Stage only that phase's files. Never bundle unrelated editor work or
the earlier frontend fix into a release assessment commit.
