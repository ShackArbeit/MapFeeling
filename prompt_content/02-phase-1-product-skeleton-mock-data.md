# Phase 1｜Product Skeleton + Mock Data + Taste Map

> Use with Claude Code CLI.  
> Goal: make the MVP look like a real product with 200+ browsable users.

You are implementing **Phase 1** of TasteMap Date MVP.

---

## Phase Goal

Build the product skeleton:

- landing page
- onboarding page
- 240 deterministic mock users
- `/api/profiles`
- taste map
- food filter
- avatar markers
- candidate card

This Phase should make the app visually demo-able.

---

## Timebox

Recommended: **Day 1**

---

## Required Pages

Create or update:

```txt
src/app/page.tsx
src/app/onboarding/page.tsx
src/app/map/page.tsx
```

Optional but useful:

```txt
src/app/layout.tsx
src/app/globals.css
```

---

## Required Components

Create:

```txt
src/components/TasteMap.tsx
src/components/CandidateCard.tsx
src/components/FoodTagFilter.tsx
src/components/OnboardingForm.tsx
src/components/MatchReasonPanel.tsx
```

---

## Required Data / API

Create:

```txt
scripts/generate-mock-users.ts
src/data/mock-users.generated.json
src/app/api/profiles/route.ts
```

---

## Technical Imports Must Be Precise

### `src/app/map/page.tsx`

Use dynamic import because Leaflet depends on browser APIs.

```ts
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { FoodTagFilter } from "@/components/FoodTagFilter";
import { CandidateCard } from "@/components/CandidateCard";
```

Example:

```ts
const TasteMap = dynamic(
  () => import("@/components/TasteMap").then((mod) => mod.TasteMap),
  { ssr: false }
);
```

### `src/components/TasteMap.tsx`

This must be a client component.

```ts
"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import type { UserProfile } from "@/types/domain";
```

Also make sure Leaflet CSS is imported globally, usually in `src/app/layout.tsx`:

```ts
import "leaflet/dist/leaflet.css";
```

If marker icons break in Next.js, create a custom `L.divIcon` avatar marker instead of relying on default Leaflet marker PNGs.

### `src/components/OnboardingForm.tsx`

```ts
"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
```

If `Checkbox` was not added by shadcn, add it:

```bash
npx shadcn@latest add checkbox
```

### `src/app/api/profiles/route.ts`

```ts
import { NextRequest, NextResponse } from "next/server";
import mockUsers from "@/data/mock-users.generated.json";
import type { UserProfile, FoodType, ZodiacElement } from "@/types/domain";
```

Make sure `tsconfig.json` supports JSON imports:

```json
{
  "compilerOptions": {
    "resolveJsonModule": true
  }
}
```

### `scripts/generate-mock-users.ts`

```ts
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import type { FoodType, UserProfile } from "../src/types/domain";
import { FOOD_TYPES } from "../src/data/food-types";
import { TAIPEI_AREAS } from "../src/data/taipei-districts";
import { calculateZodiac } from "../src/features/zodiac/zodiac";
```

If `calculateZodiac` is not ready yet, create a minimal temporary version in this Phase and improve it in Phase 2.

---

## Mock Data Requirements

Generate **240** users.

Every user must include:

```txt
id
nickname
avatarUrl
birthDate
zodiacSign
zodiacElement
bio
vibePrompt
foodPreferences
preferredArea
availableSlots
lat
lng
locationPrecision
safetyNote
createdAt
```

Rules:

- deterministic seed
- no real names required
- no exact addresses
- use DiceBear avatar URLs or local placeholder avatars
- use approximate Taipei / New Taipei areas
- add coordinate jitter
- food preferences should be distributed across all food types
- birth dates should distribute zodiac signs reasonably

---

## API Requirements

### `GET /api/profiles`

Support query params:

```txt
foodType
area
zodiacElement
limit
```

Response shape:

```ts
{
  items: UserProfile[];
  total: number;
}
```

Validation:

- invalid `foodType` should not crash
- invalid `limit` should fallback to default
- default limit can be 60
- max limit can be 240

---

## Landing Page Requirements

The landing page must explain:

- food-first dating
- emotional UX
- approximate location safety
- AI low-pressure invite suggestion
- CTA to onboarding

Suggested sections:

1. Hero
2. Problem
3. How it works
4. Safety design
5. MVP tech highlights
6. CTA

Use shadcn cards and badges.

---

## Onboarding Requirements

Fields:

```txt
nickname
birthDate
foodPreferences
preferredArea
availableSlots
vibePrompt
```

For MVP, store onboarding profile in `localStorage` as:

```txt
tastemap.viewerProfile
```

Then redirect to `/map`.

---

## Taste Map Requirements

Map should:

- center around Taipei
- show avatar markers
- use approximate coordinates only
- open popup on marker click
- select candidate on click
- update candidate card
- filter by food type

The map does not need Google Maps.  
Use OpenStreetMap tile layer through Leaflet.

---

## Candidate Card Requirements

Show:

- avatar
- nickname
- area
- bio
- food tags
- vibe prompt
- zodiac sign / element
- safety note
- CTA: “產生邀約建議” placeholder for Phase 2

Phase 1 can show a placeholder match score.  
Real match score is Phase 2.

---

## Acceptance Criteria

Run:

```bash
npm run generate:mock-users
npm run typecheck
npm run build
```

Manual check:

```txt
/ loads
/onboarding works
/map loads without Leaflet SSR crash
/api/profiles returns users
food filter works
marker click opens candidate card
```

Commit message suggestion:

```bash
git add .
git commit -m "feat: build product skeleton and mock taste map"
```

---

## Stop Condition

Do not proceed to Phase 2 unless:

- 240 users generated
- map works
- food filter works
- candidate card works
- no exact address shown
- build passes
