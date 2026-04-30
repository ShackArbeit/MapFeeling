"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { UserProfile } from "@/types/domain";
import type { AdviceOutput } from "@/lib/ai/generateInviteAdvice";
import { calculateMatchScore } from "@/features/matching/calculateMatchScore";
import { DateRequestDialog } from "@/components/DateRequestDialog";
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
  const [sentRequestId, setSentRequestId] = useState<string | null>(null);
  const actionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAdvice(null);
    setSentRequestId(null);
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
      const sharedFoodTypes = viewerProfile.foodPreferences.filter((f) =>
        user.foodPreferences.includes(f)
      );
      const res = await fetch("/api/match-advice", {
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
      const data = (await res.json()) as AdviceOutput;
      setAdvice(data);
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
        <p className="text-sm text-stone-300">{user.bio || "這位使用者還沒有填寫自我介紹。"}</p>

        <div>
          <p className="mb-1.5 text-xs font-medium text-stone-400">飲食偏好</p>
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
          <p className="mb-1 text-xs font-medium text-stone-400">約會氛圍</p>
          <p className="text-sm italic text-stone-300">&ldquo;{user.vibePrompt}&rdquo;</p>
        </div>

        <div>
          <p className="mb-1.5 text-xs font-medium text-stone-400">可約時間</p>
          <div className="flex flex-wrap gap-1">
            {user.availableSlots.map((slot) => (
              <Badge key={slot} variant="outline" className="border-white/10 bg-black/10 text-xs text-stone-300">
                {slot}
              </Badge>
            ))}
          </div>
        </div>

        <p className="border-t border-white/10 pt-2 text-xs text-stone-400">
          {user.safetyNote || "建議先在公開場合碰面。"}
        </p>

        <div ref={actionRef} className="space-y-2">
          {advice && (
            <div className="rounded-2xl border border-amber-200/15 bg-amber-300/10 p-3 space-y-2">
              <p className="text-xs text-amber-100">{advice.reason}</p>
              <p className="text-sm italic text-stone-100">&ldquo;{advice.suggestedMessage}&rdquo;</p>
            </div>
          )}

          {viewerProfile ? (
            <>
              {!advice && !sentRequestId && (
                <Button
                  className="w-full"
                  size="sm"
                  variant="outline"
                  onClick={handleGenerateAdvice}
                  disabled={loadingAdvice}
                >
                  {loadingAdvice ? "生成中..." : "產生邀約建議"}
                </Button>
              )}

              {advice && !sentRequestId && (
                <DateRequestDialog
                  viewer={viewerProfile}
                  candidate={user}
                  suggestedMessage={advice.suggestedMessage}
                  onSent={(req) => setSentRequestId(req.id)}
                />
              )}

              {sentRequestId && (
                <div className="space-y-1 text-center">
                  <p className="text-sm font-medium text-emerald-300">邀請已送出</p>
                  <Link href="/inbox" className="text-xs text-amber-200 hover:underline">
                    前往收件匣查看
                  </Link>
                </div>
              )}
            </>
          ) : (
            <p className="rounded-xl border border-white/8 bg-black/15 px-3 py-2.5 text-center text-xs text-stone-400">
              <Link href="/onboarding" className="font-medium text-amber-200 hover:text-amber-100 hover:underline">
                先建立個人檔案
              </Link>
              ，才能產生邀約與發送請求。
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
