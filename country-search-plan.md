# Country Search — Project Plan

Superloop frontend technical assessment. This is a planning document — I execute it myself, section by section.

Repo name: `country-search`

---

## 1. What the task actually is

A single-page React app that queries the REST Countries API (`https://restcountries.com/`) and shows details for a selected country.

**Literal requirements**
- On-screen instructions telling the user how to use it
- Text search input — accepts full or partial country name
- Real-time suggestions as the user types, selectable
- On selection, show below the input: official name, currency (name + symbol), flag, side of the road they drive on
- Responsive UI (looks are explicitly low-priority — real designs would be provided on the job)
- README (how to run) + supporting docs (technical decisions, trade-offs)

**The two hidden requirements (where the offer is won)**
From: *"Bear in mind some APIs have rate limits… as well as how you might design this for a larger data set (millions of records)."* Two separate scenarios:
- **This dataset (~250):** fetch once, cache, filter client-side → rate limits become a non-issue, search is instant. This is what I build.
- **Millions of records:** search moves server-side. Rather than only *explaining* this, I **build the seam** — the data-access is a `CountryRepository` interface, so switching from client-side to server-side search is a one-line swap of the implementation, with nothing above the Data layer changing. The scaling techniques (server-side debounced search, pagination/cursor + infinite scroll, in-flight request cancellation via `AbortSignal`, list virtualization) live in `serverCountryRepository` — documented, and optionally implemented against a small mock to demonstrate the technique.

Why the seam, not a whole second app: there's no real million-record endpoint (REST Countries is ~250), so a full scaled build would mean faking a large dataset — scope creep that risks leaving the core half-polished. The seam proves the *design* (which is what the brief asks: "how you might **design** this"), stays cheap, and is more convincing than prose because it's real code exercising Repository + Dependency Inversion.

**Frontend performance techniques (the "larger data set" is frontend work)**
- Applied even at 250 (justified): memoized derived filtering (`useMemo`), stable row handlers (`useCallback`), debounced input (`useDebounce`) — keeps typing smooth, avoids re-rendering the list every keystroke.
- Reserved for the scaling path (in `serverCountryRepository` / documented): list virtualization (react-window / virtua) to render thousands of rows without killing the DOM, cursor/pagination + infinite scroll, `AbortController` to cancel superseded requests.
- Deliberately NOT virtualizing the 250-item dropdown — premature there (8 rows visible). If a virtualization demo is built, it's a small, clearly-labeled illustrative list for the scale case, kept out of the core dropdown. Defensible line: "I know it's unnecessary at 250; this shows the technique for the millions case."

**Attention-to-detail items (unstated but graded)**
- Loading / empty / error states
- `/all` now requires a `fields` param or it 400s → use `/all?fields=name,currencies,flags,car`
- Accessibility: labelled input, `alt` on flags, keyboard nav on suggestions (↑↓/Enter/Esc)
- Edge cases: multiple currencies, missing `car` data

---

## 2. Field mapping (REST Countries → UI)

| UI field | API source |
|---|---|
| Official name | `name.official` |
| Currency | `currencies` object → name + symbol (comma-join if multiple) |
| Flag | `flags.svg` (+ `flags.alt` for accessibility) |
| Drives on | `car.side` → `"left"` / `"right"` |

Driving side note: `car.side` is literal — which side of the road they drive on. Fallback "Not specified" if missing.

---

## 3. UX decisions (locked)

Single centered column, max-width ~480–600px, responsive (full-width on mobile).

Three visual blocks:
1. **Header** — title + subtitle (one-line instructions, always visible even after selection)
2. **SmartSearch** — combobox: input + dropdown suggestions overlaying the space below
3. **DetailView** — the card, appears below after selection

**Interaction rules**
- Suggestions appear after the 1st character, ~8 visible rows, scroll beyond
- Suggestion rows: name only (no flag thumbnails — avoid loading ~250 tiny images during typing; flag is the payoff on the card)
- Keyboard: ↑↓ move, Enter selects, Esc closes; click-outside closes
- Selecting fills the input with the country name and renders the card
- Light debounce (~150ms) on the filter for smooth re-renders (not network — there's no per-keystroke request)
- Clear (×) button in the input

**States**
- Loading skeleton during the initial `/all` fetch
- Empty state inside the dropdown: "No countries match 'xyz'"
- Error banner replacing the search area, with a Retry button, if the one fetch fails

**Card fallbacks**
- Multiple currencies → comma-separated
- Missing `car.side` or currency → "Not specified" (never blank, never crash)

**DetailView style (locked): Option B — compact horizontal**
- Flag on the left (real `flags.svg`, ~108px wide, 3:2), name + label-value rows on the right
- Rows: Official / Currency / Drives on
- `max-width ~440px`, centered — sits centered on wide screens rather than stretching
- Chosen over the bolder flag-hero (Option A) because this isn't a gallery/showcase; a restrained, product-like card is the better signal for this assessment
- Future polish (not needed now): let the card breathe wider or go 2-column on large screens to use side space

---

## 4. Architecture — clean / layered feature

One feature, four layers. This is deliberately more structure than a single page needs; the point is to demonstrate scalable clean code. **Say this in the docs** — framing it as a deliberate choice reads as judgment, not over-engineering.

The rule that governs everything: **dependencies point inward, toward Domain.** Domain knows nothing about React or the API.

- **Domain** — what IS a country, in my app's terms? Pure. No React, no fetch. Types + pure functions.
- **Data** — how do I GET countries and translate their shape into mine? API client + mapper (anti-corruption layer).
- **Application** — how do I orchestrate? Fetch once, cache, filter, track selection. Hooks live here.
- **Presentation** — how do I show it? Dumb components, props in / JSX out.

### Folder structure

```
app/                              # Next.js — thin, routing + providers
├─ layout.tsx
├─ providers.tsx                  # QueryClientProvider
└─ page.tsx                       # renders <CountrySearch />, nothing else

components/                       # GENERIC dumb components (reusable by any feature)
├─ SearchInput.tsx                # text input + search icon + clear (×), controlled
├─ Dropdown.tsx                   # floating container, positions below anchor, click-outside close
├─ Option.tsx                     # one selectable row — default/hover/active/highlighted
├─ InfoRow.tsx                    # label + value pair (reused 3× in the card)
├─ AspectImage.tsx                # image in fixed aspect box + alt + loading/fallback
├─ EmptyState.tsx                 # message placeholder ("No results"), takes a message prop
├─ Banner.tsx                     # message + optional action (error + retry)
├─ Button.tsx                     # generic (Banner's retry uses it)
├─ Skeleton.tsx                   # loading shimmer block
├─ useCombobox.ts                 # GENERIC behavior hook: keyboard (↑↓/Enter/Esc),
│                                 #   open/close, active index, aria — no country knowledge
└─ useDebounce.ts                 # GENERIC: useDebounce(value, delay) → debounced value

features/
└─ country-search/               # the feature ("SmartComponent")
   │
   ├─ domain/                     # pure center — no React, no fetch
   │  ├─ country.ts               # Country type (not the API's shape)
   │  ├─ filter.ts                # filterCountries(list, query)
   │  └─ format.ts                # formatCurrency(), formatDrivesOn()
   │
   ├─ data/                       # talks to REST Countries, maps raw → domain
   │  ├─ countryDto.ts            # raw API response shape
   │  ├─ countryMapper.ts         # toCountry(dto): Country  ← anti-corruption layer
   │  ├─ countryApi.ts            # fetch /all?fields=... + error handling
   │  ├─ countryRepository.ts     # PORT: interface CountryRepository { search(q, opts) }
   │  ├─ clientCountryRepository.ts  # USED: fetch /all once, cache, filter in memory
   │  └─ serverCountryRepository.ts  # SCALING PATH: paginated endpoint, debounced,
   │                              #   AbortSignal cancel — documented stub (impl optional)
   │
   ├─ application/                # orchestration
   │  └─ useCountrySearch.ts      # wraps useCountries + query + filter + selection state
   │     (useCountries can be its own file: React Query fetch-once + cache)
   │
   └─ presentation/              # feature-specific components (compose the generics)
      ├─ CountrySearch.tsx        # container: calls useCountrySearch + useCombobox, wires UI
      └─ CountryCard.tsx          # Option B card: composes AspectImage(flag) + 3× InfoRow
```

### Component inventory rationale
The generic list is intentionally atomic (9 primitives + 1 behavior hook), not 3. Each does real work — none is a one-line pass-through. Two deliberately-cut candidates that would be ceremony: `Spinner` (redundant with `Skeleton` — picked Skeleton), and a `CountryFlag` wrapper (CountryCard calls `AspectImage` directly instead).

Key move: `useCombobox` separates combobox *behavior* (keyboard, open/close, active index, aria — generic) from *content* (country — feature). This is the strongest reuse/clean-code signal in the component layer.

Composition decision (locked): **Option 1 — composed primitives** (`SearchInput` + `Dropdown` + `Option` + `useCombobox`, assembled by `CountrySearch`) over Option 2 (one heavy `Combobox<T>` that hides the mechanics). Composed atoms make the separation of concerns visible to a reviewer; the encapsulated single-primitive version hides the thinking.

### Component rule
`components/` vs `presentation/` — the test is reuse. Could a totally different feature use it unchanged? → `components/` (generic, e.g. `SearchInput`). Only makes sense for country search? → `presentation/` (e.g. `CountryCard`).

### State decisions (locked)
- One `useCountrySearch` hook holds query + filter + selection (don't split — tightly coupled here)
- The `useState` lives inside `useCountrySearch` (application); `CountrySearch` (presentation) calls the hook. State's home is the `CountrySearch` instance, logic is in the hook.
- `CountrySearch` reuses `SearchInput` from `components/`
- `CountryCard` is a pure dumb component receiving a `country` prop

---

## 5. Domain types — the encapsulation story

Domain is the single source of truth for the app's shapes. Everything imports `Country` from `domain/country.ts` and depends on that abstraction, never on the API's raw JSON. If the API renames a field, only `countryMapper` changes.

```typescript
// domain/country.ts

// Union of literals — only `type` can express this (interface can't).
export type DrivingSide = 'left' | 'right';

// Object contracts — `interface` fits naturally.
export interface Currency {
  name: string;
  symbol: string;
}

export interface Country {
  name: string;          // common name — search + display
  officialName: string;
  flag: { url: string; alt: string };
  currencies: Currency[];
  drivesOn: DrivingSide | null;   // union + null (API sometimes omits car)
}
```

### type vs interface — the interview answer
- Mental model: `interface` describes the shape of an **object**; `type` can describe **anything** — objects, but also unions, primitives, tuples, functions.
- Two differences that matter: only `type` can express a **union** (`'left' | 'right'`); only `interface` can be **reopened** (declaration merging) and is idiomatic for `class implements`.
- Rule I follow: *interface for object contracts, type when I need a union or non-object shape.*
- This project uses both for the right reasons: `type DrivingSide` (union), `interface Country/Currency` (object contracts).

---

## 6. React design patterns used (to highlight)

Each pattern below is real in this project and maps to a concrete file — not a buzzword list. Format: pattern → where it lives → what to say.

1. **Container / Presentational (smart vs dumb)** → `CountrySearch` (container) vs `CountryCard` + all `components/` (presentational). *Container owns state and orchestration; presentational components just receive props and render. Makes each side testable and reusable in isolation.*

2. **Custom hooks (logic extraction)** → `useCountrySearch`, `useCountries`, `useCombobox`. *Behavior and state live in hooks, not components. Components stay thin; logic is unit-testable without rendering.*

3. **Prop getters** → `useCombobox` returns `getInputProps()`, `getMenuProps()`, `getOptionProps(i)`. *Same pattern as Downshift/React Aria — the hook owns the aria wiring and keyboard behavior, the component just spreads the props. Keeps accessibility correct by construction.*

4. **Server-state vs UI-state separation** → React Query (`useCountries`) for server data; `useState` (query, selection) for UI. *These have different lifecycles — server data is cached/refetched/deduped by React Query; UI state is ephemeral. Not mixing them is a deliberate senior choice.*

5. **Provider pattern** → `QueryClientProvider` in `app/providers.tsx`. *Cross-cutting concern (the query client) injected via context instead of prop-drilling.*

6. **Derived state, not duplicated state** → filtered results = `useMemo(() => filterCountries(list, query), [list, query])`. *The filtered list is computed from source state, never stored in its own `useState`. Avoids the classic bug where two states drift out of sync.*

7. **Composition over configuration** → `CountrySearch` composes `SearchInput` + `Dropdown` + `Option`. *Chose this over one mega `Combobox<T>` with a giant props API. Small composable atoms over one configurable black box.*

8. **Controlled components** → `SearchInput` (value + onChange owned by the hook). *Single source of truth for input value; parent always knows the current query.*

9. **Adapter / anti-corruption layer** → `countryMapper.toCountry(dto)`. *Bridges the API's shape to the domain shape. If the API changes, only this file changes — the React tree never sees raw DTOs.*

10. **Debounce (custom hook)** → `useDebounce(query, 150)`. *Decouples keystroke rate from filter/render rate for smooth typing.*

11. **Repository + Dependency Inversion (the scaling seam)** → `CountryRepository` interface with `clientCountryRepository` (used) and `serverCountryRepository` (scaling path). `useCountrySearch` depends on the interface, not a concrete impl. *This is the marquee answer to "design for millions of records": swapping client-side → server-side search is a one-line implementation swap; Presentation, hooks, and Domain don't change. Strategy pattern at the data boundary. Also makes the whole app trivially testable with a fake repository.*

12. **Click-outside-to-close (event lifecycle management)** → `MenuList` (`components/Menu/MenuList.tsx`). *The menu registers a `mousedown` listener on `document` only while open — guarded by a `useEffect` that checks `open` and `onClose` before attaching. `mousedown` is used instead of `click` because `click` fires after `mouseup`, which can race with focus changes (e.g. clicking the input would close then immediately reopen the menu). The handler checks `parentElement.contains(target)` — not just the `<ul>` — so clicking the input or clear button inside the same wrapper doesn't trigger a close. The cleanup function removes the listener when the menu closes or the component unmounts, preventing memory leaks and stale references. This is a textbook `useEffect` cleanup pattern: tie the listener's lifetime to the component's open state.*

Memoization note: pair `useMemo` (derived list) with `useCallback` (stable handlers passed to `Option` rows) so the suggestion list doesn't re-render every keystroke.

---

## 7. Reviewer-facing documentation structure

The supporting doc is organized around the questions a reviewer asks while reading the code:

1. Why Next.js for a single-page app? → production stack (App Router, TS, React Query); effectively one route. Deliberate.
2. How did you handle rate limits? → fetch once, cache, filter client-side. One request.
3. What if this were millions of records? → data-access is behind a `CountryRepository` interface, so server-side search is a one-line swap. Scaling techniques (server-side debounced search, cursor/pagination + infinite scroll, `AbortSignal` cancellation, virtualization) documented in `serverCountryRepository`. The seam is built, not just described.
4. How's the code organized? → the layered architecture above, one paragraph.
5. What did you cut and why? → honest trade-offs under the time budget. Most reviewer-impressive section.

The code, the UI, and the docs should tell the same story three times — problem-solving and attention to detail visible wherever a reviewer looks.

---

## 8. Build order

Build Domain → Data → Application → Presentation. This mirrors the dependency direction, so nothing I write ever references something that doesn't exist yet.

- [ ] Scaffold Next.js app (`create-next-app`: TypeScript, Tailwind, App Router)
- [ ] Domain: `country.ts`, `filter.ts`, `format.ts`
- [ ] Data: `countryDto.ts`, `countryMapper.ts`, `countryApi.ts`
- [ ] Data seam: `countryRepository.ts` (interface) + `clientCountryRepository.ts` (used) + `serverCountryRepository.ts` (documented stub)
- [ ] Application: `useCountries` (React Query), `useDebounce`, `useCombobox`, `useCountrySearch` (depends on the repository interface)
- [ ] Presentation: generic `SearchInput` / `Dropdown` / `Option`, then `CountrySearch`, then `CountryCard`
- [ ] Wire `useDebounce(query, ~150ms)` into the filter so typing stays smooth
- [ ] Perf: `useMemo` for the derived filtered list, `useCallback` for row handlers
- [ ] States: loading skeleton, empty, error + retry
- [ ] Accessibility pass: labels, alt, keyboard nav
- [ ] (Optional) small labeled virtualized-list demo for the scale case — only if core is done
- [ ] README (how to run)
- [ ] Supporting doc (section 7)
- [ ] Push to GitHub, email link to chris.williams@superloop.com
