import { NextRequest, NextResponse } from "next/server";
import mockUsersJson from "@/data/mock-users.generated.json";
import type { UserProfile, FoodType, ZodiacElement } from "@/types/domain";

const VALID_FOOD_TYPES = new Set<string>([
  "ramen", "hotpot", "coffee", "dessert", "izakaya", "vegetarian",
  "steak", "night_market", "brunch", "thai", "korean", "sushi",
]);

const VALID_ELEMENTS = new Set<string>(["fire", "earth", "air", "water"]);

const ALL_USERS = mockUsersJson as UserProfile[];

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  const foodType = params.get("foodType");
  const area = params.get("area");
  const zodiacElement = params.get("zodiacElement");
  const limitParam = params.get("limit");

  let limit = parseInt(limitParam ?? "60", 10);
  if (isNaN(limit) || limit < 1) limit = 60;
  if (limit > 240) limit = 240;

  let items: UserProfile[] = ALL_USERS;

  if (foodType && VALID_FOOD_TYPES.has(foodType)) {
    items = items.filter((u) =>
      u.foodPreferences.includes(foodType as FoodType)
    );
  }

  if (area) {
    items = items.filter((u) => u.preferredArea === area);
  }

  if (zodiacElement && VALID_ELEMENTS.has(zodiacElement)) {
    items = items.filter(
      (u) => u.zodiacElement === (zodiacElement as ZodiacElement)
    );
  }

  const total = items.length;
  items = items.slice(0, limit);

  return NextResponse.json({ items, total });
}
