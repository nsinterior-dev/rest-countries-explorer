# Decisions

Technical decisions made during this project, with context and reasoning.

---

## D1: Next.js for a single-page app

**Context:** The app is essentially one page — a search input with a country detail card. A simpler setup (Vite + React) would work.

**Decision:** Used Next.js with App Router.

**Why:** It's the production stack I'd reach for on a real project. TypeScript, Tailwind, and ESLint are configured out of the box with `create-next-app` — zero setup time. `next/image` gives automatic optimization for flag images (lazy loading, format conversion). File-based routing means if the app grows (e.g., `/country/[id]`), the structure is already there. The overhead for a single page is near zero.

**Trade-off:** Slightly heavier than Vite for this scope, but the signal is production thinking, not demo tooling.

---

## D2: Base components with variants pattern

**Context:** Tailwind utility classes could be applied directly in feature components. Why abstract into reusable components with a `variants.tsx` file?

**Decision:** Built a component library (Button, Input, Typography, etc.) where each component has a `variants.tsx` defining its design tokens — size, color, variant.

**Why:** Consistent design across the codebase. The variants file acts like design tokens — `size`, `color`, `variant` are the agreed vocabulary. If the design changes, I update one file, not 30 components. Components get presets but remain customizable via props and `className`.

**Trade-off:** More files upfront for a small project, but the pattern scales and demonstrates design system thinking.

---

## D3: Layered architecture (Domain / Data / Application / Presentation)

**Context:** A single-page app doesn't need formal architecture. Most React apps just put everything in components.

**Decision:** Four-layer clean architecture with dependencies pointing inward toward Domain.

**Why:** Domain holds pure types and functions — no React, no fetch. If the API renames a field, only the mapper in the Data layer changes. If I swap React for something else, Domain doesn't change. It's the stable center that everything else depends on. This is more structure than a single page needs — I did it deliberately to demonstrate how I'd organize a real codebase. The layered approach scales; the single page doesn't justify it, the demonstration does.

**Trade-off:** Over-engineered for 250 countries. Justified as a deliberate architectural demonstration.

---

## D4: Composed primitives over single Combobox component

**Context:** Could build one `<Combobox items={...} onSelect={...} />` that hides all the internals. Simpler API surface.

**Decision:** Separate primitives — SearchInput, MenuList, MenuItem, useCombobox — that compose together.

**Why:** Each piece is reusable on its own. SearchInput works without a dropdown. MenuList works for regular menus, not just combobox. useCombobox can wire up an Autocomplete later. If I build one monolithic `<Combobox />`, those pieces are trapped inside — I can't reuse them separately. This is the same composition pattern that MUI, Radix, and Headless UI use. Small composable atoms over one configurable black box.

**Trade-off:** More assembly required in the feature component, but maximum flexibility and reuse.

---

## D5: useCombobox uses index, not key

**Context:** A colleague might argue that using array indices is fragile. Why not pass a string key to `onSelect`?

**Decision:** `onSelect(index: number)` — the hook tracks position, not identity.

**Why:** The hook is a cursor — arrow keys move position up and down. If the hook needed a key, I'd have to pass the full items array, coupling the hook to my data shape. With index, the hook says "position 2 was selected" and the component translates that to whatever item lives there. The hook stays generic, the component does the mapping. The fragility argument applies to React `key` props where items reorder — here the list is filtered fresh every render, so index and position are always correct.

**Trade-off:** Consumer must map `index → item`, but that's a one-liner in the component.

---

## D6: Server-side search as primary, client-side filter as fallback

**Context:** The REST Countries API has a search endpoint (`?q=`) and the free tier allows 500 requests/month with a rate limit of 20 req/10s. Two approaches: fetch all once and filter client-side, or use the API's search per query.

**Decision:** Server-side search is the primary approach. Client-side filter is the fallback when the API is unavailable (429/403).

**Why:** In production with large datasets, client-side filtering doesn't scale. Server-side search with debounce, pagination, and request cancellation (AbortController) is the pattern I use at work with millions of records. For 250 countries, client-side would be simpler — but this project demonstrates real-world data fetching patterns. The repository interface allows swapping between both implementations, and the app gracefully degrades to client-side filtering if the API rate-limits or freezes the account.

**Trade-off:** More API calls than fetch-once, but demonstrates production patterns (debounce, abort, error recovery) and graceful degradation.

---

## D7: Repository pattern with swappable implementations

**Context:** The app needs to fetch and search countries. Could hardcode the fetch logic directly in a hook.

**Decision:** `CountryRepository` interface with `serverCountryRepository` (primary) and `clientCountryRepository` (fallback).

**Why:** The interface decouples the application layer from the data source. The hook calls `repository.search(query)` without knowing if it's hitting the API or filtering a cached list. Swapping implementations is a one-line change. This also makes testing trivial — pass a fake repository. This is the same Dependency Inversion principle from clean architecture, applied at the data boundary.

**Trade-off:** More abstraction than a 250-item dataset needs. Demonstrates scalable architecture and makes the codebase trivially testable.

---

## D8: Domain format functions handle missing data, not styling

**Context:** API data can have null/missing values (e.g., no `car.side`, no currencies). Display strings need fallbacks. Casing (capitalize, uppercase) is also needed for display.

**Decision:** `format.ts` handles missing data and structure (joining multiple currencies, null fallback to "Not specified"). Casing/styling is handled in the UI via Tailwind (`capitalize`).

**Why:** Formatting and styling are different concerns. If the design changes from "Left" to "LEFT" or "left", that's a Tailwind change — `format.ts` shouldn't need to change for visual decisions. The formatter's job is ensuring no blank or null values reach the UI.

**Trade-off:** Formatting logic is split between two layers, but each layer owns its responsibility cleanly.

---

## D9: useDebounce for both render performance and API protection

**Context:** User types in a search input. Each keystroke could trigger work — either a re-render (client-side) or an API call (server-side).

**Decision:** `useDebounce(query, 150)` applied before any search operation.

**Why:** For the server-side primary path, debounce prevents hammering the API on every keystroke — critical with a 500 req/month limit and 20 req/10s rate limit. For the client-side fallback, debounce reduces unnecessary re-renders. The same hook serves both paths. 150ms delay is imperceptible to users.

**Trade-off:** Adds slight delay before results appear. Necessary cost for API protection and smooth UX.
