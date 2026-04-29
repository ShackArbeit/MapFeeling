import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateInviteAdvice } from "@/lib/ai/generateInviteAdvice";
import type { FoodType } from "@/types/domain";

const bodySchema = z.object({
  viewerId: z.string(),
  candidateId: z.string(),
  sharedFoodTypes: z.array(z.string()),
  matchScore: z.number(),
  viewerVibe: z.string(),
  candidateVibe: z.string(),
});

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const advice = await generateInviteAdvice({
    ...parsed.data,
    sharedFoodTypes: parsed.data.sharedFoodTypes as FoodType[],
  });
  return NextResponse.json(advice);
}