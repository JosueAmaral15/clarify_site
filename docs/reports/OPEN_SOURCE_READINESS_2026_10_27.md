# Clarify Open-Source Release: Initial Assessment

Date: 2026-10-27
Phase: 1 - Protocol reading and initial release assessment
Decision: Prepare an MIT source release on GitHub; publish the website on Vercel.
Release status: NOT READY FOR PUBLICATION.

This is an initial assessment, not a completed source, history, dependency,
security, or license audit. No repository visibility or release was changed.

## Checkpoints

| Repository | Inspected HEAD | Initial worktree state |
| --- | --- | --- |
| Website, `JosueAmaral15/clarify_site` | `7012b120419c6b001180e7ee9949bd589e370765` | Two frontend files modified by the preceding build fix |
| Toolkit, `JosueAmaral15/clarify` | `dc6b7c09f32e02421f5bbcc8d1cbc5565c513b5b` | Existing editor, diagnostics, test, and history changes; untracked files |

The toolkit is on `COM-f2ce947a-7674-40b4-8bb3-64169750d06c` and has other
registered worktrees. An isolated worktree must be used for toolkit changes.
Do not change its active branch, stage its existing changes, or infer that its
HEAD is the intended public release commit.

## Verified Findings

### 1. GitHub publication and licensing

- `gh repo view JosueAmaral15/clarify --json nameWithOwner,visibility,licenseInfo,url`
  returned `PRIVATE` and `licenseInfo: null`.
- `gh release list --repo JosueAmaral15/clarify --limit 10 --json tagName,name,isDraft,isPrerelease,publishedAt`
  returned an empty list.
- The toolkit README links to `LICENSE` and describes MIT licensing, but the
  inspected tracked files contain no LICENSE, COPYING, or NOTICE file.
- `pyproject.toml` has no project license declaration.
- `CONTRIBUTING.md`, issue templates, and CI workflows exist.
- Root `SECURITY.md` is a historical Google Translate feature checklist, not a
  project-wide vulnerability reporting policy. Preserve that historical review
  when introducing a proper reporting policy.

### 2. Publication hygiene requires a dedicated review

- `history-chat.md` is tracked. Review its contents and history for material
  unsuitable for a public repository. Its existence alone is not a secret leak.
- The toolkit `.gitignore` does not currently include `.env`/`.env.*` rules.
  No tracked environment file matched the targeted inventory at this checkpoint.
- The website tracks `.env.example` templates, not its local `.env` files.
- No full-history secret scanner was run. No finding here certifies the absence
  of credentials, personal information, restricted examples, or third-party code.
- No files were removed and no Git history was rewritten.

### 3. Release versions and installers are inconsistent

| Location | Version |
| --- | --- |
| Toolkit `pyproject.toml` | `2.9.0` |
| Toolkit `src/__init__.py` | `2.9.46` |
| Toolkit README badge | `2.9.111` |
| Website download cards | `v2.9.111` |

The website has placeholder download URLs, hardcoded installer sizes, and a
Coming Soon alert. GitHub has no releases. Do not describe the displayed
installers, sizes, or versions as verified distribution artifacts.

Prefer a source-first release. Add platform installers only after each is
built, tested, accompanied by license notices, and uploaded with checksums.

### 4. Dependency licensing is not yet cleared

The toolkit depends on PySide6 and other third-party packages. MIT applies to
project-owned code; dependencies keep their own terms. Inventory the actual
Qt modules and packaged dependencies, confirm redistribution requirements,
and preserve required copyright and license notices. The targeted search for
several potentially relevant Qt modules returned no matches; that is not a
complete module or distribution license audit.

### 5. Historical quality claims are not current release evidence

`docs/reports/DEPENDENCY_SECURITY_AUDIT_2026_10_05.md` in the toolkit records a
locally audited dependency remediation candidate, while explicitly leaving
default-branch alert closure, restored CI, and historical Qt crash work open.
It also says the existing virtual environment contains non-lock extras.

Use a clean environment from the selected release commit and `poetry.lock`.
Verify current CI, security scans, and measured coverage. Do not treat the
README's static 97% badge or historical completion reports as certification.
No toolkit tests were executed in this documentation-only phase.

### 6. Vercel integration still needs validation

- Root `vercel.json` defines Vite frontend and Express backend services.
- Older deployment documentation assumes Vercel frontend plus Railway backend.
  Align documentation and configuration around the chosen deployment.
- The API client uses `VITE_API_URL` and otherwise falls back to
  `http://localhost:5000/api`. An older deployment guide documents
  `VITE_API_BASE_URL`, which the client does not read.
- Backend routes already include `/api`. Validate service routing without
  accidentally stripping or duplicating this prefix.
- Database and email connections start during backend initialization; verify
  their behavior in the Vercel runtime and configure secrets only server-side.
- Documentation cards in `DocsPage.tsx` prepend `/docs` to hrefs that already
  start with `/docs`, producing `/docs/docs/...` URLs.
- The frontend production build passed in the immediately preceding task with
  a non-blocking bundle-size warning. No deployed preview was tested here.

## Publication Gates

1. Select and record the toolkit release base, preserving current work.
2. Add MIT text and package metadata; verify ownership and third-party notices.
3. Complete source and Git-history hygiene reviews; rotate any real credential
   found before publication. Ignoring a file does not remove historical copies.
4. Reconcile versions and validate source installation in a clean environment.
5. Obtain passing CI, security, and coverage evidence for the exact candidate.
6. Validate Vercel preview routes and API-dependent flows; remove unsupported
   website claims and connect source/release/contribution links.
7. Review the concrete candidate with the owner before public visibility,
   public releases, primary-branch promotion, or production deployment.

## Rollback and Irreversibility

This phase adds documentation only. Revert its dedicated commit to undo these
changes while preserving the prior frontend fixes. There are no data migrations.

Future website rollback: record the last known-good deployment and configuration,
then restore that deployment and smoke-test its public routes and API.

Public source can be copied or forked. Returning a repository to private does
not recall copies or revoke rights already granted under MIT. Publication is
a final owner approval gate, not a reversible test.

## References

- [Execution plan](../plans/OPEN_SOURCE_RELEASE_PLAN.md)
- [GitHub licensing documentation](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository)
- [Qt for Python licensing](https://doc.qt.io/qtforpython-6/commercial/index.html)
- [Vercel Services](https://vercel.com/docs/services)
- [Vite on Vercel](https://vercel.com/docs/frameworks/frontend/vite)

These platform references were consulted in the preceding discussion. Recheck
current configuration requirements during implementation.
