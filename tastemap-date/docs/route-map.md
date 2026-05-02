# Route Map｜TasteMap Date

## Page Routes

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Landing page — product intro, CTA |
| GET | `/onboarding` | Onboarding form — create viewer profile |
| GET | `/map` | Taste map — browse candidates by food type |

## API Routes

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/profiles` | List mock user profiles with filters |
| POST | `/api/match-advice` | Generate AI invite suggestion |

## Query Parameters for `/api/profiles`

| Param | Type | Description |
|-------|------|-------------|
| `foodType` | `FoodType` | Filter by food preference |
| `area` | `string` | Filter by preferred area |
| `zodiacElement` | `ZodiacElement` | Filter by zodiac element |
| `limit` | `number` | Max results (default: 60, max: 240) |
