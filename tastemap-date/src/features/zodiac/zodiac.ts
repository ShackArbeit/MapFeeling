import type { ZodiacElement } from "@/types/domain";

type ZodiacInfo = { name: string; element: ZodiacElement };

const SIGNS: ZodiacInfo[] = [
  { name: "摩羯座", element: "earth" },
  { name: "水瓶座", element: "air" },
  { name: "雙魚座", element: "water" },
  { name: "牡羊座", element: "fire" },
  { name: "金牛座", element: "earth" },
  { name: "雙子座", element: "air" },
  { name: "巨蟹座", element: "water" },
  { name: "獅子座", element: "fire" },
  { name: "處女座", element: "earth" },
  { name: "天秤座", element: "air" },
  { name: "天蠍座", element: "water" },
  { name: "射手座", element: "fire" },
];

// [signIndex, startMonth, startDay] sorted chronologically from January
const TRANSITIONS = [
  [1, 1, 20],   // Aquarius
  [2, 2, 19],   // Pisces
  [3, 3, 21],   // Aries
  [4, 4, 20],   // Taurus
  [5, 5, 21],   // Gemini
  [6, 6, 21],   // Cancer
  [7, 7, 23],   // Leo
  [8, 8, 23],   // Virgo
  [9, 9, 23],   // Libra
  [10, 10, 23], // Scorpio
  [11, 11, 22], // Sagittarius
  [0, 12, 22],  // Capricorn (Dec 22+)
] as const;

export function calculateZodiac(birthDate: string): {
  zodiacSign: string;
  zodiacElement: ZodiacElement;
} {
  const date = new Date(birthDate);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const md = month * 100 + day;

  // Jan 1–19 falls in Capricorn before Aquarius starts Jan 20
  let signIndex = 0;

  for (const [idx, sm, sd] of TRANSITIONS) {
    if (md >= sm * 100 + sd) {
      signIndex = idx;
    }
  }

  return { zodiacSign: SIGNS[signIndex].name, zodiacElement: SIGNS[signIndex].element };
}
