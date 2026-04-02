# AGENTS.md

Repo guide for `komari-theme-naive`.

## Snapshot

- Generated: Fri Apr 03 2026, Asia/Shanghai
- Branch: `master`
- Commit: `30e2df1`
- App: Vue 3 + Vite + Naive UI theme for Komari Monitor
- Package manager: `pnpm`
- Theme manifest: `komari-theme.json`

## What this repo is

- Builds a Komari theme, not a generic web app
- Release artifact is a zip package Komari can import
- Runtime app code lives under `src/`
- Runtime static assets include `public/images/`
- Release preview image is `docs/preview.png`

## Root structure

- `src/` app source
- `public/images/` runtime image contract, especially flags and logos
- `.github/` CI workflow and issue templates
- `docs/preview.png` release preview image
- `komari-theme.json` theme manifest consumed by the zip build
- `vite.config.ts` build, chunking, zip packaging
- `package.json` root commands
- `pnpm-workspace.yaml` workspace and catalog config

## Root commands

Run from repo root only.

```bash
pnpm dev
pnpm build
pnpm preview
pnpm lint
```

Notes:

- `pnpm build` runs type check plus production build
- `pnpm lint` runs oxlint and eslint with `--fix`
- There is no test suite in this repository
- Do not invent `pnpm test` or Vitest commands here

## Build and release contract

`pnpm build` must preserve the Komari packaging flow defined in `vite.config.ts`.

Expected output:

- `dist/`
- `komari-theme-naive-build-<sha>.zip`

Zip contents:

- `dist/`
- `komari-theme.json`
- `preview.png`

Current source of packaged preview:

- `docs/preview.png` on disk
- renamed to `preview.png` inside the zip

Do not change zip naming, manifest filename, or preview filename without updating the real build contract.

## CI facts

Source of truth: `.github/workflows/build-ci.yml`

CI does only:

1. `pnpm install`
2. `pnpm build`

CI does not run tests, because there is no test suite.

## Where to look

- Start at `package.json` for root commands
- Check `vite.config.ts` for build behavior, global constants, and zip packaging
- Check `komari-theme.json` for theme metadata and managed configuration schema
- Check `src/` for app behavior
- Check `public/images/` when code references image filenames directly
- Check `.github/workflows/build-ci.yml` for CI expectations
- Check `.github/ISSUE_TEMPLATE/` for issue intake shape

Contributor density, useful for triage:

- `src/components/` is a dense UI change area
- `src/utils/` is a dense logic and helper area
- `src/stores/` is central state, usually affected by cross-cutting changes

## Conventions seen in this repo

- Use `pnpm`, not npm or yarn
- Keep root guidance focused on build, packaging, manifest, and repo structure
- Preserve the `@` alias to `src` defined in `vite.config.ts`
- Treat `komari-theme.json` as release input, not optional metadata
- Treat `docs/preview.png` as release input, not just documentation art
- Respect existing generated outputs and naming patterns, especially `komari-theme-naive-build-<sha>.zip`
- Root verification is lint plus build, not tests

## Repo grounded anti-patterns

- Do not rename `komari-theme.json`
- Do not move or rename `docs/preview.png` casually
- Do not rename files under `public/images/flags/` or `public/images/logo/` without checking code references in `src`
- Do not change asset path conventions like `/images/flags/<code>.svg` or `/images/logo/...` blindly
- Do not add generic framework advice here that belongs in `src/AGENTS.md`
- Do not duplicate workflow specifics from `.github/AGENTS.md` or asset naming specifics from `public/images/AGENTS.md`

## Child guides

For local rules, defer to the nearest child guide:

- `src/AGENTS.md` for app code, component, store, router, and utility changes
- `.github/AGENTS.md` for workflow and issue template changes
- `public/images/AGENTS.md` for runtime image asset naming and compatibility rules

If a child guide exists, it overrides this root file for its subtree.
