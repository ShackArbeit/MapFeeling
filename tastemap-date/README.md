# TasteMap Date｜食感航線

> 不要先想怎麼聊天，先從一起吃什麼開始。

A food-first dating MVP built as an interview project for a Vibe Coding Engineer / Next.js / Node.js role.

---

## Product Concept

Most dating apps start with profile photos and awkward small talk.  
TasteMap Date starts with food — a low-pressure shared interest that naturally leads to a real date invitation.

**Core user flow:**
1. Create a taste profile (food preferences + dating area + vibe)
2. Browse a map of users who share your food taste
3. See an explainable match score (food, zodiac, location, availability, vibe)
4. Generate an AI-assisted invite suggestion
5. Send a date request — receiver can accept or reject

---

## Tech Stack

| Layer | Choice |
|---|---|
| Frontend | Next.js 16 App Router + TypeScript + Tailwind CSS |
| UI Components | shadcn/ui (base-ui) + lucide-react |
| Map | Leaflet + React Leaflet |
| Forms | React Hook Form + Zod |
| State | React useState (Zustand available if needed) |
| AI | Anthropic Claude Haiku API + deterministic fallback |
| Storage | localStorage (adapter-based, Firestore-ready) |
| Deploy | GCP Cloud Run + Artifact Registry |
| CI/CD | GitHub Actions + Workload Identity Federation |
| Secrets | GCP Secret Manager |
| Testing | Vitest + Playwright |

---

## Architecture

```
tastemap-date/
├── src/
│   ├── app/                    # Next.js App Router pages + API routes
│   │   ├── page.tsx            # Landing page
│   │   ├── onboarding/         # Profile creation
│   │   ├── map/                # Taste map + candidate selection
│   │   ├── inbox/              # Date request inbox
│   │   └── api/
│   │       ├── profiles/       # GET mock users (filter by food/area/zodiac)
│   │       ├── match-advice/   # POST AI invite suggestion
│   │       └── date-requests/  # GET/POST/PATCH (Firestore mode)
│   ├── features/
│   │   ├── zodiac/             # calculateZodiac() pure function
│   │   ├── matching/           # calculateMatchScore() pure function
│   │   └── date-requests/      # DateRequestStore interface + localStorage impl
│   ├── lib/
│   │   ├── ai/                 # generateInviteAdvice() + fallback
│   │   └── firestore.server.ts # firebase-admin init (Firestore mode)
│   ├── components/             # CandidateCard, MatchReasonPanel, DateRequestDialog, etc.
│   ├── data/                   # mock-users.generated.json + food-types + taipei-districts
│   └── types/                  # domain.ts (UserProfile, DateRequest, MatchScoreBreakdown)
├── docs/
│   ├── gcp-deploy.md           # Step-by-step GCP setup
│   └── demo-script.md          # 3-minute demo walkthrough
├── tests/e2e/                  # Playwright e2e tests
├── Dockerfile                  # Multi-stage, Cloud Run ready (port 8080)
└── .github/workflows/          # CI: test → build → push → deploy
```

**Match score formula:**
```
totalScore = food(40%) + zodiac(20%) + location(20%) + availability(10%) + vibe(10%)
```

**Storage adapter pattern:**
```ts
interface DateRequestStore {
  create(input): Promise<DateRequest>
  listByReceiver(receiverId): Promise<DateRequest[]>
  updateStatus(id, status): Promise<DateRequest>
}
// local mode  → browserLocalDateRequestStore (localStorage)
// cloud mode  → firestoreDateRequestStore (firebase-admin)
```

---

## Local Setup

```bash
cd tastemap-date
npm install
npm run generate:mock-users   # generates src/data/mock-users.generated.json
cp .env.example .env.local    # add ANTHROPIC_API_KEY if available
npm run dev                   # http://localhost:3000
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | No | Claude Haiku for invite suggestions. Falls back gracefully if missing. |
| `NEXT_PUBLIC_STORAGE_MODE` | No | `local` (default) or `firestore` |
| `STORAGE_MODE` | No | Server-side: `local` or `firestore` |
| `GOOGLE_CLOUD_PROJECT` | Firestore only | GCP project ID |

---

## Mock Data

240 deterministic users generated with a seeded random function.  
Each user has: food preferences, zodiac, approximate dating area (jittered coordinates — no exact addresses), available slots, and a vibe prompt.

```bash
npm run generate:mock-users
```

---

## Testing

```bash
npm run test        # Vitest unit tests (zodiac, matching, storage, AI fallback)
npm run typecheck   # TypeScript
npm run build       # Next.js production build

# E2E (requires running dev server)
npx playwright install
npm run e2e
```

---

## GCP Deploy

See [docs/gcp-deploy.md](docs/gcp-deploy.md) for full setup.

**Quick deploy (after GCP setup):**
```bash
docker build -t asia-east1-docker.pkg.dev/PROJECT_ID/tastemap-date/tastemap-date-web:latest .
docker push asia-east1-docker.pkg.dev/PROJECT_ID/tastemap-date/tastemap-date-web:latest
gcloud run deploy tastemap-date-web \
  --image=asia-east1-docker.pkg.dev/PROJECT_ID/tastemap-date/tastemap-date-web:latest \
  --region=asia-east1 \
  --allow-unauthenticated \
  --set-secrets="ANTHROPIC_API_KEY=ANTHROPIC_API_KEY:latest"
```

**CI/CD:** Push to `main` → GitHub Actions runs tests → builds Docker image → pushes to Artifact Registry → deploys to Cloud Run. Uses Workload Identity Federation (no long-lived service account keys).

---

## Design Tradeoffs

| Decision | Reasoning |
|---|---|
| localStorage first | Zero infra for demo; Firestore adapter is a clean swap when needed |
| AI is optional | Demo stability > feature completeness; fallback text is still good UX |
| 240 JSON mock users | No DB required; deterministic = reproducible demo |
| Match score = pure function | Explainable, testable, fast — no AI black box for core logic |
| Jittered coordinates only | Privacy by design — never shows exact home address |
| Next.js standalone output | Required for minimal Cloud Run container size |

---

## Safety & Privacy

- No real user data is collected
- Location data is approximate (area-level, ±500m jitter)
- All "users" are deterministic mock data
- AI-generated messages are suggestions only — user edits before sending
- No persistent auth — demo profile stored in localStorage

---

## Demo Script

See [docs/demo-script.md](docs/demo-script.md) for the 3-minute walkthrough.
