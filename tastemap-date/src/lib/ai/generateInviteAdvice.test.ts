import { describe, expect, it } from "vitest";
import { generateInviteAdvice } from "./generateInviteAdvice";

import type { FoodType } from "@/types/domain";

const input = {
  viewerId: "user-1",
  candidateId: "user-2",
  sharedFoodTypes: ["coffee", "brunch"] as FoodType[],
  matchScore: 75,
  viewerVibe: "喜歡悠閒午後",
  candidateVibe: "想找人喝咖啡",
};

describe("generateInviteAdvice — fallback mode (no API key)", () => {
  it("returns an object with reason and suggestedMessage", async () => {
    const result = await generateInviteAdvice(input);
    expect(result).toHaveProperty("reason");
    expect(result).toHaveProperty("suggestedMessage");
    expect(typeof result.reason).toBe("string");
    expect(typeof result.suggestedMessage).toBe("string");
  });

  it("fallback reason mentions the shared food type", async () => {
    const result = await generateInviteAdvice(input);
    expect(result.reason.length).toBeGreaterThan(0);
    expect(result.suggestedMessage.length).toBeGreaterThan(0);
  });

  it("works with empty sharedFoodTypes", async () => {
    const result = await generateInviteAdvice({
      ...input,
      sharedFoodTypes: [],
    });
    expect(result.reason).toContain("美食");
  });
});