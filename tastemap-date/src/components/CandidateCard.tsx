"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { UserProfile } from "@/types/domain";
import type { AdviceOutput } from "@/lib/ai/generateInviteAdvice";
import { calculateMatchScore } from "@/features/matching/calculateMatchScore";
import { FOOD_TYPE_LABELS } from "@/data/food-types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Props {
  user: UserProfile;
  viewerProfile: UserProfile | null;
}

export function CandidateCard({ user, viewerProfile }: Props) {
  const [advice, setAdvice] = useState<AdviceOutput | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const actionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAdvice(null);
    setLoadingAdvice(false);
  }, [user.id]);

  useEffect(() => {
    if (advice) {
      actionRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [advice]);

  async function handleGenerateAdvice() {
    if (!viewerProfile) return;

    setLoadingAdvice(true);

    try {
      const breakdown = calculateMatchScore(viewerProfile, user);
      const sharedFoodTypes = viewerProfile.foodPreferences.filter((food) =>
        user.foodPreferences.includes(food)
      );

      const response = await fetch("/api/match-advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          viewerId: viewerProfile.id,
          candidateId: user.id,
          sharedFoodTypes,
          matchScore: breakdown.totalScore,
          viewerVibe: viewerProfile.vibePrompt,
          candidateVibe: user.vibePrompt,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error ${response.status}`);
      }

      const data = (await response.json()) as AdviceOutput;
      if (data.reason && data.suggestedMessage) {
        setAdvice(data);
      }
    } catch {
      const sharedFoodTypes = viewerProfile.foodPreferences.filter((food) =>
        user.foodPreferences.includes(food)
      );
      const firstSharedFoodLabel = sharedFoodTypes[0]
        ? FOOD_TYPE_LABELS[sharedFoodTypes[0]]
        : "咖啡";

      setAdvice({
        reason: "你們已經有足夠的口味重疊，直接開啟話題會很自然。",
        suggestedMessage: `看起來我們都喜歡${firstSharedFoodLabel}，這週要不要一起去吃？`,
      });
    } finally {
      setLoadingAdvice(false);
    }
  }

  return (
    <Card className="mx-4 mt-4 rounded-[1.5rem] border border-white/10 bg-white/6">
      <CardHeader>
        <div className="flex items-center gap-3">
          <img
            src={user.avatarUrl}
            alt={user.nickname}
            className="h-14 w-14 rounded-full border-2 border-amber-200/30 bg-gray-100"
          />
          <div>
            <CardTitle className="text-lg text-stone-50">{user.nickname}</CardTitle>
            <CardDescription className="text-stone-400">
              {user.preferredArea} · {user.zodiacSign}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-sm text-stone-300">{user.bio || "目前還沒有自我介紹。"}</p>

        <div>
          <p className="mb-1.5 text-xs font-medium text-stone-400">喜歡的食物</p>
          <div className="flex flex-wrap gap-1">
            {user.foodPreferences.map((food) => (
              <Badge
                key={food}
                variant="secondary"
                className={
                  viewerProfile?.foodPreferences.includes(food)
                    ? "border border-amber-200/20 bg-amber-300/12 text-amber-100"
                    : "border border-white/10 bg-white/6 text-stone-300"
                }
              >
                {FOOD_TYPE_LABELS[food]}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-1 text-xs font-medium text-stone-400">約會感覺</p>
          <p className="text-sm italic text-stone-300">&ldquo;{user.vibePrompt}&rdquo;</p>
        </div>

        <div>
          <p className="mb-1.5 text-xs font-medium text-stone-400">方便時段</p>
          <div className="flex flex-wrap gap-1">
            {user.availableSlots.map((slot) => (
              <Badge
                key={slot}
                variant="outline"
                className="border-white/10 bg-black/10 text-xs text-stone-300"
              >
                {slot}
              </Badge>
            ))}
          </div>
        </div>

        <p className="border-t border-white/10 pt-2 text-xs text-stone-400">
          {user.safetyNote || "地圖位置僅顯示區域等級，不會顯示精確地點。"}
        </p>

        <div ref={actionRef} className="space-y-2">
          {advice && (
            <div className="space-y-2 rounded-2xl border border-amber-200/15 bg-amber-300/10 p-3">
              <p className="text-xs text-amber-100">{advice.reason}</p>
              <p className="text-sm italic text-stone-100">&ldquo;{advice.suggestedMessage}&rdquo;</p>
            </div>
          )}

          {viewerProfile ? (
            <>
              {!advice && (
                <Button
                  className="w-full"
                  size="sm"
                  variant="outline"
                  onClick={handleGenerateAdvice}
                  disabled={loadingAdvice}
                >
                  {loadingAdvice ? "產生中..." : "產生邀約建議"}
                </Button>
              )}
            </>
          ) : (
            <p className="rounded-xl border border-white/8 bg-black/15 px-3 py-2.5 text-center text-xs text-stone-400">
              <Link
                href="/onboarding"
                className="font-medium text-amber-200 hover:text-amber-100 hover:underline"
              >
                先完成 onboarding
              </Link>
              {" "}才能看到邀約建議。
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
