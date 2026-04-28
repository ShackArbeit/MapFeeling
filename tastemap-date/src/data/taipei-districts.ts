export const TAIPEI_AREAS = [
  { name: "大安", lat: 25.026, lng: 121.543 },
  { name: "信義", lat: 25.033, lng: 121.565 },
  { name: "中山", lat: 25.064, lng: 121.525 },
  { name: "松山", lat: 25.049, lng: 121.578 },
  { name: "士林", lat: 25.095, lng: 121.525 },
  { name: "萬華", lat: 25.036, lng: 121.499 },
  { name: "板橋", lat: 25.014, lng: 121.463 },
  { name: "永和", lat: 25.010, lng: 121.515 },
  { name: "新店", lat: 24.967, lng: 121.541 },
  { name: "三重", lat: 25.061, lng: 121.488 },
] as const;

export type TaipeiAreaName = (typeof TAIPEI_AREAS)[number]["name"];
