# AGENTS.md

## Scope

This file guides changes under `.github/` for `komari-theme-naive`. Keep edits focused on the existing CI workflow and the issue templates. Do not add general source-code rules here.

## CI workflow rules

The repo currently has one workflow at `.github/workflows/build-ci.yml`.

Keep these behaviors intact unless the repository requirements clearly change:

- Trigger on `push` to `master`
- Trigger on `pull_request` targeting `master`
- Run on `ubuntu-latest`
- Install pnpm with version `10`
- Set up Node.js `24`
- Run `pnpm install`
- Run `pnpm build`
- Upload artifacts matching `komari-theme-naive-build*.zip`

## CI editing expectations

Preserve the current artifact naming pattern exactly. Downstream usage and release downloads expect `komari-theme-naive-build*.zip`.

Keep the workflow simple and repo-specific. Avoid adding matrix jobs, extra operating systems, extra package managers, release automation, or unrelated checks unless the repo actually needs them.

If CI changes are necessary, prefer the smallest possible update that still keeps the build reliable for this theme project.

Do not invent extra test stages. This repo's current GitHub Actions flow is a build-only workflow.

## Issue template rules

Issue templates live in `.github/ISSUE_TEMPLATE/` and currently cover:

- `bug_report.yml`
- `feature_request.yml`
- `config_help.yml`
- `config.yml`

When editing templates, keep them aligned with the theme's real support needs. The forms should help users report theme bugs, request theme improvements, and ask configuration questions that match actual Komari Theme Naive options and behavior.

Preserve fields that help diagnose theme-specific problems, such as:

- theme mode or view mode
- theme version
- Komari version
- current config or config examples
- screenshots or console logs when relevant

Do not add fields that ask for unrelated infrastructure details or generic project metadata that won't help triage this theme.

## Practical review standard

Before changing `.github/` files, check that:

- CI still builds the theme with pnpm 10 and Node 24
- workflow triggers still target `master` pushes and pull requests
- artifact uploads still use `komari-theme-naive-build*.zip`
- issue templates still reflect real configuration and reporting paths for this theme
- no extra GitHub workflow complexity has been introduced without a concrete repo need
