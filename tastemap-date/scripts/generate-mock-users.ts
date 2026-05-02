// 引入 Node.js 的 fs 模組，用來寫檔案
import { writeFileSync } from "node:fs";

// 引入 path 模組，用來處理檔案路徑
import { join, dirname } from "node:path";

// 將 import.meta.url 轉換成檔案路徑
import { fileURLToPath } from "node:url";

// 引入 TypeScript 型別（只在編譯期使用）
import type { UserProfile, FoodType } from "../src/types/domain";

// 食物類型清單（例如 日式 / 韓式 / 義式）
import { FOOD_TYPES } from "../src/data/food-types";

// 台北行政區資料（含經緯度）
import { TAIPEI_AREAS } from "../src/data/taipei-districts";

// 星座計算函式
import { calculateZodiac } from "../src/features/zodiac/zodiac";

// 取得目前檔案所在資料夾（ESM 版本 __dirname）
const __dirname = dirname(fileURLToPath(import.meta.url));


// ==========================================
// 🔢 Mulberry32 偽隨機數生成器
// ==========================================

// Mulberry32: 快速且可重現的隨機數生成器
function mulberry32(seed: number) {
  let s = seed >>> 0; // 將 seed 轉為 32-bit 無符號整數

  return () => {
    s = (s + 0x6d2b79f5) >>> 0; // 更新內部狀態

    // 利用位運算與乘法製造混亂性（randomness）
    let t = Math.imul(s ^ (s >>> 15), 1 | s);

    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;

    // 回傳 0~1 之間的浮點數
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// 建立隨機數生成器（固定 seed = 42 → 可重現）
const rng = mulberry32(42);

// 從陣列隨機選一個元素
const pick = <T>(arr: readonly T[] | T[]): T =>
  arr[Math.floor(rng() * arr.length)];


// ==========================================
// 📚 資料來源（用來生成 mock user）
// ==========================================

// 形容詞（用來組 nickname）
const ADJECTIVES = [
  "美味", "快樂", "甜蜜", "溫暖", "香辣", "清爽",
  "濃郁", "多彩", "神秘", "浪漫", "活潑", "沉靜",
  "爽朗", "細膩", "獨特", "歡樂", "悠閒", "精緻",
  "自在", "好客",
];

// 名詞（用來組 nickname）
const NOUNS = [
  "貓咪", "咖啡豆", "草莓", "楓糖", "焦糖", "芝麻",
  "柚子", "抹茶", "珍珠", "肉桂", "薰衣草", "薑黃",
  "鳳梨", "荔枝", "芒果", "栗子", "香草", "蜂蜜",
  "巧克力", "薄荷",
];

// 使用者自介
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

// 約會 prompt（類似 Tinder 開場）
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

// 可約時間段
const SLOTS = [
  "週一晚上", "週二晚上", "週三晚上", "週四晚上", "週五晚上",
  "週六中午", "週六晚上", "週日中午", "週日晚上",
];


// ==========================================
// ♈ 星座日期範圍
// ==========================================

// 每個星座的開始時間與範圍
const SIGN_RANGES: [number, number, number][] = [
  [1, 1, 19],   // 摩羯
  [1, 20, 30],  // 水瓶
  [2, 19, 29],  // 雙魚
  [3, 21, 30],  // 牡羊
  [4, 20, 31],  // 金牛
  [5, 21, 31],  // 雙子
  [6, 21, 32],  // 巨蟹
  [7, 23, 31],  // 獅子
  [8, 23, 31],  // 處女
  [9, 23, 30],  // 天秤
  [10, 23, 30], // 天蠍
  [11, 22, 30], // 射手
];


// ==========================================
// 🎂 生成生日（符合星座）
// ==========================================

function generateBirthDate(signIndex: number): string {
  const [startMonth, startDay, rangeLen] = SIGN_RANGES[signIndex];

  const year = 1988 + Math.floor(rng() * 14); // 1988~2001

  const offset = Math.floor(rng() * rangeLen); // 星座內隨機天數

  const date = new Date(year, startMonth - 1, startDay + offset);

  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");

  return `${y}-${m}-${d}`;
}


// ==========================================
// 🍜 食物偏好
// ==========================================

function generateFoodPreferences(userIndex: number): FoodType[] {
  const count = 2 + Math.floor(rng() * 3); // 2~4 種

  const prefs = new Set<FoodType>();

  // 保證分布均勻
  prefs.add(FOOD_TYPES[userIndex % FOOD_TYPES.length]);

  while (prefs.size < count) {
    prefs.add(pick(FOOD_TYPES));
  }

  return Array.from(prefs);
}


// ==========================================
// 📅 可約時間
// ==========================================

function generateAvailableSlots(): string[] {
  const count = 2 + Math.floor(rng() * 4); // 2~5 個時段

  const slots = new Set<string>();

  while (slots.size < count) {
    slots.add(pick(SLOTS));
  }

  return Array.from(slots);
}


// ==========================================
// 👤 主流程：生成使用者
// ==========================================

const users: UserProfile[] = [];

for (let i = 0; i < 240; i++) {

  const id = `user_${String(i + 1).padStart(3, "0")}`;

  const signIndex = i % 12; // 平均分布星座

  const area = TAIPEI_AREAS[i % TAIPEI_AREAS.length];

  const birthDate = generateBirthDate(signIndex);

  const { zodiacSign, zodiacElement } = calculateZodiac(birthDate);

  // 微小偏移（避免所有人座標完全一樣）
  const jitter = () => (rng() - 0.5) * 0.01;

  const adjIdx = i % ADJECTIVES.length;

  users.push({
    id,

    // 例：快樂貓咪
    nickname: `${ADJECTIVES[adjIdx]}${pick(NOUNS)}`,

    // avatar API
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`,

    birthDate,
    zodiacSign,
    zodiacElement,

    bio: BIOS[i % BIOS.length],

    vibePrompt: VIBE_PROMPTS[i % VIBE_PROMPTS.length],

    foodPreferences: generateFoodPreferences(i),

    preferredArea: area.name,

    availableSlots: generateAvailableSlots(),

    // 地圖座標（加 jitter）
    lat: area.lat + jitter(),
    lng: area.lng + jitter(),

    locationPrecision: "area",

    safetyNote: "此地點為約會建議區域，非真實住址",

    createdAt: new Date(2026, 0, 1).toISOString(),
  });
}


// ==========================================
// 💾 輸出 JSON 檔
// ==========================================

const outPath = join(__dirname, "../src/data/mock-users.generated.json");

writeFileSync(
  outPath,
  JSON.stringify(users, null, 2), // 美化 JSON
  "utf-8"
);

console.log(`Generated ${users.length} mock users → ${outPath}`);