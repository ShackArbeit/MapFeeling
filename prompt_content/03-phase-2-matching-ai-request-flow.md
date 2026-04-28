# Phase 2｜Matching + AI Advice + Date Request Flow

> Use with Claude Code CLI.  
> Goal: turn the product from browsable demo into an interactive MVP loop.

You are implementing **Phase 2** of TasteMap Date MVP.

---

## Phase Goal

Build the full interaction loop:

1. zodiac calculation
2. match scoring
3. explainable candidate reasons
4. AI invite advice endpoint
5. AI fallback
6. date request creation
7. inbox
8. accept / reject
9. storage adapter

---

## Timebox

Recommended: **Day 2**

---

## Required Files

Create or update:

```txt
src/features/zodiac/zodiac.ts
src/features/zodiac/zodiac.test.ts
src/features/matching/calculateMatchScore.ts
src/features/matching/calculateMatchScore.test.ts
src/features/date-requests/dateRequest.types.ts
src/features/date-requests/dateRequest.service.ts
src/features/date-requests/browserLocalDateRequestStore.ts
src/features/date-requests/firestoreDateRequestStore.server.ts
src/lib/ai/generateInviteAdvice.ts
src/lib/firestore.server.ts
src/app/api/match-advice/route.ts
src/app/api/date-requests/route.ts
src/app/api/date-requests/[id]/route.ts
src/app/inbox/page.tsx
src/components/DateRequestDialog.tsx
src/components/MatchReasonPanel.tsx
```

---

## Technical Imports Must Be Precise

### Zodiac pure function

`src/features/zodiac/zodiac.ts`

```ts
import type { ZodiacElement } from "@/types/domain";
```

No date library required.

### Match scoring

`src/features/matching/calculateMatchScore.ts`

```ts
import type { MatchScoreBreakdown, UserProfile } from "@/types/domain";
```

### Unit tests

```ts
import { describe, expect, it } from "vitest";
```

### AI generation

`src/lib/ai/generateInviteAdvice.ts`

```ts
import Anthropic from "@anthropic-ai/sdk";
import type { FoodType } from "@/types/domain";
```

Use the current Anthropic SDK message API.  
If exact SDK typing differs, inspect installed package types before finalizing.

### Match advice API route

`src/app/api/match-advice/route.ts`

```ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateInviteAdvice } from "@/lib/ai/generateInviteAdvice";
```

### Firestore server client

`src/lib/firestore.server.ts`

```ts
import { getApps, initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
```

Do not put firebase-admin code in client components.

### Date request route

```ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
```

### Client dialog

```ts
"use client";

import { useState } from "react";
import type { DateRequest, FoodType, UserProfile } from "@/types/domain";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
```

---

## Zodiac Requirements

Implement:

```ts
export function calculateZodiac(birthDate: string): {
  zodiacSign: string;
  zodiacElement: ZodiacElement;
};
```

Expected signs:

```txt
Aries fire
Taurus earth
Gemini air
Cancer water
Leo fire
Virgo earth
Libra air
Scorpio water
Sagittarius fire
Capricorn earth
Aquarius air
Pisces water
```

Use month/day boundaries.

Add unit tests for at least:

```txt
1997-08-08 => Leo / fire
1995-01-20 => Aquarius / air
1993-12-22 => Capricorn / earth
```

---

## Match Scoring Requirements

Implement:

```ts
export function calculateMatchScore(
  viewer: UserProfile,
  candidate: UserProfile
): MatchScoreBreakdown;
```

Weights:

```ts
const totalScore =
  foodOverlapScore * 0.4 +
  zodiacElementScore * 0.2 +
  locationScore * 0.2 +
  availabilityScore * 0.1 +
  vibePromptScore * 0.1;
```

Scoring rules:

### Food overlap

- no overlap: 0
- 1 overlap: 50
- 2 overlaps: 80
- 3+ overlaps: 100

### Zodiac element

- same sign: 100
- same element: 80
- otherwise: 40

### Location

- same area: 100
- nearby / both in Taipei-New Taipei list: 70
- otherwise: 40

### Availability

- any overlap: 100
- otherwise: 40

### Vibe prompt

Keep it simple:

- if both have non-empty vibe prompt: 80
- otherwise: 50

Return human-readable `reasons`.

Do not use AI for the score.

---

## AI Advice Requirements

Endpoint:

```txt
POST /api/match-advice
```

Request body:

```ts
{
  viewerId: string;
  candidateId: string;
  sharedFoodTypes: FoodType[];
  matchScore: number;
  viewerVibe: string;
  candidateVibe: string;
}
```

Response:

```ts
{
  reason: string;
  suggestedMessage: string;
}
```

Rules:

- If `ANTHROPIC_API_KEY` is missing, return fallback.
- If Anthropic call fails, return fallback.
- Do not expose raw API error to user.
- Keep copy low-pressure, friendly, and not overly romantic.
- Do not claim certainty about compatibility.
- Do not mention exact location.

Fallback example:

```ts
return {
  reason: `你們都對 ${foodLabels.join("、")} 有興趣，而且互動偏好看起來適合從輕鬆的餐飲邀約開始。`,
  suggestedMessage: `我看到你也喜歡 ${foodLabels[0] ?? "美食"}，要不要找個週末午後一起去試試？`
};
```

---

## Date Request Storage Design

Create interface:

```ts
export type CreateDateRequestInput = Omit<
  DateRequest,
  "id" | "status" | "createdAt" | "updatedAt"
>;

export interface DateRequestStore {
  create(input: CreateDateRequestInput): Promise<DateRequest>;
  listByReceiver(receiverId: string): Promise<DateRequest[]>;
  updateStatus(id: string, status: DateRequestStatus): Promise<DateRequest>;
}
```

### Local Mode

Use browser `localStorage`.

Key:

```txt
tastemap.dateRequests
```

Client-only file:

```txt
src/features/date-requests/browserLocalDateRequestStore.ts
```

This file must start with:

```ts
"use client";
```

Do not import this file from server routes.

### Firestore Mode

Use server-side `firebase-admin`.

Collection:

```txt
date_requests
```

Document shape should match `DateRequest`.

Firestore is optional.  
If time is short, complete local mode first and leave Firestore mode cleanly documented.

---

## API Route Strategy

Because localStorage is browser-only, do not fake browser localStorage inside API routes.

Recommended:

- local mode: client service uses browser localStorage directly
- firestore mode: client calls `/api/date-requests`

Use:

```txt
NEXT_PUBLIC_STORAGE_MODE=local
STORAGE_MODE=local
```

or

```txt
NEXT_PUBLIC_STORAGE_MODE=firestore
STORAGE_MODE=firestore
```

---

## Inbox Requirements

Create `/inbox`.

For demo, allow selecting a mock receiver:

```txt
mock-user-2
```

Show:

- pending requests
- accepted requests
- rejected requests
- accept button
- reject button

State should update immediately.

---

## UI Integration Requirements

Update candidate card flow:

1. user selects candidate
2. calculate match score
3. show score and reasons
4. click AI advice button
5. show suggested invite
6. open date request dialog
7. send date request
8. navigate or link to `/inbox`

---

## Tests Required

Unit tests:

```txt
calculateZodiac
calculateMatchScore
date request status transition
```

Run:

```bash
npm run test
npm run typecheck
npm run build
```

---

## Acceptance Criteria

Manual flow:

```txt
1. go to /onboarding
2. create profile
3. go to /map
4. select food filter
5. click candidate
6. see match score
7. generate invite advice
8. send date request
9. go to /inbox
10. accept / reject request
11. status updates
```

Commit message suggestion:

```bash
git add .
git commit -m "feat: add matching ai advice and date request flow"
```

---

## Stop Condition

Do not proceed to Phase 3 unless:

- AI fallback works without API key
- date request works in local mode
- accept / reject works
- unit tests pass
- build passes
