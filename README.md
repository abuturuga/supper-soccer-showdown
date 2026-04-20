# Supper Soccer Showdown

## UX

![UX Mock](docs/ux-mock.png)

2 main pages - Lineup Settings and Live Match. Home page is out of scope for now.

**Lineup Settings** - configure and generate teams. Play button only shows up after both teams are ready.

3 states to handle:
- empty - pick a universe, generate becomes available
- error - one of the apis blew up, show error + retry
- ready - teams are on the field, can play or regenerate

loading is shown in the player table, not on the field itself

**Live Match** - score, field positions, highlights, stats

---

## Tech Stack

- React 19
- TypeScript
- React Router 7
- TanStack React Query 4
- TailwindCSS 4
- Vite

## Architecture

### State

2 layers:
- `MatchProvider` (context) - keeps home/away teams alive across pages
- local state - lineup config (defenders, attackers), stays in the component

React Query handles the async stuff - loading/error/cache. `staleTime: Infinity` so teams dont get refetched mid session.

### APIs

Just plain fetch, no axios or anything. Two files in `/src/api/`:
- `pokemon.ts` - PokeAPI
- `starwars.ts` - SWAPI

Both are paginated. `useGenerateTeam` hook wraps them with react query, 3 retries with delay if something fails.

### Flow

```
user triggers generate
  → useGenerateTeam (react query)
    → /src/api/*
      → generateTeam.ts (pure fn)
        → MatchProvider
          → Live Match page
```

all business logic is pure functions in `/src/logic/`, nothing react specific in there

### Team Generation

![Team Generation Overview](docs/team-generation-overview.png)

fetch a random page from the paginated api, grab total count, normalize via adapter if needed. useQuery calls it and retries on fail. team generation runs after with the lineup config.

### Match Simulation

![Live Match Diagram](docs/live-match-diagram.png)

Implemented as a state machine.