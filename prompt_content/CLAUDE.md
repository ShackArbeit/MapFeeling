# Claude Code General Intro｜TasteMap Date MVP

You are my senior full-stack engineer pair programmer using **Claude Code CLI**.

We are building an interview MVP called **TasteMap Date｜食感航線**.

This is a **food-first dating web MVP**. The product goal is to reduce the pressure of first conversations by helping users discover people through:

- shared food preferences
- approximate dating areas
- zodiac element affinity as emotional engagement
- AI-generated low-pressure invitation suggestions
- a simple date request accept / reject flow

This is not a full production dating app.  
This is an interview MVP for a **Vibe Coding Engineer / Next.js / Node.js** role.

---

## Hard Constraints

- Timebox: **3 working days**
- Platform: **Web only**
- Do not build Flutter
- Do not build chat
- Do not build full auth
- Do not build payment
- Do not build real-time location
- Do not show exact home addresses
- Existing users must be deterministic mock data
- Generate at least **200 users**, recommended **240**
- Existing users do **not** need to be stored in DB
- Mutable date request state should use a storage adapter:
  - start with browser localStorage mode
  - optionally support Firestore mode
- Deploy target: **Google Cloud Platform**
- Hosting: **Cloud Run**
- Container registry: **Artifact Registry**
- CI/CD: **GitHub Actions + GCP**
- Secrets: **GCP Secret Manager**
- AI advice: **Anthropic Claude API if available, fallback if not**

---

## Product Positioning

TasteMap Date is a dating MVP where the first interaction is not “滑卡配對” or awkward chat.

The core emotional value is:

> “不要先想怎麼聊天，先從一起吃什麼開始。”

The app should feel warm, lightweight, safe, and demo-friendly.

---

## Expected User Flow

1. User lands on product intro page.
2. User creates a demo onboarding profile.
3. User chooses food preferences and approximate dating area.
4. User sees a taste map with mock users.
5. User filters candidates by food type.
6. User clicks a candidate marker.
7. Candidate card shows:
   - profile
   - shared food preferences
   - zodiac element
   - approximate area
   - match score
   - explainable match reasons
8. User generates AI invite suggestion.
9. User sends a date request.
10. Receiver inbox can accept or reject.

---

## Tech Stack

### Frontend

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Hook Form
- Zod
- Leaflet / React Leaflet
- Zustand or React state
- lucide-react

### Backend

- Next.js Route Handlers
- Node.js runtime
- Anthropic SDK
- AI fallback logic
- Storage adapter for date requests

### Data

- TypeScript generator script
- Deterministic seeded mock data
- JSON committed to repo
- Taipei / New Taipei approximate dating areas
- Coordinate jitter
- No real address

### Testing

- Vitest
- Playwright
- Pure function unit tests
- Basic happy-path e2e test

### GCP / CI/CD

- Dockerfile
- `next.config.ts` with standalone output
- Cloud Run
- Artifact Registry
- Secret Manager
- Firestore optional
- GitHub Actions
- Workload Identity Federation

---

## Required npm Dependencies

Install these unless the project already has equivalent packages:

```bash
npm install zod react-hook-form @hookform/resolvers zustand leaflet react-leaflet @anthropic-ai/sdk firebase-admin lucide-react
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom playwright tsx
```

For shadcn/ui:

```bash
npx shadcn@latest init
npx shadcn@latest add button card badge dialog form input select textarea tabs alert separator skeleton sonner
```

If the shadcn CLI changes package choices, use the current recommended CLI defaults.

---

## Critical Implementation Rules

### Rule 1: Prefer stable demo over complex production completeness

If there is a conflict between “beautiful architecture” and “working demo,” choose working demo.

### Rule 2: Do not use exact location

Use approximate dating area only.  
Use jittered coordinates.  
Label data clearly as “recommended dating area,” not home location.

### Rule 3: AI advice must not be a hard dependency

If `ANTHROPIC_API_KEY` is missing, return deterministic fallback text.

### Rule 4: Matching must be explainable

The match score should come from pure functions, not opaque AI.

Weights:

```ts
const totalScore =
  foodOverlapScore * 0.4 +
  zodiacElementScore * 0.2 +
  locationScore * 0.2 +
  availabilityScore * 0.1 +
  vibePromptScore * 0.1;
```

### Rule 5: Keep mutable state behind an adapter

Create a `DateRequestStore` interface:

```ts
export interface DateRequestStore {
  create(input: CreateDateRequestInput): Promise<DateRequest>;
  listByReceiver(receiverId: string): Promise<DateRequest[]>;
  updateStatus(id: string, status: DateRequestStatus): Promise<DateRequest>;
}
```

### Rule 6: Make repo interview-readable

The interviewer should understand the product, architecture, and tradeoffs within 3 minutes by reading README and watching the demo.

---

## First Task

Before coding, inspect the current repo.

Then create:

- implementation plan
- repo structure
- package scripts
- README outline
- docs/architecture.md
- docs/demo-script.md
- docs/decision-log.md
- `.env.example`

Do not implement all features at once.  
Work Phase by Phase.


---

# Current Active Workflow

Work Phase by Phase. Never skip acceptance criteria. Prefer a stable demo over over-engineering.
