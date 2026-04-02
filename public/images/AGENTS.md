# AGENTS.md

## Scope

`public/images` is a runtime asset directory, not a loose design workspace.

It mainly contains two catalogs:

- `flags/`, 258 country and region flag assets
- `logo/`, 33 OS and vendor logo assets

## Runtime contract

Filenames in this directory are part of the app contract.

Code under `src` builds asset paths from runtime values instead of importing files directly. Current linkage includes:

- `src/utils/regionHelper.ts`, `getRegionCode()`
- `src/utils/osImageHelper.ts`, `getOSImage()`
- components and views that render `/images/flags/${code}.svg`
- components and views that consume logo paths returned by `getOSImage()`

If a filename changes, the UI can break even when the asset still exists.

## Flags

`public/images/flags` uses uppercase region codes as filenames, for example `US.svg`, `HK.svg`, `EU.svg`.

This casing matters. `getRegionCode()` returns region codes that are used directly in `/images/flags/${code}.svg`.

When adding or replacing a flag:

- keep the filename aligned with the region code contract
- prefer the existing uppercase `*.svg` pattern
- do not casually change path, extension, or case

## Logos

`public/images/logo` is also contract driven. `getOSImage()` returns exact filenames such as:

- `/images/logo/os-ubuntu.svg`
- `/images/logo/os-openSUSE.svg`
- `/images/logo/os-OpenCloudOS.png`
- `/images/logo/os-synology.ico`

Do not normalize names, extensions, or case just for consistency. Some mixed case names and non-SVG formats are intentional because code references them exactly.

When adding a new logo, prefer matching the existing `os-*.svg` naming convention if the catalog already follows it for that asset type.

## Change rules

Before renaming, moving, removing, or replacing assets here:

1. check references under `src`
2. update any helper mapping that points to the filename
3. confirm the generated runtime path still matches the on-disk file exactly

Treat filename changes here as code changes, not content-only cleanup.
