# Decisions

Technical decisions I made during this project, with context and reasoning.

---

## D1: Why Next.js for a single-page app

**Context:** This is basically one page — a search input and a country card. Vite + React would've been enough.

**Decision:** I went with Next.js (App Router).

**Why:** It's what I'd use on a real project. `create-next-app` gives me TypeScript, Tailwind, and ESLint out of the box — no setup time wasted. `next/image` handles flag image optimization for free (lazy loading, format conversion). And if the app ever grows to multiple pages, the routing is already there.

**Trade-off:** A bit heavier than Vite for this scope, but it's the production-ready choice and the overhead is near zero.

---

## D2: Base components with a variants pattern

**Context:** I could just use Tailwind classes directly in the feature components. Why bother abstracting into reusable components?

**Decision:** I built a small component library (Button, Input, Typography, etc.) where each component has a `variants.tsx` that defines its design tokens — size, color, variant.

**Why:** I don't want to repeat the same Tailwind classes across the codebase. The variants file acts like design tokens — if the design changes, I update one file, not 30 components. Each component has presets but is still customizable via props and `className`.

**Trade-off:** More files upfront for a small project, but it keeps the UI consistent and scales well.

---

## D3: Layered architecture (Domain / Data / Application / Presentation)

**Context:** Most React apps just put everything inside components. A single-page app doesn't really need formal architecture.

**Decision:** I used a four-layer clean architecture where dependencies point inward toward Domain.

**Why:** Domain holds pure types and functions — no React, no fetch. If the API renames a field, only the mapper changes. If I swap React for something else, Domain stays untouched. It's the stable center. I know this is more structure than a single page needs — I did it on purpose to show how I'd organize a real codebase. The architecture scales; the demo justifies it.

**Trade-off:** Over-engineered for 250 countries, but it's a deliberate demonstration of how I think about code organization.

---

## D4: Composed primitives over a single Combobox component

**Context:** I could build one `<Combobox items={...} onSelect={...} />` that hides everything inside. Simpler to use.

**Decision:** I split it into separate primitives — SearchInput, MenuList, MenuItem, useCombobox — that compose together.

**Why:** Each piece works on its own. SearchInput can be used without a dropdown. MenuList can be used for other menus. useCombobox can wire up an Autocomplete someday. If I wrap everything into one `<Combobox />`, those pieces are trapped inside and I can't reuse them. This is how MUI, Radix, and Headless UI do it — small composable atoms over one configurable black box.

**Trade-off:** More assembly in the feature component, but each piece is reusable and not tightly coupled.

---

## D5: useCombobox uses index, not key

**Context:** Some devs would flag using array indices as fragile. Why not use a string key?

**Decision:** `onSelect(index: number)` — the hook tracks position, not identity.

**Why:** The hook is basically a cursor — arrow keys move it up and down. If I passed a key, the hook would need the full items array just to figure out "what's the next key?" That couples it to my data shape. With index, the hook just says "position 2 was selected" and the component maps that to whatever item is there. The hook stays generic. The "indices are fragile" argument is about React `key` props where items reorder — here the list is filtered fresh every render so index always matches position.

**Trade-off:** The component has to do `items[index]` to get the actual item, but that's one line.

---

## D6: Server-side search as primary

**Context:** The REST Countries API has a search endpoint (`?q=`) and the free tier gives 500 requests/month with a 20 req/10s rate limit. I could fetch all 250 once and filter client-side, or use the API's search.

**Decision:** Server-side search is the primary approach.

**Why:** At work I deal with millions of records — we never fetch everything client-side. We paginate, debounce, and cancel stale requests. Client-side filtering is fine for 250 items but it doesn't show what I know. Server-side search with debounce and proper error handling is the pattern I've used for 4 years in production. I want to demonstrate that.

**Trade-off:** More API calls than a fetch-once approach, but it shows real-world data fetching patterns.

---

## D7: Data layer separation (DTO, params, mapper, api, repository)

**Context:** I need to fetch countries from the REST Countries API v5. I could just fetch and use the raw response directly in components.

**Decision:** Five files in the data layer, each with one job:
- `dto.ts` — the raw API response shape. No domain imports, just mirrors what the API sends.
- `params.ts` — typed request params. What I send TO the API.
- `mapper.ts` — translates API shape → domain shape. The translator between "their language" and "mine."
- `api.ts` — axios calls with Bearer auth. Only file that knows the base URL.
- `repository.ts` — `searchCountries(query)` combines api + mapper. Only thing the hooks call.

**Why:** Each file has one reason to change. API renames a field? Only dto + mapper. Auth changes? Only api. Add pagination? Only params + api. The hooks just call `searchCountries(query)` and get back `Country[]` — they don't know about DTOs, axios, or auth. This is the same separation I use at work.

**Trade-off:** Five files for what could be one fetch call. But each file is small and has a clear purpose.

---

## D8: Format functions handle missing data, not styling

**Context:** API data can have null values (no currencies, no driving side). I need fallbacks for display. I also need casing like capitalize.

**Decision:** `format.ts` handles missing data (null → "Not specified") and structure (joining multiple currencies). Casing is handled in the UI via Tailwind (`capitalize`).

**Why:** Capitalization is styling, not data. If the design changes from "Left" to "LEFT" tomorrow, that's a Tailwind change — I shouldn't need to touch `format.ts` for that. The formatter's job is making sure no blank or null values reach the UI. The UI decides how it looks.

**Trade-off:** Formatting lives in two places, but each owns its own concern.

---

## D9: useDebounce for API protection

**Context:** Every keystroke could fire an API call. With 500 req/month and 20 req/10s limits, that's dangerous.

**Decision:** `useDebounce(query, 300)` before any search call.

**Why:** Debounce waits 300ms after the user stops typing before firing the search. So typing "philippines" sends one request, not eleven. At work we always debounce search inputs that hit the API — it's standard practice. I tried 150ms first but it was too fast — still fired too many requests on normal typing speed. 300ms feels right, users don't notice the delay.

**Trade-off:** Slight delay before results show up. Worth it to not burn through API limits.

---

## D10: Application layer — split hooks by responsibility

**Context:** I need a hook that handles search query state, debounce, API calls, and selected country. Could put everything in one hook.

**Decision:** Split into two hooks: `useListCountries` (React Query wrapper for the API call) and `useCountrySearch` (orchestrator that combines query state, debounce, API results, and selection).

**Why:** `useListCountries` is a pure data-fetching hook — give it params, get back data/loading/error. It doesn't know about debounce or selection. `useCountrySearch` is the orchestrator that wires debounce → fetch → selection together. If I need to fetch countries somewhere else without the search UX, I just use `useListCountries` directly. Same pattern I use at work — one hook per concern, one orchestrator to combine them.

**Trade-off:** Two files instead of one, but each is simple and testable on its own.

---

## D11: Infinite scroll with useInfiniteQuery for pagination

**Context:** The API returns paginated results (limit/offset). First page shows 10 results. The user might want to see more without typing a more specific query.

**Decision:** Use React Query's `useInfiniteQuery` with scroll detection on the MenuList to auto-load the next page when the user scrolls near the bottom.

**Why:** This is how I handle pagination at work — infinite scroll with cursor/offset-based loading. It's smoother than a "Load more" button and demonstrates real-world data fetching. React Query's `useInfiniteQuery` handles page caching, deduplication, and loading states per page out of the box. The API's `meta.more` flag tells me when to stop fetching.

**Trade-off:** More complex than loading all results at once, but demonstrates production pagination patterns.
