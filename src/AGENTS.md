# Source Tree Guide

This document applies to `/src` only. Keep changes aligned with the current Vue 3, Vite, Pinia, and Naive UI structure already used here.

## Core architecture

- `main.ts` is bootstrap only. It creates the Vue app, installs Pinia and the router, loads global styles, and mounts `App.vue`. Do not move feature logic into bootstrap.
- `App.vue` is the app shell. It owns global layout, startup lifecycle wiring, loading transitions, `KeepAlive`, and calls into `initApp()` and `destroyInitManager()` from `@/utils/init`.
- `src/router/index.ts` defines exactly two routes:
  - `/` -> `@/views/HomeView.vue`
  - `/instance/:id` -> `@/views/InstanceDetail.vue`
- Router concerns stay limited to navigation and route transitions. Route guards here only drive global loading bar behavior through `window.$loadingBar`.

## Authoring conventions

- Use the Composition API with `<script setup lang="ts">`.
- Prefer `@/` imports for source-local modules instead of long relative paths.
- Keep files typed and repo-consistent with existing imports, computed state, and helper usage.

## Views

- Views orchestrate data already exposed by stores and utils.
- `HomeView.vue` coordinates search, grouping, view-mode selection, scroll restore, and route navigation.
- `InstanceDetail.vue` coordinates node detail presentation and chart tabs for a selected node.
- Keep `HomeView` named with `defineOptions({ name: 'HomeView' })` so `App.vue` `KeepAlive` inclusion keeps working.
- Heavy node and chart UI should stay lazily loaded with `defineAsyncComponent`, as already done for `NodeCard`, `NodeGeneralCards`, `NodeList`, `LoadChart`, and `PingChart`.

## Stores

- Pinia stores are setup stores and are the source of truth for app state.
- `@/stores/app` owns public settings, theme-derived config, login state, layout flags, formatting preferences, and persisted UI state.
- `@/stores/nodes` owns normalized node data, group derivation, WebSocket state, and node updates.
- Components and views should read from stores, not recreate parallel state for the same domain.
- When behavior depends on `publicSettings.theme_settings`, follow the existing defensive pattern in `@/stores/app`: `typeof` checks, guarded `JSON.parse`, valid-value filtering, and defaults.

## Utils

- `src/utils` owns transport, formatting, lookups, and startup orchestration.
- Keep API and RPC access in `@/utils/api` and `@/utils/rpc`.
- Keep startup, login modal flow, transport selection, polling, reconnects, and WebSocket fallback in `@/utils/init`.
- Keep formatting in helpers such as `@/utils/helper` and record shaping in `@/utils/recordHelper`.
- Keep region, OS, and tag lookup logic in their dedicated helper modules.
- Views and components must reuse these helpers instead of duplicating parsing, formatting, lookup, or transport code.

## Components

- Components render UI, especially the chart-heavy and node-heavy surfaces under `src/components`.
- `NodeCard.vue`, `NodeList.vue`, `NodeGeneralCards.vue`, `LoadChart.vue`, and `PingChart.vue` should stay presentation-focused, using store state and shared helpers rather than owning transport or theme parsing logic.
- If a component needs remote data, prefer consuming shared store state or shared RPC helpers already exposed by `@/utils/*`.
- Avoid embedding ad hoc parsing of theme settings inside components when the value can be normalized once in a store.

## Naive UI globals

- Naive UI provider setup lives in `@/components/Provider.vue`.
- Global provider APIs are exposed on `window.$message`, `window.$dialog`, `window.$notification`, `window.$loadingBar`, and `window.$modal`.
- These globals are typed in `src/types/global.d.ts`. Keep that file in sync if provider globals change.

## Validation

- Validate source-tree changes with:
  - `pnpm lint`
  - `pnpm build`
