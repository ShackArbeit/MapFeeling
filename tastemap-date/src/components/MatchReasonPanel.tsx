"use client";

import { useMemo } from "react";
import type { UserProfile } from "@/types/domain";
import { calculateMatchScore } from "@/features/matching/calculateMatchScore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  user: UserProfile;
  viewerProfile: UserProfile | null;
}

export function MatchReasonPanel({ user, viewerProfile }: Props) {
  const breakdown = useMemo(() => {
    if (!viewerProfile) return null;
    return calculateMatchScore(viewerProfile, user);
  }, [viewerProfile, user]);

  if (!breakdown) {
    return (
      <Card className="mx-4 mb-4 rounded-[1.5rem] border border-white/10 bg-white/6">
        <CardHeader>
          <CardTitle className="text-sm text-stone-100">配對解析</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="py-2 text-center text-xs text-stone-400">
            先完成 onboarding，才能看到這個人的匹配分數。
          </p>
        </CardContent>
      </Card>
    );
  }

  const {
    totalScore,
    foodOverlapScore,
    zodiacElementScore,
    locationScore,
    availabilityScore,
    vibePromptScore,
    reasons,
  } = breakdown;

  const scoreColor =
    totalScore >= 80 ? "text-amber-300" : totalScore >= 60 ? "text-yellow-300" : "text-stone-300";

  return (
    <Card className="mx-4 mb-4 rounded-[1.5rem] border border-white/10 bg-white/6">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-stone-100">配對解析</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className={`py-1 text-center text-4xl font-bold ${scoreColor}`}>
          {totalScore} 分
        </div>

        <div className="space-y-1.5">
          {[
            { label: "口味", score: foodOverlapScore, reason: reasons[0] },
            { label: "星象", score: zodiacElementScore, reason: reasons[1] },
            { label: "區域", score: locationScore, reason: reasons[2] },
            { label: "時段", score: availabilityScore, reason: reasons[3] },
            { label: "氛圍", score: vibePromptScore, reason: reasons[4] },
          ].map(({ label, score, reason }) => (
            <div key={label}>
              <div className="mb-0.5 flex items-center justify-between text-xs">
                <span className="w-8 text-stone-400">{label}</span>
                <span className="flex-1 truncate px-2 text-stone-300">{reason}</span>
                <span className="w-8 text-right font-medium text-stone-100">{score}</span>
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-300 to-orange-400 transition-all"
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
