import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "./route";

describe("GET /api/profiles", () => {
  it("filters users by area even when the query includes 區", async () => {
    const request = new NextRequest(
      "http://localhost:3000/api/profiles?area=%E5%A3%AB%E6%9E%97%E5%8D%80&limit=240"
    );

    const response = await GET(request);
    const data = (await response.json()) as { items: Array<{ preferredArea: string }> };

    expect(data.items.length).toBeGreaterThan(0);
    expect(
      data.items.every((item) => item.preferredArea === "\u58eb\u6797")
    ).toBe(true);
  });
});
