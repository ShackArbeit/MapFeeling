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

export type MatchScoreBreakdown = {
  foodOverlapScore: number;
  zodiacElementScore: number;
  locationScore: number;
  availabilityScore: number;
  vibePromptScore: number;
  totalScore: number;
  reasons: string[];
};
