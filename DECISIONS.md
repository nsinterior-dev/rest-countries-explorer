# Decisions

Technical decisions I made during this project, why I made them, and what I traded off.

---

## D1: Why Next.js for a single-page app

**What I did:** Used Next.js (App Router) instead of Vite + React.

**Why:** It's what I'd use on a real project. `create-next-app` gives me TypeScript, Tailwind, and ESLint out of the box — no setup time wasted. `next/image` handles flag image optimization for free. And if the app ever grows, the routing is already there.

**Trade-off:** A bit heavier than Vite for this scope, but the overhead is near zero.

---

## D2: Base components with a variants pattern

**What I did:** Built a small component library (Button, Input, Typography, etc.) where each has a `variants.tsx` for design tokens — size, color, variant.

**Why:** I don't want to repeat the same Tailwind classes everywhere. The variants file is like design tokens — if the design changes, I update one file, not 30 components.

**Trade-off:** More files upfront, but the UI stays consistent and it scales.

---

## D3: Layered architecture (Domain / Data / Application / Presentation)

**What I did:** Four-layer clean architecture where dependencies point inward toward Domain.

**Why:** Domain is pure types and functions — no React, no fetch. If the API renames a field, only the mapper changes. I know this is more structure than a single page needs — I did it on purpose to show how I'd organize a real codebase.

**Trade-off:** Over-engineered for 250 countries, but that's the point — it's a deliberate demonstration.

---

## D4: Composed primitives over a single Combobox component

**What I did:** Split into separate pieces — SearchInput, MenuList, MenuItem, useCombobox — instead of one big `<Combobox />`.

**Why:** Each piece works on its own. SearchInput doesn't need a dropdown. MenuList works for other menus. useCombobox can wire up an Autocomplete someday. If I wrap everything into one component, those pieces are trapped inside. This is how MUI and Headless UI do it.

**Trade-off:** More assembly in the feature component, but nothing is tightly coupled.

---

## D5: useCombobox uses index, not key

**What I did:** `onSelect(index: number)` — the hook tracks position, not identity.

**Why:** The hook is a cursor — arrow keys move it up and down. If I passed a key, the hook would need the full items array to figure out "what's next?" That couples it to my data shape. With index, the hook says "position 2 was selected" and the component maps that to the actual item.

**Trade-off:** The component does `items[index]` to get the item, but that's one line.

---

## D6: Server-side search as primary

**What I did:** Used the API's `?q=` search endpoint with debounce and pagination instead of fetching all 250 countries and filtering client-side.

**Why:** At work I deal with millions of records — we never fetch everything client-side. We paginate, debounce, and cancel stale requests. Client-side filtering works for 250 items, but it doesn't show what I know. I've been doing server-side search for 4 years in production and I want to demonstrate that.

**Trade-off:** More API calls than fetch-once, but it shows real-world patterns.

---

## D7: Data layer separation (DTO, params, mapper, api, repository)

**What I did:** Four files in the data layer:
- `dto.ts` — the raw API response shape, no domain imports
- `params.ts` — typed request params
- `mapper.ts` — translates API shape → domain shape
- `api.ts` — axios calls with Bearer auth
- `repository.ts` — combines api + mapper, only thing the hooks call

I originally had `getCountry`, `ListCountriesParams`, and `GetCountryParams` too. I removed them — when the user picks a country from search results, I already have the full data. No second API call needed.

**Why:** Each file has one reason to change. API renames a field? Only dto + mapper. Auth changes? Only api. The hooks just call `searchCountries(params)` and get `Country[]` — they don't know about DTOs or axios.

**Trade-off:** Multiple files for what could be one fetch call. But each is small and has a clear job.

---

## D8: Format functions handle missing data, not styling

**What I did:** `format.ts` handles missing data (null → "Not specified") and structure (joining multiple currencies). Capitalization is done in the UI with Tailwind's `capitalize`.

**Why:** Capitalization is styling, not data. If the design changes from "Left" to "LEFT" tomorrow, that's a Tailwind change — I shouldn't need to touch `format.ts` for that.

**Trade-off:** Formatting lives in two places, but each owns its own concern.

---

## D9: useDebounce for API protection

**What I did:** `useDebounce(query, 300)` before any search call.

**Why:** Every keystroke would fire an API call without this. Typing "philippines" would be 11 requests instead of 1. I tried 150ms first but it was too fast — 300ms feels right, users don't notice the delay. At work we always debounce search inputs that hit the API.

**Trade-off:** Slight delay before results show up. Worth it.

---

## D10: Split hooks by responsibility

**What I did:** Two hooks — `useListCountries` (React Query wrapper) and `useCountrySearch` (orchestrator that combines query state, debounce, results, and selection).

**Why:** `useListCountries` just fetches. `useCountrySearch` wires everything together. If I need to fetch countries without the search UX, I use `useListCountries` directly. One hook per concern.

**Trade-off:** Two files instead of one, but each is simple.

---

## D11: Infinite scroll with useInfiniteQuery

**What I did:** React Query's `useInfiniteQuery` with scroll detection to auto-load the next page when the user scrolls near the bottom.

**Why:** This is how I handle pagination with react query — infinite scroll with offset-based loading. It's smoother than a "Load more" button. React Query handles page caching and deduplication out of the box. The API's `meta.more` flag tells me when to stop.

**Trade-off:** More complex than loading everything at once, but it's the production pattern.

---

## D12: API full-text search returns broad results

**What I did:** I use the API's `?q=` search as-is. It's the only search endpoint available in v5, but it's full-text — it matches across all fields (names, capitals, currencies, languages), not just country names.

**Why:** There's no name-only search endpoint. I could filter client-side after fetching, but that wastes data I already paid for. The broad results are still useful — searching "australia" returns Australia plus its territories, which makes sense. The API sorts by relevance so the best match is always first.

**Trade-off:** Some results don't match the country name directly. That's an API limitation, not a code issue.

---

## D13: No dead code

**What I did:** Removed everything I wasn't using — `getCountry()`, unused types, empty barrel files.

**Why:** Dead code is noise. If I need it later, I'll write it — it takes 2 minutes. The git history has it if I ever need to reference it.

---

## D14: Show initial country list on first interaction

**What I did:** The API works without a `?q=` param — it returns all countries paginated. So when the user clicks the search input and starts interacting, I fetch the initial list immediately. No need to type before seeing results.

**Why:** Better UX — the user sees options right away instead of staring at an empty dropdown. The fetch only triggers on first interaction (not on page load) so I don't waste an API call if the user never touches the search. Once fetched, React Query caches it — clearing the search input and reopening shows the cached list instantly, no refetch.

**Trade-off:** One extra API call for the initial list. But it's cached and makes the app feel responsive.

---

## D15: Flag emoji in menu items instead of flag images

**What I did:** Each country option in the dropdown shows the flag emoji from the API (`flag.emoji`) next to the country name, instead of loading flag images.

**Why:** Loading 50 flag images in a dropdown would be 50 network requests every time the list renders. The emoji is already in the API response — zero extra cost, renders instantly, looks native on every OS. Same visual purpose, no performance hit.

**Trade-off:** Emoji rendering varies slightly across OS/browsers. But for a dropdown item it's fine — the real flag image shows in the detail card.

---

## D16: Strip empty `q` param from API calls

**What I did:** The API returns a `searchQueryEmpty` error if you send `?q=` with an empty string. In `api.ts` I strip the `q` param when it's empty so the request becomes `/countries/v5?limit=50&offset=0` — which returns all countries.

**Why:** Without this, focusing the search input (which triggers a fetch with empty query) would error out. The fix lives in one place (`api.ts`) so the hooks and repository don't need to care about this edge case.

**Trade-off:** None — it's a one-line fix for an API quirk.
