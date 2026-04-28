"use client";

import dynamic from "next/dynamic";
import { Suspense, useState, useEffect } from "react";
import type { UserProfile, FoodType } from "@/types/domain";
import { FoodTagFilter } from "@/components/FoodTagFilter";
import { CandidateCard } from "@/components/CandidateCard";
import { MatchReasonPanel } from "@/components/MatchReasonPanel";

const TasteMap = dynamic(
  () => import("@/components/TasteMap").then((m) => m.TasteMap),
  { ssr: false }
);

export default function MapPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [selectedFood, setSelectedFood] = useState<FoodType | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [viewerProfile, setViewerProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("tastemap.viewerProfile");
    if (stored) {
      try {
        setViewerProfile(JSON.parse(stored) as UserProfile);
      } catch {
        // ignore invalid stored data
      }
    }
  }, []);

  useEffect(() => {
    setSelectedUser(null);
    setLoading(true);

    const qs = new URLSearchParams({ limit: "120" });
    if (selectedFood) qs.set("foodType", selectedFood);

    fetch(`/api/profiles?${qs}`)
      .then((r) => r.json())
      .then((data: { items: UserProfile[] }) => {
        setUsers(data.items ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [selectedFood]);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <header className="bg-white border-b px-4 py-2 flex items-center gap-4 shrink-0">
        <span className="font-bold text-orange-500 shrink-0">食感航線</span>
        <div className="flex-1 overflow-x-auto">
          <FoodTagFilter selected={selectedFood} onSelect={setSelectedFood} />
        </div>
        {viewerProfile && (
          <div className="flex items-center gap-2 shrink-0">
            <img
              src={viewerProfile.avatarUrl}
              alt={viewerProfile.nickname}
              className="w-7 h-7 rounded-full border border-orange-200"
            />
            <span className="text-sm font-medium hidden sm:block">
              {viewerProfile.nickname}
            </span>
          </div>
        )}
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 relative">
          {loading ? (
            <div className="flex h-full items-center justify-center text-gray-400">
              載入中…
            </div>
          ) : (
            <Suspense
              fallback={
                <div className="flex h-full items-center justify-center text-gray-400">
                  地圖載入中…
                </div>
              }
            >
              <TasteMap
                users={users}
                selectedUserId={selectedUser?.id ?? null}
                onSelectUser={setSelectedUser}
              />
            </Suspense>
          )}
        </div>

        {selectedUser && (
          <div className="w-72 flex flex-col border-l bg-white overflow-y-auto shrink-0">
            <button
              className="self-end text-gray-400 hover:text-gray-600 px-4 pt-3 text-sm"
              onClick={() => setSelectedUser(null)}
            >
              ✕ 關閉
            </button>
            <CandidateCard user={selectedUser} viewerProfile={viewerProfile} />
            <MatchReasonPanel user={selectedUser} viewerProfile={viewerProfile} />
          </div>
        )}
      </div>
    </div>
  );
}