"use client";

import { useState } from "react";
import type { UserProfile } from "@/types/domain";
import type { AdviceOutput } from "@/lib/ai/generateInviteAdvice";
import { calculateMatchScore } from "@/features/matching/calculateMatchScore";
import { DateRequestDialog } from "@/components/DateRequestDialog";
import { FOOD_TYPE_LABELS } from "@/data/food-types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Props {
  user: UserProfile;
  viewerProfile: UserProfile | null;
}

export function CandidateCard({ user, viewerProfile }: Props) {
  const [advice, setAdvice] = useState<AdviceOutput | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [sentRequestId, setSentRequestId] = useState<string | null>(null);

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
    <Card className="mx-4 mt-4">
      <CardHeader>
        <div className="flex items-center gap-3">
          <img
            src={user.avatarUrl}
            alt={user.nickname}
            className="w-14 h-14 rounded-full border-2 border-orange-200 bg-gray-100"
          />
          <div>
            <CardTitle className="text-base">{user.nickname}</CardTitle>
            <CardDescription>
              {user.preferredArea} · {user.zodiacSign}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-sm text-gray-700">{user.bio}</p>

        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1.5">食物喜好</p>
          <div className="flex flex-wrap gap-1">
            {user.foodPreferences.map((food) => (
              <Badge
                key={food}
                variant="secondary"
                className={`text-xs ${
                  viewerProfile?.foodPreferences.includes(food)
                    ? "bg-orange-100 text-orange-700"
                    : ""
                }`}
              >
                {FOOD_TYPE_LABELS[food]}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1">約會心情</p>
          <p className="text-sm italic text-gray-600">"{user.vibePrompt}"</p>
        </div>

        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1.5">可約時段</p>
          <div className="flex flex-wrap gap-1">
            {user.availableSlots.map((slot) => (
              <Badge key={slot} variant="outline" className="text-xs">
                {slot}
              </Badge>
            ))}
          </div>
        </div>

        <p className="text-xs text-muted-foreground border-t pt-2">{user.safetyNote}</p>

        {advice ? (
          <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 space-y-2">
            <p className="text-xs text-orange-700">{advice.reason}</p>
            <p className="text-sm text-gray-700 italic">"{advice.suggestedMessage}"</p>
          </div>
        ) : null}

        <div className="space-y-2">
          {!advice && (
            <Button
              className="w-full"
              size="sm"
              variant="outline"
              onClick={handleGenerateAdvice}
              disabled={loadingAdvice || !viewerProfile}
            >
              {loadingAdvice ? "生成中…" : "產生邀約建議"}
            </Button>
          )}

          {advice && viewerProfile && !sentRequestId && (
            <DateRequestDialog
              viewer={viewerProfile}
              candidate={user}
              suggestedMessage={advice.suggestedMessage}
              onSent={(req) => setSentRequestId(req.id)}
            />
          )}

          {sentRequestId && (
            <div className="text-center space-y-1">
              <p className="text-sm text-green-600 font-medium">邀約已送出 ✓</p>
              <Link href="/inbox" className="text-xs text-orange-500 hover:underline">
                前往收件匣查看
              </Link>
            </div>
          )}

          {!viewerProfile && (
            <p className="text-xs text-center text-muted-foreground">
              <Link href="/onboarding" className="text-orange-500 hover:underline">
                建立檔案
              </Link>{" "}
              後才能邀約
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}