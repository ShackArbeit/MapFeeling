import { describe, expect, it } from "vitest";
import { calculateMatchScore } from "./calculateMatchScore";
import type { UserProfile } from "@/types/domain";

const base: UserProfile = {
  id: "test-1",
  nickname: "A",
  avatarUrl: "",
  birthDate: "1995-06-15",
  zodiacSign: "雙子座",
  zodiacElement: "air",
  bio: "",
  vibePrompt: "喜歡悠閒午後",
  foodPreferences: ["ramen", "coffee", "brunch"],
  preferredArea: "大安",
  availableSlots: ["平日午後", "週末午後"],
  lat: 25.026,
  lng: 121.543,
  locationPrecision: "area",
  safetyNote: "",
  createdAt: "2024-01-01T00:00:00Z",
};

const candidate: UserProfile = {
  ...base,
  id: "test-2",
  nickname: "B",
  zodiacSign: "雙子座",
  zodiacElement: "air",
  vibePrompt: "想找人喝咖啡",
  foodPreferences: ["ramen", "coffee", "sushi"],
  preferredArea: "大安",
  availableSlots: ["平日午後", "週末晚上"],
};

describe("calculateMatchScore", () => {
  it("returns all five sub-scores and totalScore", () => {
    const result = calculateMatchScore(base, candidate);
    expect(result).toHaveProperty("foodOverlapScore");
    expect(result).toHaveProperty("zodiacElementScore");
    expect(result).toHaveProperty("locationScore");
    expect(result).toHaveProperty("availabilityScore");
    expect(result).toHaveProperty("vibePromptScore");
    expect(result).toHaveProperty("totalScore");
    expect(result.reasons).toHaveLength(5);
  });

  it("food overlap 2 items => score 80", () => {
    const result = calculateMatchScore(base, candidate);
    expect(result.foodOverlapScore).toBe(80);
  });

  it("same zodiac sign => score 100", () => {
    const result = calculateMatchScore(base, candidate);
    expect(result.zodiacElementScore).toBe(100);
  });

  it("same area => location score 100", () => {
    const result = calculateMatchScore(base, candidate);
    expect(result.locationScore).toBe(100);
  });

  it("availability overlap => score 100", () => {
    const result = calculateMatchScore(base, candidate);
    expect(result.availabilityScore).toBe(100);
  });

  it("both have vibe prompt => score 80", () => {
    const result = calculateMatchScore(base, candidate);
    expect(result.vibePromptScore).toBe(80);
  });

  it("totalScore is weighted sum rounded", () => {
    const result = calculateMatchScore(base, candidate);
    const expected = Math.round(80 * 0.4 + 100 * 0.2 + 100 * 0.2 + 100 * 0.1 + 80 * 0.1);
    expect(result.totalScore).toBe(expected);
  });

  it("no food overlap => food score 0", () => {
    const noOverlap: UserProfile = { ...candidate, foodPreferences: ["steak", "thai"] };
    const result = calculateMatchScore(base, noOverlap);
    expect(result.foodOverlapScore).toBe(0);
  });

  it("different element => zodiac score 40", () => {
    const earth: UserProfile = { ...candidate, zodiacSign: "金牛座", zodiacElement: "earth" };
    const result = calculateMatchScore(base, earth);
    expect(result.zodiacElementScore).toBe(40);
  });
});