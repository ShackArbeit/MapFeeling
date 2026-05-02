import Anthropic from "@anthropic-ai/sdk";
import type { FoodType } from "@/types/domain";
import { FOOD_TYPE_LABELS } from "@/data/food-types";

interface AdviceInput {
  viewerId: string;
  candidateId: string;
  sharedFoodTypes: FoodType[];
  matchScore: number;
  viewerVibe: string;
  candidateVibe: string;
}

export interface AdviceOutput {
  reason: string;
  suggestedMessage: string;
  source: "api" | "fallback";
}

function fallback(sharedFoodTypes: FoodType[]): AdviceOutput {
  const foodLabels = sharedFoodTypes.map((f) => FOOD_TYPE_LABELS[f]);
  return {
    reason: `你們都對 ${foodLabels.join("、") || "美食"} 有興趣，互動偏好適合從輕鬆的餐飲邀約開始。`,
    suggestedMessage: `我看到你也喜歡 ${foodLabels[0] ?? "美食"}，要不要找個週末午後一起去試試？`,
    source: "fallback",
  };
}

export async function generateInviteAdvice(input: AdviceInput): Promise<AdviceOutput> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return fallback(input.sharedFoodTypes);

  const foodLabels = input.sharedFoodTypes.map((f) => FOOD_TYPE_LABELS[f]);

  try {
    const client = new Anthropic({ apiKey });
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 256,
      messages: [
        {
          role: "user",
          content: `你是溫暖輕鬆的約會邀約助手。請根據以下資訊，用繁體中文給出低壓力邀約建議。

共同喜愛食物：${foodLabels.join("、") || "美食"}
配對分數：${input.matchScore} 分
我的約會心情：${input.viewerVibe || "無"}
對方的約會心情：${input.candidateVibe || "無"}

回傳純 JSON（不要 markdown code block）：
{"reason":"一句說明為何適合邀約","suggestedMessage":"建議傳給對方的訊息，1-2句，輕鬆友善，不過度甜膩"}`,
        },
      ],
    });

    const text = message.content[0].type === "text" ? message.content[0].text.trim() : "";
    const parsed = JSON.parse(text) as Omit<AdviceOutput, "source">;
    if (parsed.reason && parsed.suggestedMessage) return { ...parsed, source: "api" };
    return fallback(input.sharedFoodTypes);
  } catch {
    return fallback(input.sharedFoodTypes);
  }
}