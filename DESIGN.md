# Komari Naive Design System

## 1. Direction

Komari Naive is a quiet operational dashboard. Preserve Naive UI's restrained green accent, neutral surfaces, fine borders, compact typography, and optional translucent background treatment. Optimization should improve scan speed and information density without turning the monitor into a decorative landing page.

Reference note: Komari Emerald informs the group-aware summary behavior and compact dashboard hierarchy. Its globe, visitor, finance, and decorative surface treatments are intentionally excluded to preserve Naive's existing product scope and visual identity.

## 2. Foundations

- Color: use Naive UI theme variables for text, borders, surfaces, success, error, info, and primary states. Custom surfaces use `color-mix()` from those variables.
- Typography: body text uses the configured `fontFamily`; measurements use `numberFontFamily`. Titles are 18px, primary card values 13px, metadata 12px, and supporting measurements 10px.
- Spacing: 4px base unit for layout rhythm. Page padding is 16px; card grid gap is 12px compact, 16px comfortable, and 20px spacious. Naive card density uses 12px/14px compact and 20px/22px spacious content padding so horizontal padding remains optically balanced around text and icons.
- Radius: inherit the configured Naive UI radius. Do not introduce an unrelated radius scale.
- Depth: borders are primary separation. Optional light contrast and glass modes may add the existing restrained shadow or blur.

## 3. Layout

- The header, summary, filters, and node collection share the same page container.
- The node toolbar keeps the horizontal group tabs, search, and view switch on one line without repeating the page's node-status context.
- Summary values follow the selected group, while text search only narrows the node collection below it.
- Card grids use auto-fill with a theme-configured minimum width; never force horizontal page scrolling.
- Mobile uses a single column and moves toolbar controls below the heading.

## 4. Motion

- Use the existing 200ms transition language for hover, route changes, and disclosure.
- Realtime charts use a short linear update transition so incoming samples remain traceable; historical charts render without continuous motion.
- Motion communicates interactivity or state only. Respect `prefers-reduced-motion` globally.

## 5. Primitives and states

- `SummaryCard`: default, light-contrast, glass.
- `NodeToolbar`: group tabs, a single-icon-width search that expands on focus at every breakpoint, and the card/list selector share one row; mobile expansion floats above the tabs.
- `NodeCard`: online/offline, compact/comfortable/spacious, default/light-contrast/glass.
- `MetricBlock`: CPU, memory, disk, and traffic; hidden metrics must leave no empty grid cells.
- `TelemetryChart`: compact card header, formatted axes and crosshair labels, restrained line/area treatment, realtime/history states.
- `LatencyChart`: page and modal density variants; duration, compact task selectors, essential actions, and a bordered trend canvas without redundant explanatory layers.
- `StatusBadge`: online pulse and offline static state.
- `OfflineStatus`: keeps the title visible, applies a restrained error glow to the card, and masks the content region with offline status and last-seen time.

## 6. Accessibility

- Icon-only controls require accessible labels and visible focus behavior supplied by Naive UI.
- Text and status cannot rely on color alone; offline state includes explicit text.
- CJK labels should remain short and avoid forced character-level wrapping.
- Touch controls remain at least 32px with adequate surrounding spacing.

## 7. Responsive behavior

- Mobile: one card column, stacked toolbar, compact summary rows.
- Tablet: auto-fill grid using the configured minimum card width.
- Desktop: summary and node cards expand within `maxPageWidth`; content density is theme-controlled.

## 8. Accepted debt

- Theme-managed configuration currently supports string-based JSON for metric visibility; parsing remains defensive for compatibility with Komari's configuration schema.
- A standalone component showcase is not part of the repository; the live home route is the state harness for primitives.
- Existing light-contrast and glass variants retain their legacy RGBA recipes for backward visual compatibility; new layout surfaces use Naive theme variables and `color-mix()`.
