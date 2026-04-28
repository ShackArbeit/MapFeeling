# Phase 0｜Scope, Architecture, Repo Foundation

> Use with Claude Code CLI.  
> Goal: establish the project foundation without overbuilding.

You are implementing **Phase 0** of TasteMap Date MVP.

---

## Phase Goal

Create a clear and stable engineering foundation for a 3-day interview MVP.

Do not build the full product yet.  
Prepare the repo so Phase 1 can implement the product skeleton quickly.

---

## Timebox

Recommended: **0.5 day**

---

## Main Deliverables

Create or update:

```txt
README.md
docs/architecture.md
docs/demo-script.md
docs/decision-log.md
docs/route-map.md
docs/data-model.md
.env.example
package.json scripts
src/types/domain.ts
src/data/food-types.ts
src/data/taipei-districts.ts
```

---

## Required Project Structure

Target structure:

```txt
tastemap-date/
├── .github/
│   └── workflows/
│       └── deploy-cloud-run.yml
├── docs/
│   ├── architecture.md
│   ├── data-model.md
│   ├── decision-log.md
│   ├── demo-script.md
│   └── route-map.md
├── public/
│   └── mock-avatars/
├── scripts/
│   └── generate-mock-users.ts
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── onboarding/
│   │   ├── map/
│   │   ├── inbox/
│   │   └── api/
│   ├── components/
│   ├── data/
│   │   ├── food-types.ts
│   │   └── taipei-districts.ts
│   ├── features/
│   │   ├── matching/
│   │   ├── zodiac/
│   │   └── date-requests/
│   ├── lib/
│   │   ├── ai/
│   │   └── env.ts
│   └── types/
│       └── domain.ts
├── tests/
│   └── e2e/
├── Dockerfile
├── next.config.ts
├── package.json
└── .env.example
```

---

## Required Dependencies

Install or verify:

```bash
npm install zod react-hook-form @hookform/resolvers zustand leaflet react-leaflet @anthropic-ai/sdk firebase-admin lucide-react
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom playwright tsx
```

Initialize shadcn/ui:

```bash
npx shadcn@latest init
npx shadcn@latest add button card badge dialog form input select textarea tabs alert separator skeleton sonner
```

---

## Required `package.json` Scripts

Add these scripts if missing:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "typecheck": "tsc --noEmit",
    "generate:mock-users": "tsx scripts/generate-mock-users.ts",
    "test": "vitest run",
    "test:watch": "vitest",
    "e2e": "playwright test",
    "lint": "next lint"
  }
}
```

If the current Next.js version does not support `next lint`, replace with a compatible ESLint command.

---

## Required Domain Types

Create `src/types/domain.ts`.

Expected imports:

```ts
// No external imports required for this file.
```

Required content:

```ts
export type ZodiacElement = "fire" | "earth" | "air" | "water";

export type FoodType =
  | "ramen"
  | "hotpot"
  | "coffee"
  | "dessert"
  | "izakaya"
  | "vegetarian"
  | "steak"
  | "night_market"
  | "brunch"
  | "thai"
  | "korean"
  | "sushi";

export type UserProfile = {
  id: string;
  nickname: string;
  avatarUrl: string;
  birthDate: string;
  zodiacSign: string;
  zodiacElement: ZodiacElement;
  bio: string;
  vibePrompt: string;
  foodPreferences: FoodType[];
  preferredArea: string;
  availableSlots: string[];
  lat: number;
  lng: number;
  locationPrecision: "area" | "venue";
  safetyNote: string;
  createdAt: string;
};

export type DateRequestStatus = "pending" | "accepted" | "rejected";

export type DateRequest = {
  id: string;
  senderId: string;
  receiverId: string;
  foodType: FoodType;
  proposedArea: string;
  proposedPlaceName: string;
  proposedTime: string;
  message: string;
  aiReason: string;
  status: DateRequestStatus;
  createdAt: string;
  updatedAt: string;
};

export type MatchScoreBreakdown = {
  foodOverlapScore: number;
  zodiacElementScore: number;
  locationScore: number;
  availabilityScore: number;
  vibePromptScore: number;
  totalScore: number;
  reasons: string[];
};
```

---

## Required Data Constants

Create `src/data/food-types.ts`.

Expected imports:

```ts
import type { FoodType } from "@/types/domain";
```

Create:

```ts
export const FOOD_TYPES: FoodType[] = [
  "ramen",
  "hotpot",
  "coffee",
  "dessert",
  "izakaya",
  "vegetarian",
  "steak",
  "night_market",
  "brunch",
  "thai",
  "korean",
  "sushi",
];

export const FOOD_TYPE_LABELS: Record<FoodType, string> = {
  ramen: "拉麵",
  hotpot: "火鍋",
  coffee: "咖啡",
  dessert: "甜點",
  izakaya: "居酒屋",
  vegetarian: "蔬食",
  steak: "牛排",
  night_market: "夜市",
  brunch: "早午餐",
  thai: "泰式",
  korean: "韓式",
  sushi: "壽司",
};
```

Create `src/data/taipei-districts.ts`.

Expected imports:

```ts
// No external imports required.
```

Create:

```ts
export const TAIPEI_AREAS = [
  { name: "大安", lat: 25.026, lng: 121.543 },
  { name: "信義", lat: 25.033, lng: 121.565 },
  { name: "中山", lat: 25.064, lng: 121.525 },
  { name: "松山", lat: 25.049, lng: 121.578 },
  { name: "士林", lat: 25.095, lng: 121.525 },
  { name: "萬華", lat: 25.036, lng: 121.499 },
  { name: "板橋", lat: 25.014, lng: 121.463 },
  { name: "永和", lat: 25.010, lng: 121.515 },
  { name: "新店", lat: 24.967, lng: 121.541 },
  { name: "三重", lat: 25.061, lng: 121.488 },
] as const;
```

---

## Required Environment File

Create `.env.example`:

```bash
NEXT_PUBLIC_APP_ENV=development

# local | firestore
NEXT_PUBLIC_STORAGE_MODE=local
STORAGE_MODE=local

# optional for AI advice
ANTHROPIC_API_KEY=

# Firestore / GCP
GOOGLE_CLOUD_PROJECT=
```

---

## Documentation Requirements

### `docs/architecture.md`

Include:

- product goal
- high-level architecture
- frontend
- backend
- data strategy
- GCP deploy strategy
- safety constraints
- why mock profiles are acceptable
- why mutable date requests should be behind adapter

### `docs/route-map.md`

Include:

```txt
GET /
GET /onboarding
GET /map
GET /inbox

GET /api/profiles
POST /api/match-advice
POST /api/date-requests
GET /api/date-requests?receiverId=
PATCH /api/date-requests/:id
```

### `docs/demo-script.md`

Include a 3-minute demo flow:

1. problem
2. onboarding
3. map
4. candidate card
5. AI invite suggestion
6. date request
7. inbox accept/reject
8. architecture explanation

### `docs/decision-log.md`

Include these decisions:

- Web MVP only, no Flutter
- 200+ deterministic mock users
- approximate dating area only
- match score is rule-based
- AI is explainable copy layer, not decision layer
- Cloud Run instead of Vercel
- GitHub Actions + Workload Identity Federation

---

## Acceptance Criteria

Before finishing Phase 0, run:

```bash
npm run typecheck
npm run build
```

If build cannot pass yet because app pages are not implemented, explain exactly what remains for Phase 1.

Commit message suggestion:

```bash
git add .
git commit -m "chore: establish TasteMap Date MVP foundation"
```

---

## Stop Condition

Do not proceed to Phase 1 unless:

- domain model exists
- data constants exist
- docs exist
- package scripts exist
- env example exists
- README explains the MVP scope
