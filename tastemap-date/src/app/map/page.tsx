"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { FoodType, UserProfile } from "@/types/domain";
import { FoodTagFilter } from "@/components/FoodTagFilter";
import { CandidateCard } from "@/components/CandidateCard";
import { MatchReasonPanel } from "@/components/MatchReasonPanel";
import { clearUserSession } from "@/lib/session";

const TasteMap = dynamic(
  () => import("@/components/TasteMap").then((m) => m.TasteMap),
  { ssr: false }
);

function normalizeAreaName(area: string): string {
  return area.trim().replace(/\u5340$/, "");
}

export default function MapPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [selectedFood, setSelectedFood] = useState<FoodType | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [viewerProfile, setViewerProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("tastemap.viewerProfile");
    if (!stored) return;

    try {
      setViewerProfile(JSON.parse(stored) as UserProfile);
    } catch {
      // Ignore corrupted viewer profile data.
    }
  }, []);

  useEffect(() => {
    function onPopState() {
      clearUserSession();
    }

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  function handleReset() {
    clearUserSession();
    router.push("/");
  }

  useEffect(() => {
    const qs = new URLSearchParams({ limit: "240" });
    if (selectedFood) qs.set("foodType", selectedFood);
    if (viewerProfile?.preferredArea) qs.set("area", viewerProfile.preferredArea);

    setLoading(true);

    fetch(`/api/profiles?${qs}`)
      .then((r) => r.json())
      .then((data: { items: UserProfile[] }) => {
        setUsers(data.items ?? []);
      })
      .catch(() => {
        setUsers([]);
      })
      .finally(() => setLoading(false));
  }, [selectedFood, viewerProfile?.preferredArea]);

  const displayedUsers = useMemo(() => {
    const areaFilteredUsers = viewerProfile?.preferredArea
      ? users.filter(
          (user) =>
            normalizeAreaName(user.preferredArea) ===
            normalizeAreaName(viewerProfile.preferredArea)
        )
      : users;

    return areaFilteredUsers;
  }, [users, viewerProfile]);

  useEffect(() => {
    setSelectedUser((current) =>
      current && displayedUsers.some((user) => user.id === current.id) ? current : null
    );
  }, [displayedUsers]);

  const activeSelectedUser = useMemo(() => {
    if (!selectedUser) return null;
    return displayedUsers.find((user) => user.id === selectedUser.id) ?? null;
  }, [selectedUser, displayedUsers]);

  return (
    <div className="page-shell flex h-screen flex-col overflow-hidden">
      <header className="relative z-[500] flex shrink-0 items-center gap-4 border-b border-white/10 bg-slate-950/72 px-4 py-3 backdrop-blur-xl">
        <span className="shrink-0 font-heading text-2xl text-amber-100">TasteMap</span>
        <div className="flex-1 overflow-x-auto">
          <FoodTagFilter selected={selectedFood} onSelect={setSelectedFood} />
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {viewerProfile && (
            <>
              <img
                src={viewerProfile.avatarUrl}
                alt={viewerProfile.nickname}
                className="h-8 w-8 rounded-full border border-amber-200/40"
              />
              <span className="hidden text-sm font-medium text-stone-200 sm:block">
                {viewerProfile.nickname}
              </span>
            </>
          )}
          <button
            onClick={handleReset}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-stone-400 transition-colors hover:border-white/20 hover:bg-white/10 hover:text-stone-200"
          >
            Reset
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-x-4 top-4 z-[450] flex justify-between">
            <div className="flex gap-2">
              <div className="rounded-full border border-white/10 bg-slate-950/70 px-4 py-2 text-xs uppercase tracking-[0.24em] text-stone-300 backdrop-blur">
                Taipei Taste Atlas
              </div>
              {viewerProfile?.preferredArea && (
                <div className="rounded-full border border-sky-200/20 bg-sky-300/10 px-4 py-2 text-xs text-sky-100 backdrop-blur">
                  區域：{viewerProfile.preferredArea}
                </div>
              )}
            </div>
            <div className="rounded-full border border-amber-200/15 bg-amber-300/10 px-4 py-2 text-xs text-amber-100 backdrop-blur">
              {displayedUsers.length} profiles
            </div>
          </div>
          {loading ? (
            <div className="flex h-full items-center justify-center text-stone-400">
              Loading map...
            </div>
          ) : (
            <Suspense
              fallback={
                <div className="flex h-full items-center justify-center text-stone-400">
                  Preparing map...
                </div>
              }
            >
              <TasteMap
                users={displayedUsers}
                selectedUserId={activeSelectedUser?.id ?? null}
                onSelectUser={setSelectedUser}
              />
            </Suspense>
          )}
        </div>

        {activeSelectedUser && (
          <div className="glass-panel relative z-[500] m-3 ml-0 flex w-80 shrink-0 flex-col overflow-hidden rounded-[1.75rem] border-white/10 bg-slate-950/82">
            <button
              className="shrink-0 self-end px-4 pt-4 text-sm text-stone-400 hover:text-stone-100"
              onClick={() => setSelectedUser(null)}
            >
              Close
            </button>
            <div className="min-h-0 flex-1 overflow-y-auto pb-4">
              <CandidateCard user={activeSelectedUser} viewerProfile={viewerProfile} />
              <MatchReasonPanel user={activeSelectedUser} viewerProfile={viewerProfile} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
