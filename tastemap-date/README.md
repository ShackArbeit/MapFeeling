# TasteMap Date｜食感航線

> 不要先想怎麼聊天，先從一起吃什麼開始。

A food-first dating MVP built with Next.js, TypeScript, and GCP. Interview project for a Vibe Coding Engineer role.

---

## Product Overview

TasteMap Date reduces first-date pressure by starting the connection with shared food preferences instead of swiping or awkward chat. Users browse a taste map, see match scores, generate AI invite suggestions, and send low-pressure date requests.

**Core features:**
- Food preference matching (12 categories)
- Approximate dating area map (Leaflet, no exact addresses)
- Zodiac element affinity scoring
- AI-generated invite suggestions (Anthropic Claude, with fallback)
- Date request accept / reject inbox

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 16 App Router, TypeScript, Tailwind CSS, shadcn/ui |
| Map | Leaflet / React Leaflet (SSR disabled) |
| Forms | React Hook Form + Zod |
| State | Zustand |
| AI | Anthropic Claude API (`claude-haiku-4-5-20251001`) |
| Storage | localStorage (local mode) / Firestore (optional) |
| Deploy | GCP Cloud Run |
| CI/CD | GitHub Actions + Workload Identity Federation |
| Registry | Artifact Registry |
| Secrets | GCP Secret Manager |

---

## Local Setup

```bash
git clone <repo>
cd tastemap-date
npm install
cp .env.example .env.local
# optionally add ANTHROPIC_API_KEY to .env.local
npm run generate:mock-users
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_APP_ENV` | `development` or `production` |
| `NEXT_PUBLIC_STORAGE_MODE` | `local` or `firestore` |
| `STORAGE_MODE` | `local` or `firestore` (server-side) |
| `ANTHROPIC_API_KEY` | Optional — AI invite suggestions |
| `GOOGLE_CLOUD_PROJECT` | Required for Firestore mode |

---

## Mock Data Generation

```bash
npm run generate:mock-users
```

Generates 240 deterministic mock users into `src/data/mock-users.generated.json`. Uses a fixed seed — output is always identical.

---

## Scripts

```bash
npm run dev                 # Start dev server
npm run build               # Production build
npm run typecheck           # TypeScript check
npm run generate:mock-users # Generate 240 mock users
npm run test                # Vitest unit tests
npm run test:watch          # Vitest watch mode
npm run e2e                 # Playwright e2e tests
```

---

## Testing

```bash
npm run test       # Unit tests (zodiac, match scoring, date request)
npm run typecheck  # TypeScript validation
npm run e2e        # End-to-end happy path
```

---

## Architecture

See [docs/architecture.md](docs/architecture.md) for full details.

**Key decisions:**
- Mock users in JSON — no DB needed for read-only profiles
- Match score is a pure function (explainable, testable, no AI dependency)
- AI is copy generation only — not in the matching decision path
- `DateRequestStore` adapter — swap localStorage → Firestore with one env var
- Cloud Run + Workload Identity Federation — no long-lived GCP keys

---

## GCP Deployment

See [docs/gcp-deploy.md](docs/gcp-deploy.md) for full GCP setup instructions.

**CI/CD auto-deploys on push to main via GitHub Actions.**

---

## Safety & Privacy

- No exact home addresses — all coordinates are approximate area centers + random jitter
- Location UI labels say "推薦約會區域" not "住家位置"
- No real user PII in mock data
- AI suggestions are low-pressure copy — no compatibility claims

---

## Demo Script

See [docs/demo-script.md](docs/demo-script.md) for the 3-minute interview demo flow.

---

## Tradeoffs

| Decision | Tradeoff |
|----------|----------|
| Mock users in JSON | Fast demo, no DB ops — but not real user data |
| localStorage for date requests | Zero backend dependency — but data doesn't persist across devices |
| Rule-based match score | Explainable and testable — but less personalized than ML |
| Cloud Run over Vercel | GCP-native, no vendor lock-in — but more setup required |