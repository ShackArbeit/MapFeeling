# Data Model｜TasteMap Date

## UserProfile

Represents a mock user in the system. All existing users are generated deterministically at build time.

```ts
type UserProfile = {
  id: string;              // "mock-user-001"
  nickname: string;        // Display name
  avatarUrl: string;       // DiceBear avatar URL
  birthDate: string;       // "1995-08-15" (ISO date)
  zodiacSign: string;      // "Leo"
  zodiacElement: ZodiacElement; // "fire" | "earth" | "air" | "water"
  bio: string;             // Short self-introduction
  vibePrompt: string;      // "我喜歡..."
  foodPreferences: FoodType[]; // ["ramen", "coffee"]
  preferredArea: string;   // "大安"
  availableSlots: string[]; // ["週末午後", "平日晚上"]
  lat: number;             // Approximate lat with jitter
  lng: number;             // Approximate lng with jitter
  locationPrecision: "area" | "venue"; // Always "area" for mock users
  safetyNote: string;      // "此為推薦約會區域，非實際住址"
  createdAt: string;       // ISO timestamp
};
```

## MatchScoreBreakdown

Result of pure-function match scoring. Never computed by AI.

```ts
type MatchScoreBreakdown = {
  foodOverlapScore: number;    // 0–100
  zodiacElementScore: number;  // 0–100
  locationScore: number;       // 0–100
  availabilityScore: number;   // 0–100
  vibePromptScore: number;     // 0–100
  totalScore: number;          // Weighted composite 0–100
  reasons: string[];           // Human-readable match reasons
};
```

## Score Weights

```
totalScore =
  foodOverlapScore   × 0.4
  zodiacElementScore × 0.2
  locationScore      × 0.2
  availabilityScore  × 0.1
  vibePromptScore    × 0.1
```

## Food Types

12 categories: `ramen`, `hotpot`, `coffee`, `dessert`, `izakaya`, `vegetarian`, `steak`, `night_market`, `brunch`, `thai`, `korean`, `sushi`

## Zodiac Elements

| Element | Signs |
|---------|-------|
| fire | Aries, Leo, Sagittarius |
| earth | Taurus, Virgo, Capricorn |
| air | Gemini, Libra, Aquarius |
| water | Cancer, Scorpio, Pisces |
