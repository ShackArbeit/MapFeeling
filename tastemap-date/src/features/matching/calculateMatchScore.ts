import type { MatchScoreBreakdown, UserProfile } from "@/types/domain";
import { TAIPEI_AREAS } from "@/data/taipei-districts";
import { FOOD_TYPE_LABELS } from "@/data/food-types";

const TAIPEI_AREA_NAMES: Set<string> = new Set(TAIPEI_AREAS.map((a) => a.name));

const ELEMENT_LABELS: Record<string, string> = {
  fire: "火",
  earth: "土",
  air: "風",
  water: "水",
};

function calcFoodOverlapScore(a: UserProfile, b: UserProfile): [number, string] {
  const overlap = a.foodPreferences.filter((f) => b.foodPreferences.includes(f));
  const labels = overlap.map((f) => FOOD_TYPE_LABELS[f]);
  if (overlap.length === 0) return [0, "食物喜好暫無重疊"];
  if (overlap.length === 1) return [50, `共同喜愛：${labels.join("、")}`];
  if (overlap.length === 2) return [80, `共同喜愛：${labels.join("、")}`];
  return [100, `共同喜愛 ${overlap.length} 種：${labels.slice(0, 3).join("、")}…`];
}

function calcZodiacScore(a: UserProfile, b: UserProfile): [number, string] {
  if (a.zodiacSign === b.zodiacSign) return [100, `同為 ${a.zodiacSign}`];
  if (a.zodiacElement === b.zodiacElement)
    return [80, `同為${ELEMENT_LABELS[a.zodiacElement] ?? ""}象星座`];
  return [40, "星座元素互補"];
}

function calcLocationScore(a: UserProfile, b: UserProfile): [number, string] {
  if (a.preferredArea === b.preferredArea) return [100, `都在 ${a.preferredArea}`];
  if (TAIPEI_AREA_NAMES.has(a.preferredArea) && TAIPEI_AREA_NAMES.has(b.preferredArea))
    return [70, "都在大台北區域"];
  return [40, "約會地點距離稍遠"];
}

function calcAvailabilityScore(a: UserProfile, b: UserProfile): [number, string] {
  const overlap = a.availableSlots.filter((s) => b.availableSlots.includes(s));
  if (overlap.length > 0)
    return [100, `可約時段有 ${overlap.length} 個重疊：${overlap.slice(0, 2).join("、")}`];
  return [40, "可約時段暫無重疊"];
}

function calcVibeScore(a: UserProfile, b: UserProfile): [number, string] {
  if (a.vibePrompt.trim() && b.vibePrompt.trim()) return [80, "雙方都分享了約會心情"];
  return [50, "約會心情資料不完整"];
}

export function calculateMatchScore(
  viewer: UserProfile,
  candidate: UserProfile
): MatchScoreBreakdown {
  const [foodOverlapScore, foodReason] = calcFoodOverlapScore(viewer, candidate);
  const [zodiacElementScore, zodiacReason] = calcZodiacScore(viewer, candidate);
  const [locationScore, locationReason] = calcLocationScore(viewer, candidate);
  const [availabilityScore, availabilityReason] = calcAvailabilityScore(viewer, candidate);
  const [vibePromptScore, vibeReason] = calcVibeScore(viewer, candidate);

  const totalScore = Math.round(
    foodOverlapScore * 0.4 +
      zodiacElementScore * 0.2 +
      locationScore * 0.2 +
      availabilityScore * 0.1 +
      vibePromptScore * 0.1
  );

  return {
    foodOverlapScore,
    zodiacElementScore,
    locationScore,
    availabilityScore,
    vibePromptScore,
    totalScore,
    reasons: [foodReason, zodiacReason, locationReason, availabilityReason, vibeReason],
  };
}