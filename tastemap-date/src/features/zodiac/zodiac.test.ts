import { describe, expect, it } from "vitest";
import { calculateZodiac } from "./zodiac";

describe("calculateZodiac", () => {
  it("1997-08-08 => 獅子座 / fire", () => {
    const result = calculateZodiac("1997-08-08");
    expect(result.zodiacSign).toBe("獅子座");
    expect(result.zodiacElement).toBe("fire");
  });

  it("1995-01-20 => 水瓶座 / air", () => {
    const result = calculateZodiac("1995-01-20");
    expect(result.zodiacSign).toBe("水瓶座");
    expect(result.zodiacElement).toBe("air");
  });

  it("1993-12-22 => 摩羯座 / earth", () => {
    const result = calculateZodiac("1993-12-22");
    expect(result.zodiacSign).toBe("摩羯座");
    expect(result.zodiacElement).toBe("earth");
  });

  it("Jan 1 => 摩羯座 / earth", () => {
    const result = calculateZodiac("2000-01-01");
    expect(result.zodiacSign).toBe("摩羯座");
    expect(result.zodiacElement).toBe("earth");
  });

  it("Mar 21 => 牡羊座 / fire", () => {
    const result = calculateZodiac("2000-03-21");
    expect(result.zodiacSign).toBe("牡羊座");
    expect(result.zodiacElement).toBe("fire");
  });
});
