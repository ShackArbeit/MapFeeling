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
      <Card className="mx-4 mb-4">
        <CardHeader>
          <CardTitle className="text-sm">配對評分</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground text-center py-2">
            請先完成 onboarding 以查看配對分數
          </p>
        </CardContent>
      </Card>
    );
  }

  const { totalScore, foodOverlapScore, zodiacElementScore, locationScore, availabilityScore, vibePromptScore, reasons } = breakdown;

  const scoreColor =
    totalScore >= 80 ? "text-orange-500" : totalScore >= 60 ? "text-yellow-500" : "text-gray-400";

  return (
    <Card className="mx-4 mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">配對評分</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className={`text-4xl font-bold text-center py-1 ${scoreColor}`}>
          {totalScore} 分
        </div>

        <div className="space-y-1.5">
          {[
            { label: "食物", score: foodOverlapScore, reason: reasons[0] },
            { label: "星座", score: zodiacElementScore, reason: reasons[1] },
            { label: "地點", score: locationScore, reason: reasons[2] },
            { label: "時間", score: availabilityScore, reason: reasons[3] },
            { label: "氛圍", score: vibePromptScore, reason: reasons[4] },
          ].map(({ label, score, reason }) => (
            <div key={label}>
              <div className="flex items-center justify-between text-xs mb-0.5">
                <span className="text-muted-foreground w-8">{label}</span>
                <span className="text-gray-600 flex-1 px-2 truncate">{reason}</span>
                <span className="font-medium w-8 text-right">{score}</span>
              </div>
              <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-400 rounded-full transition-all"
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