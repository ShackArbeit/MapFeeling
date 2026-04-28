import type { FoodType } from "@/types/domain";

export const FOOD_TYPES: FoodType[] = [
  "ramen",
  "hotpot",
  "coffee",
  "dessert",
  "izakaya",
  "vegetarian",
  "steak",
  "night_market",
  "brunch",
  "thai",
  "korean",
  "sushi",
];

export const FOOD_TYPE_LABELS: Record<FoodType, string> = {
  ramen: "拉麵",
  hotpot: "火鍋",
  coffee: "咖啡",
  dessert: "甜點",
  izakaya: "居酒屋",
  vegetarian: "蔬食",
  steak: "牛排",
  night_market: "夜市",
  brunch: "早午餐",
  thai: "泰式",
  korean: "韓式",
  sushi: "壽司",
};
