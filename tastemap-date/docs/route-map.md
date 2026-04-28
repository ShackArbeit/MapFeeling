# Route Map｜TasteMap Date

## Page Routes

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Landing page — product intro, CTA |
| GET | `/onboarding` | Onboarding form — create viewer profile |
| GET | `/map` | Taste map — browse candidates by food type |
| GET | `/inbox` | Date request inbox — accept / reject |

## API Routes

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/profiles` | List mock user profiles with filters |
| POST | `/api/match-advice` | Generate AI invite suggestion |
| POST | `/api/date-requests` | Create a date request (Firestore mode) |
| GET | `/api/date-requests?receiverId=` | List date requests by receiver (Firestore mode) |
| PATCH | `/api/date-requests/:id` | Update date request status (Firestore mode) |

## Query Parameters for `/api/profiles`

| Param | Type | Description |
|-------|------|-------------|
| `foodType` | `FoodType` | Filter by food preference |
| `area` | `string` | Filter by preferred area |
| `zodiacElement` | `ZodiacElement` | Filter by zodiac element |
| `limit` | `number` | Max results (default: 60, max: 240) |

## Storage Mode Behavior

In **local mode** (`NEXT_PUBLIC_STORAGE_MODE=local`):
- Date requests are stored in browser `localStorage`
- `/api/date-requests` routes are unused
- Client calls `browserLocalDateRequestStore` directly

In **firestore mode** (`NEXT_PUBLIC_STORAGE_MODE=firestore`):
- Date requests go through API routes
- Server uses `firestoreDateRequestStore`
