"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import mockUsersJson from "@/data/mock-users.generated.json";
import { FOOD_TYPE_LABELS } from "@/data/food-types";
import { browserLocalDateRequestStore } from "@/features/date-requests/browserLocalDateRequestStore";
import type { DateRequest, DateRequestStatus, UserProfile } from "@/types/domain";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ALL_USERS = mockUsersJson as UserProfile[];
const DEMO_RECEIVER_ID = "mock-user-2";

const STATUS_LABELS: Record<DateRequestStatus, string> = {
  pending: "待回覆",
  accepted: "已接受",
  rejected: "已婉拒",
};

const STATUS_COLORS: Record<DateRequestStatus, string> = {
  pending: "bg-yellow-300/12 text-yellow-100 border-yellow-200/20",
  accepted: "bg-emerald-300/12 text-emerald-100 border-emerald-200/20",
  rejected: "bg-white/8 text-stone-300 border-white/10",
};

export default function InboxPage() {
  const [requests, setRequests] = useState<DateRequest[]>([]);
  const [viewerProfile] = useState<UserProfile | null>(() => {
    if (typeof window === "undefined") return null;
    const stored = window.localStorage.getItem("tastemap.viewerProfile");
    if (!stored) return null;
    try {
      return JSON.parse(stored) as UserProfile;
    } catch {
      return null;
    }
  });
  const [receiverId] = useState(DEMO_RECEIVER_ID);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    browserLocalDateRequestStore
      .listByReceiver(receiverId)
      .then((items) => {
        if (!active) return;
        setRequests(items.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [receiverId]);

  async function handleUpdateStatus(id: string, status: DateRequestStatus) {
    await browserLocalDateRequestStore.updateStatus(id, status);
    const items = await browserLocalDateRequestStore.listByReceiver(receiverId);
    setRequests(items.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
  }

  function getSenderName(senderId: string) {
    const user = ALL_USERS.find((u) => u.id === senderId);
    return user?.nickname ?? senderId;
  }

  const pending = requests.filter((r) => r.status === "pending");
  const others = requests.filter((r) => r.status !== "pending");

  return (
    <div className="page-shell min-h-screen">
      <header className="flex items-center justify-between border-b border-white/10 bg-slate-950/70 px-4 py-4 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <Link href="/map" className="text-sm font-medium text-amber-200 hover:text-amber-100">
            Back to map
          </Link>
          <span className="font-heading text-2xl text-stone-50">邀請收件匣</span>
        </div>
        {viewerProfile && <span className="text-sm text-stone-300">{viewerProfile.nickname}</span>}
      </header>

      <div className="mx-auto max-w-3xl space-y-4 p-4 md:p-8">
        <div className="rounded-2xl border border-amber-200/15 bg-amber-300/10 px-4 py-3 text-xs leading-6 text-amber-100/90 backdrop-blur">
          目前這一頁使用 demo 收件人 <strong>{DEMO_RECEIVER_ID}</strong> 來展示收到邀請、接受與婉拒的流程。
        </div>

        {loading ? (
          <p className="py-8 text-center text-stone-400">Loading requests...</p>
        ) : requests.length === 0 ? (
          <div className="glass-panel rounded-[2rem] py-12 text-center text-stone-300">
            <p className="mb-3 text-4xl">⌁</p>
            <p>目前還沒有任何邀請</p>
            <Link href="/map">
              <Button className="mt-4 bg-amber-300 text-slate-950 hover:bg-amber-200" size="sm">
                去地圖上找人
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {pending.length > 0 && (
              <section>
                <h2 className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-stone-400">
                  待處理 ({pending.length})
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
                <h2 className="mt-4 mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-stone-400">
                  已處理 ({others.length})
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
    <Card className="glass-panel rounded-[1.5rem] border-white/10 bg-white/6">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base text-stone-50">來自 {senderName} 的邀請</CardTitle>
          <Badge className={`border text-xs ${STATUS_COLORS[request.status]}`} variant="outline">
            {STATUS_LABELS[request.status]}
          </Badge>
        </div>
        <p className="text-xs text-stone-400">
          {new Date(request.createdAt).toLocaleString("zh-TW", {
            month: "numeric",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex gap-4 text-xs text-stone-300">
          <span>{FOOD_TYPE_LABELS[request.foodType]}</span>
          <span>{request.proposedArea}</span>
          <span>{request.proposedTime}</span>
        </div>
        {request.message && (
          <p className="rounded-xl border border-white/8 bg-black/20 p-3 text-sm italic text-stone-200">
            &ldquo;{request.message}&rdquo;
          </p>
        )}
        {request.status === "pending" && onAccept && onReject && (
          <div className="flex gap-2 pt-1">
            <Button
              size="sm"
              className="flex-1 bg-amber-300 text-slate-950 hover:bg-amber-200"
              onClick={onAccept}
            >
              接受
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
