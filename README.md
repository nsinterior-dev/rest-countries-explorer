# Country Explorer

A single-page React app that searches the REST Countries API and displays country details (Official Name, Currencies, Drives On)

## Prerequisites

- Node.js >= 20.9.0
- npm

## Setup

1. Clone the repo

```bash
git clone https://github.com/your-username/rest-countries-explorer.git
cd rest-countries-explorer
```

1. Install dependencies

```bash
npm install
```

1. Create a `.env` file in the root with your REST Countries API key

```
NEXT_PUBLIC_REST_API_KEY=your_api_key_here
```

You can get a free API key at [https://restcountries.com/sign-up](https://restcountries.com/sign-up)

1. Run the dev server

```bash
npm run dev
```

1. Open [http://localhost:3000](http://localhost:3000)



## Tech Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS** for styling
- **React Query** (`@tanstack/react-query`) for data fetching, caching, and infinite scroll
- **Axios** for HTTP requests
- **REST Countries API v5**



## Project Structure

```
src/
├── app/                    # Next.js pages and layout
├── components/             # Reusable base components (Button, Input, Typography, etc.)
├── hooks/                  # Generic hooks (useDebounce, useCombobox)
└── features/
    └── Countries/
        ├── domain/         # Types, filter, format — pure, no React
        ├── data/           # DTO, params, mapper, API client, repository
        ├── application/    # React Query hooks (useListCountries, useCountrySearch)
        └── presentation/   # UI components (Countries, CountryCard, CountryOptions)
```



## Documentation

See [DECISIONS.md](./DECISIONS.md) for technical decisions and trade-offs.