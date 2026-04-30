"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ClearSessionOnMount } from "@/components/ClearSessionOnMount";

const features = [
  {
    title: "用口味當作認識的開場",
    desc: "比起制式自介，先從晚餐、甜點、咖啡與宵夜偏好切入，配對動機會更自然，也更容易延伸成對話。",
  },
  {
    title: "在地圖上看見彼此",
    desc: "把區域、飲食類型與個人 vibe 放進同一個探索畫面，讓你更快判斷誰值得進一步認識。",
  },
  {
    title: "邀請訊息更容易說出口",
    desc: "根據共同點產生邀約建議，先有一個好的開頭，再決定你想用什麼語氣發出邀請。",
  },
];

const steps = [
  {
    step: "01",
    title: "建立你的味覺檔案",
    desc: "填入基本資料、常活動區域、飲食偏好與你想遇到的相處氛圍。",
  },
  {
    step: "02",
    title: "從地圖挑選對象",
    desc: "先用食物標籤縮小範圍，再看區域、時段與 vibe 是否真的合拍。",
  },
  {
    step: "03",
    title: "生成邀約並送出",
    desc: "先看 AI 建議，再微調碰面地點與時間，最後把邀請傳出去。",
  },
];

const highlights = [
  "Next.js 16 App Router",
  "TypeScript + Zod",
  "Leaflet map browsing",
  "AI invite assistance",
  "shadcn/ui + Tailwind",
  "Mock profile dataset",
];

function ParallaxPanel({
  children,
  className,
  direction = "up",
  strength = 44,
}: {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "down";
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let frame = 0;

    const updatePosition = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const elementCenter = rect.top + rect.height / 2;
      const distance = (elementCenter - viewportCenter) / window.innerHeight;
      const clamped = Math.max(-1, Math.min(1, distance));
      const factor = direction === "up" ? -1 : 1;
      const offset = clamped * strength * factor;
      element.style.transform = `translate3d(0, ${offset}px, 0)`;
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updatePosition);
    };

    updatePosition();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [direction, strength]);

  return (
    <div
      ref={ref}
      className={cn("will-change-transform transition-transform duration-300 ease-out", className)}
    >
      {children}
    </div>
  );
}

export default function Home() {
  return (
    <div className="page-shell min-h-screen">
      <ClearSessionOnMount />

      <section className="relative px-4 pt-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-white/10 bg-white/5 px-5 py-4 text-xl text-stone-300 backdrop-blur md:px-8">
          <span className="text-xl font-semibold uppercase tracking-[0.26em] text-amber-200/80">
            TasteMap Date
          </span>
          <div className="flex items-center gap-6 text-xl">
            <Link href="/onboarding" className="hover:text-white">
              Onboarding
            </Link>
            <Link href="/map" className="hover:text-white">
              Map
            </Link>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden px-4 pb-18 pt-16">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <ParallaxPanel direction="up" strength={28}>
            <div>
              <Badge className="mb-6 cursor-default border border-amber-300/20 bg-amber-300/10 px-4 py-1.5 text-sm text-amber-100 transition-all duration-300 hover:scale-105 hover:border-amber-300/50 hover:bg-gradient-to-r hover:from-amber-400/25 hover:to-orange-300/15 hover:text-amber-50 hover:shadow-[0_0_16px_rgba(251,191,36,0.25)]">
                以味覺偏好開始一段關係
              </Badge>
              <h1 className="max-w-3xl cursor-default font-heading text-5xl font-semibold leading-[1.06] tracking-tight text-stone-50 transition-all duration-300 hover:scale-[1.015] hover:bg-gradient-to-r hover:from-amber-100 hover:to-orange-200 hover:bg-clip-text hover:text-transparent sm:text-6xl lg:text-7xl">
                找到一起吃晚餐的人
                <br />
                也找到更自然的開場方式
              </h1>
              <p className="mt-6 max-w-2xl cursor-default text-lg leading-8 text-stone-300 transition-all duration-300 hover:scale-[1.01] hover:text-stone-100 md:text-xl">
                TasteMap Date 把配對、地圖探索與邀約訊息整理成一條更流暢的路徑。先看口味，再看距離與氛圍，最後才決定要不要發出邀請。
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/onboarding"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "h-12 rounded-full border border-amber-200/20 bg-amber-300 px-7 text-base text-slate-950 transition-all duration-300 hover:scale-105 hover:bg-gradient-to-r hover:from-amber-200 hover:to-orange-300 hover:shadow-[0_0_24px_rgba(251,191,36,0.45)]"
                  )}
                >
                  建立個人檔案
                </Link>
                <Link
                  href="/map"
                  className={cn(
                    buttonVariants({ size: "lg", variant: "outline" }),
                    "h-12 rounded-full border-white/15 bg-white/5 px-7 text-base text-stone-100 transition-all duration-300 hover:scale-105 hover:border-sky-300/35 hover:bg-gradient-to-r hover:from-white/10 hover:to-sky-300/15 hover:text-white hover:shadow-[0_0_20px_rgba(125,211,252,0.25)]"
                  )}
                >
                  直接看地圖
                </Link>
              </div>
            </div>
          </ParallaxPanel>

          <ParallaxPanel direction="down" strength={40}>
            <div className="glass-panel relative overflow-hidden rounded-[2rem] p-4 md:p-5">
              <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-amber-200/70 to-transparent" />
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  { label: "Mock profiles", value: "240+" },
                  { label: "Match signals", value: "5" },
                  { label: "Invite assist", value: "AI" },
                  { label: "Visual mood", value: "Map" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="group rounded-2xl border border-white/10 bg-black/20 p-3 transition-all duration-300 hover:scale-[1.05] hover:border-amber-200/35 hover:bg-gradient-to-br hover:from-amber-300/20 hover:to-sky-300/10 hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)]"
                  >
                    <p className="text-xs uppercase tracking-[0.22em] text-stone-400 transition-colors duration-300 group-hover:text-amber-200/80">
                      {item.label}
                    </p>
                    <p className="mt-1.5 font-heading text-3xl text-stone-50 transition-colors duration-300 group-hover:text-amber-100">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="group mt-4 rounded-2xl border border-amber-200/10 bg-gradient-to-br from-amber-300/18 to-sky-300/10 p-4 transition-all duration-300 hover:scale-[1.03] hover:border-amber-200/30 hover:from-amber-300/30 hover:to-sky-300/20 hover:shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
                <p className="text-xs uppercase tracking-[0.22em] text-amber-100/70 transition-colors duration-300 group-hover:text-amber-200">
                  Designed flow
                </p>
                <p className="mt-2 text-sm leading-7 text-stone-200 transition-colors duration-300 group-hover:text-stone-50">
                  從首頁、onboarding、map 到 inbox，都維持同一套深色層次與玻璃材質感，使用體驗不再像被拆散的功能頁。
                </p>
              </div>
            </div>
          </ParallaxPanel>
        </div>
      </section>

      <section className="section-amber px-4 py-14">
        <ParallaxPanel className="mx-auto max-w-6xl" direction="down" strength={32}>
          <h2 className="mb-10 font-heading text-4xl text-stone-50 md:text-5xl">
            這個產品在解決什麼問題
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {features.map((item, index) => (
              <ParallaxPanel
                key={item.title}
                direction={index % 2 === 0 ? "up" : "down"}
                strength={22 + index * 6}
              >
                <Card className="glass-panel rounded-[1.75rem] border-white/10 bg-white/6 transition-all duration-300 hover:-translate-y-3 hover:scale-[1.01] hover:border-amber-200/25 hover:bg-white/[0.08] hover:shadow-[0_28px_60px_rgba(0,0,0,0.28)]">
                  <CardContent className="pt-6">
                    <h3 className="mb-3 font-heading text-2xl text-stone-50 md:text-3xl">
                      {item.title}
                    </h3>
                    <p className="text-base leading-8 text-stone-300">{item.desc}</p>
                  </CardContent>
                </Card>
              </ParallaxPanel>
            ))}
          </div>
        </ParallaxPanel>
      </section>

      <section className="section-sky px-4 py-14">
        <ParallaxPanel direction="up" strength={34}>
          <div className="glass-panel mx-auto max-w-6xl rounded-[2rem] p-8 md:p-10">
            <h2 className="mb-10 text-center font-heading text-4xl text-stone-50 md:text-5xl">
              使用流程
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              {steps.map((item, index) => (
                <ParallaxPanel
                  key={item.step}
                  direction={index % 2 === 0 ? "down" : "up"}
                  strength={20 + index * 5}
                >
                  <div className="rounded-[1.75rem] border border-white/8 bg-white/[0.03] px-5 py-6 text-center transition-all duration-300 hover:-translate-y-3 hover:scale-[1.01] hover:border-sky-200/20 hover:bg-white/[0.06] hover:shadow-[0_28px_60px_rgba(0,0,0,0.24)]">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-amber-200/20 bg-amber-300/15 text-base font-bold text-amber-100">
                      {item.step}
                    </div>
                    <h3 className="mb-2 font-heading text-2xl text-stone-50 md:text-3xl">
                      {item.title}
                    </h3>
                    <p className="text-base leading-8 text-stone-300">{item.desc}</p>
                  </div>
                </ParallaxPanel>
              ))}
            </div>
          </div>
        </ParallaxPanel>
      </section>

      <section className="section-violet px-4 py-14">
        <ParallaxPanel className="mx-auto max-w-4xl" direction="down" strength={30}>
          <h2 className="mb-8 text-center font-heading text-4xl text-stone-50 md:text-5xl">
            技術與體驗亮點
          </h2>
          <div className="flex flex-wrap justify-center gap-2">
            {highlights.map((tech, index) => (
              <ParallaxPanel
                key={tech}
                direction={index % 2 === 0 ? "up" : "down"}
                strength={14}
              >
                <Badge
                  variant="secondary"
                  className={cn(
                    "rounded-full border border-white/10 bg-white/6 px-4 py-1.5 text-base text-stone-200 transition-all duration-300 hover:border-violet-200/25 hover:bg-white/[0.09] hover:text-white",
                    index % 2 === 0
                      ? "hover:-translate-x-3"
                      : "hover:translate-x-3"
                  )}
                >
                  {tech}
                </Badge>
              </ParallaxPanel>
            ))}
          </div>
        </ParallaxPanel>
      </section>

      <section className="px-4 pb-20 pt-12">
        <ParallaxPanel direction="up" strength={36}>
          <div className="mx-auto max-w-5xl rounded-[2rem] border border-amber-200/15 bg-gradient-to-r from-amber-300/18 via-orange-300/14 to-sky-300/12 px-6 py-14 text-center shadow-2xl shadow-amber-950/20 transition-all duration-300 hover:-translate-y-3 hover:scale-[1.01] hover:border-amber-100/30 hover:shadow-[0_34px_80px_rgba(120,53,15,0.28)]">
            <h2 className="mb-4 font-heading text-4xl text-white md:text-5xl lg:text-6xl">
              把你的口味放上地圖
            </h2>
            <p className="mb-8 text-lg leading-8 text-stone-200">
              建立個人檔案後，就能直接看見哪些人可能跟你吃得來、聊得來。
            </p>
            <Link
              href="/onboarding"
              className={cn(
                buttonVariants({ size: "lg", variant: "secondary" }),
                "h-12 rounded-full bg-white px-7 text-base text-slate-950 transition-all duration-300 hover:scale-105 hover:bg-gradient-to-r hover:from-amber-200 hover:to-orange-200 hover:shadow-[0_0_24px_rgba(251,191,36,0.45)]"
              )}
            >
              立即開始
            </Link>
          </div>
        </ParallaxPanel>
      </section>
    </div>
  );
}
