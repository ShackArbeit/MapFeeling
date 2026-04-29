"use client";

import { useState, useEffect, useCallback } from "react";
import { browserLocalDateRequestStore } from "@/features/date-requests/browserLocalDateRequestStore";
import type { DateRequest, DateRequestStatus, UserProfile } from "@/types/domain";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FOOD_TYPE_LABELS } from "@/data/food-types";
import Link from "next/link";
import mockUsersJson from "@/data/mock-users.generated.json";

const ALL_USERS = mockUsersJson as UserProfile[];
const DEMO_RECEIVER_ID = "mock-user-2";

const STATUS_LABELS: Record<DateRequestStatus, string> = {
  pending: "待回應",
  accepted: "已接受",
  rejected: "已拒絕",
};

const STATUS_COLORS: Record<DateRequestStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  accepted: "bg-green-100 text-green-800 border-green-200",
  rejected: "bg-gray-100 text-gray-500 border-gray-200",
};

export default function InboxPage() {
  const [requests, setRequests] = useState<DateRequest[]>([]);
  const [viewerProfile, setViewerProfile] = useState<UserProfile | null>(null);
  const [receiverId, setReceiverId] = useState(DEMO_RECEIVER_ID);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("tastemap.viewerProfile");
    if (stored) {
      try {
        setViewerProfile(JSON.parse(stored) as UserProfile);
      } catch {
        // ignore
      }
    }
  }, []);

  const loadRequests = useCallback(async () => {
    setLoading(true);
    const items = await browserLocalDateRequestStore.listByReceiver(receiverId);
    setRequests(items.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
    setLoading(false);
  }, [receiverId]);

  useEffect(() => {
    void loadRequests();
  }, [loadRequests]);

  async function handleUpdateStatus(id: string, status: DateRequestStatus) {
    await browserLocalDateRequestStore.updateStatus(id, status);
    await loadRequests();
  }

  function getSenderName(senderId: string) {
    const user = ALL_USERS.find((u) => u.id === senderId);
    return user?.nickname ?? senderId;
  }

  const pending = requests.filter((r) => r.status === "pending");
  const others = requests.filter((r) => r.status !== "pending");

  return (
    <div className="min-h-screen bg-orange-50">
      <header className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/map" className="text-orange-500 font-bold text-sm hover:underline">
            ← 回地圖
          </Link>
          <span className="font-bold text-gray-800">邀約收件匣</span>
        </div>
        {viewerProfile && (
          <span className="text-sm text-muted-foreground">{viewerProfile.nickname}</span>
        )}
      </header>

      <div className="max-w-lg mx-auto p-4 space-y-4">
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 text-xs text-amber-700">
          Demo 模式：目前以 <strong>{DEMO_RECEIVER_ID}</strong> 身份查看收件匣。
          你發出的邀約會送到這個帳號。
        </div>

        {loading ? (
          <p className="text-center text-muted-foreground py-8">載入中…</p>
        ) : requests.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-4xl mb-3">📭</p>
            <p>還沒有邀約</p>
            <Link href="/map">
              <Button className="mt-4 bg-orange-500 hover:bg-orange-600 text-white" size="sm">
                去地圖找人邀約
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {pending.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-gray-600 mb-2">
                  待回應 ({pending.length})
                </h2>
                <div className="space-y-3">
                  {pending.map((req) => (
                    <RequestCard
                      key={req.id}
                      request={req}
                      senderName={getSenderName(req.senderId)}
                      onAccept={() => handleUpdateStatus(req.id, "accepted")}
                      onReject={() => handleUpdateStatus(req.id, "rejected")}
                    />
                  ))}
                </div>
              </section>
            )}

            {others.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-gray-600 mb-2 mt-4">
                  歷史紀錄 ({others.length})
                </h2>
                <div className="space-y-3">
                  {others.map((req) => (
                    <RequestCard
                      key={req.id}
                      request={req}
                      senderName={getSenderName(req.senderId)}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function RequestCard({
  request,
  senderName,
  onAccept,
  onReject,
}: {
  request: DateRequest;
  senderName: string;
  onAccept?: () => void;
  onReject?: () => void;
}) {
  return (
    <Card className="bg-white">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm font-semibold">
            來自 {senderName}
          </CardTitle>
          <Badge
            className={`text-xs border ${STATUS_COLORS[request.status]}`}
            variant="outline"
          >
            {STATUS_LABELS[request.status]}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          {new Date(request.createdAt).toLocaleString("zh-TW", {
            month: "numeric",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex gap-4 text-xs text-gray-600">
          <span>🍽 {FOOD_TYPE_LABELS[request.foodType]}</span>
          <span>📍 {request.proposedArea}</span>
          <span>🕐 {request.proposedTime}</span>
        </div>
        {request.message && (
          <p className="text-sm text-gray-700 bg-gray-50 rounded p-2 italic">
            "{request.message}"
          </p>
        )}
        {request.status === "pending" && onAccept && onReject && (
          <div className="flex gap-2 pt-1">
            <Button
              size="sm"
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
              onClick={onAccept}
            >
              接受邀約
            </Button>
            <Button size="sm" variant="outline" className="flex-1" onClick={onReject}>
              婉拒
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}