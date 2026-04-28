import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { UserProfile, FoodType } from "../src/types/domain";
import { FOOD_TYPES } from "../src/data/food-types";
import { TAIPEI_AREAS } from "../src/data/taipei-districts";
import { calculateZodiac } from "../src/features/zodiac/zodiac";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Mulberry32: fast, deterministic PRNG
function mulberry32(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rng = mulberry32(42);
const pick = <T>(arr: readonly T[] | T[]): T =>
  arr[Math.floor(rng() * arr.length)];

const ADJECTIVES = [
  "美味", "快樂", "甜蜜", "溫暖", "香辣", "清爽",
  "濃郁", "多彩", "神秘", "浪漫", "活潑", "沉靜",
  "爽朗", "細膩", "獨特", "歡樂", "悠閒", "精緻",
  "自在", "好客",
];

const NOUNS = [
  "貓咪", "咖啡豆", "草莓", "楓糖", "焦糖", "芝麻",
  "柚子", "抹茶", "珍珠", "肉桂", "薰衣草", "薑黃",
  "鳳梨", "荔枝", "芒果", "栗子", "香草", "蜂蜜",
  "巧克力", "薄荷",
];

const BIOS = [
  "喜歡在週末探索台北的小巷，尋找隱藏版美食。",
  "下班後最愛找朋友吃吃喝喝，享受輕鬆的夜晚。",
  "對食物充滿熱情，相信吃飯是認識彼此最好的方式。",
  "熱愛嘗試各種料理，從街頭小吃到精緻餐廳都行。",
  "覺得一起吃飯比任何破冰遊戲都有效。",
  "週末的計畫永遠從「要去哪裡吃？」開始。",
  "相信好食物能帶來好心情，也能帶來好緣分。",
  "尋找一個能陪我吃遍台北的夥伴。",
  "食物是我的語言，每道菜都有故事。",
  "喜歡發現城市裡被遺忘的老店和新興的美食亮點。",
  "每個週末都是一次新的美食冒險。",
  "不管心情好壞，美食總能讓我重新充電。",
];

const VIBE_PROMPTS = [
  "如果你也喜歡在雨天窩在咖啡廳，我們應該很合",
  "想找人一起去試試最近很紅的那家拉麵",
  "週末想去夜市亂逛，你有興趣嗎？",
  "找一個能陪我吃到關店的人",
  "喜歡在用餐時聊天多過滑手機的人",
  "想找人一起探索台北的美食地圖",
  "如果你的冰箱裡永遠有點心，我們一定聊得來",
  "尋找能接受我突然想吃火鍋的夥伴",
  "週末想來個早午餐約會，不限地點",
  "一起去吃那家排了很久的壽司吧",
  "找個能陪我試遍台北居酒屋的人",
  "想找愛吃辣的夥伴一起挑戰泰式料理",
];

const SLOTS = [
  "週一晚上", "週二晚上", "週三晚上", "週四晚上", "週五晚上",
  "週六中午", "週六晚上", "週日中午", "週日晚上",
];

// [startMonth, startDay, rangeLength] per sign (index 0-11 = Capricorn-Sagittarius)
const SIGN_RANGES: [number, number, number][] = [
  [1, 1, 19],   // 0 Capricorn: Jan 1-19
  [1, 20, 30],  // 1 Aquarius: Jan 20 - Feb 18
  [2, 19, 29],  // 2 Pisces: Feb 19 - Mar 19
  [3, 21, 30],  // 3 Aries: Mar 21 - Apr 19
  [4, 20, 31],  // 4 Taurus: Apr 20 - May 20
  [5, 21, 31],  // 5 Gemini: May 21 - Jun 20
  [6, 21, 32],  // 6 Cancer: Jun 21 - Jul 22
  [7, 23, 31],  // 7 Leo: Jul 23 - Aug 22
  [8, 23, 31],  // 8 Virgo: Aug 23 - Sep 22
  [9, 23, 30],  // 9 Libra: Sep 23 - Oct 22
  [10, 23, 30], // 10 Scorpio: Oct 23 - Nov 21
  [11, 22, 30], // 11 Sagittarius: Nov 22 - Dec 21
];

function generateBirthDate(signIndex: number): string {
  const [startMonth, startDay, rangeLen] = SIGN_RANGES[signIndex];
  const year = 1988 + Math.floor(rng() * 14);
  const offset = Math.floor(rng() * rangeLen);
  const date = new Date(year, startMonth - 1, startDay + offset);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function generateFoodPreferences(userIndex: number): FoodType[] {
  const count = 2 + Math.floor(rng() * 3);
  const prefs = new Set<FoodType>();
  prefs.add(FOOD_TYPES[userIndex % FOOD_TYPES.length]);
  while (prefs.size < count) {
    prefs.add(pick(FOOD_TYPES));
  }
  return Array.from(prefs);
}

function generateAvailableSlots(): string[] {
  const count = 2 + Math.floor(rng() * 4);
  const slots = new Set<string>();
  while (slots.size < count) {
    slots.add(pick(SLOTS));
  }
  return Array.from(slots);
}

const users: UserProfile[] = [];

for (let i = 0; i < 240; i++) {
  const id = `user_${String(i + 1).padStart(3, "0")}`;
  const signIndex = i % 12;
  const area = TAIPEI_AREAS[i % TAIPEI_AREAS.length];
  const birthDate = generateBirthDate(signIndex);
  const { zodiacSign, zodiacElement } = calculateZodiac(birthDate);
  const jitter = () => (rng() - 0.5) * 0.01;
  const adjIdx = i % ADJECTIVES.length;

  users.push({
    id,
    nickname: `${ADJECTIVES[adjIdx]}${pick(NOUNS)}`,
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`,
    birthDate,
    zodiacSign,
    zodiacElement,
    bio: BIOS[i % BIOS.length],
    vibePrompt: VIBE_PROMPTS[i % VIBE_PROMPTS.length],
    foodPreferences: generateFoodPreferences(i),
    preferredArea: area.name,
    availableSlots: generateAvailableSlots(),
    lat: area.lat + jitter(),
    lng: area.lng + jitter(),
    locationPrecision: "area",
    safetyNote: "此地點為約會建議區域，非真實住址",
    createdAt: new Date(2026, 0, 1).toISOString(),
  });
}

const outPath = join(__dirname, "../src/data/mock-users.generated.json");
writeFileSync(outPath, JSON.stringify(users, null, 2), "utf-8");
console.log(`Generated ${users.length} mock users → ${outPath}`);
