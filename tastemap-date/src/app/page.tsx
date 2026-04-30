import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ClearSessionOnMount } from "@/components/ClearSessionOnMount";

const features = [
  {
    title: "以口味當作第一印象",
    desc: "先從宵夜、咖啡、火鍋、甜點偏好切入，比起硬聊自介，匹配理由更自然。",
  },
  {
    title: "地圖式探索",
    desc: "用區域與餐飲類型同時看人，畫面先給氛圍，再給資訊，不再像表格翻資料。",
  },
  {
    title: "邀約話術輔助",
    desc: "依據雙方共同點產生邀請訊息草稿，減少第一句卡住的情況。",
  },
];

const steps = [
  {
    step: "01",
    title: "建立你的味覺檔案",
    desc: "填入暱稱、生日、飲食偏好、常活動區域與想找的約會氛圍。",
  },
  {
    step: "02",
    title: "在地圖上挑人",
    desc: "從口味標籤開始縮小範圍，再看誰跟你在時間、區域與 vibe 上最對。",
  },
  {
    step: "03",
    title: "生成邀請並送出",
    desc: "先看 AI 給的邀約建議，再調整約會時段與地點，最後發出邀請。",
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

export default function Home() {
  return (
    <div className="page-shell min-h-screen">
      <ClearSessionOnMount />
      <section className="relative px-4 pt-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-stone-300 backdrop-blur md:px-6">
          <span className="font-medium uppercase tracking-[0.26em] text-amber-200/80">
            TasteMap Date
          </span>
          <div className="flex items-center gap-3">
            <Link href="/onboarding" className="hover:text-white">
              Onboarding
            </Link>
            <Link href="/map" className="hover:text-white">
              Map
            </Link>
          </div>
        </div>
      </section>

      <section className="relative px-4 pb-16 pt-16">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <Badge className="mb-6 border border-amber-300/20 bg-amber-300/10 px-4 py-1 text-amber-100 hover:bg-amber-300/10">
              用味覺偏好開場的約會地圖
            </Badge>
            <h1 className="max-w-3xl font-heading text-4xl font-semibold leading-[1.08] tracking-tight text-stone-50 sm:text-5xl lg:text-6xl">
              找到一起吃晚餐的人
              <br />
              也找到更自然的第一句
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-stone-300 md:text-lg">
              TasteMap Date 把配對、地圖與邀約訊息整合成一條流暢的探索路徑。先看口味，再看距離與氣質，最後才決定要不要發出邀請。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/onboarding"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-11 rounded-full border border-amber-200/20 bg-amber-300 px-6 text-slate-950 hover:bg-amber-200"
                )}
              >
                建立個人檔案
              </Link>
              <Link
                href="/map"
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "h-11 rounded-full border-white/15 bg-white/5 px-6 text-stone-100 hover:bg-white/10"
                )}
              >
                先看地圖
              </Link>
            </div>
          </div>

          <div className="glass-panel relative overflow-hidden rounded-[2rem] p-6 md:p-8">
            <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-amber-200/70 to-transparent" />
            <div className="grid gap-4 md:grid-cols-2">
              {[
                { label: "Mock profiles", value: "240+" },
                { label: "Match signals", value: "5" },
                { label: "Invite assist", value: "AI" },
                { label: "Visual mood", value: "Map" },
              ].map((item) => (
                <div key={item.label} className="rounded-3xl border border-white/10 bg-black/20 p-5">
                  <p className="text-xs uppercase tracking-[0.22em] text-stone-400">{item.label}</p>
                  <p className="mt-3 font-heading text-4xl text-stone-50">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-3xl border border-amber-200/10 bg-gradient-to-br from-amber-300/18 to-sky-300/10 p-6">
              <p className="text-xs uppercase tracking-[0.22em] text-amber-100/70">Designed flow</p>
              <p className="mt-3 text-sm leading-7 text-stone-200">
                從 landing、onboarding、map 到 inbox，都應該像同一個產品，而不是四個彼此無關的功能頁。
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-amber px-4 py-14">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-10 font-heading text-3xl text-stone-50 md:text-4xl">這個產品在解什麼問題</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {features.map((item) => (
              <Card key={item.title} className="glass-panel rounded-[1.75rem] border-white/10 bg-white/6">
                <CardContent className="pt-6">
                  <h3 className="mb-3 font-heading text-xl text-stone-50 md:text-2xl">{item.title}</h3>
                  <p className="text-sm leading-[1.75] text-stone-300">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section-sky px-4 py-14">
        <div className="glass-panel mx-auto max-w-6xl rounded-[2rem] p-8 md:p-10">
          <h2 className="mb-10 text-center font-heading text-3xl text-stone-50 md:text-4xl">使用流程</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-amber-200/20 bg-amber-300/15 text-sm font-bold text-amber-100">
                  {item.step}
                </div>
                <h3 className="mb-2 font-heading text-xl text-stone-50 md:text-2xl">{item.title}</h3>
                <p className="text-sm leading-[1.75] text-stone-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-violet px-4 py-14">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-center font-heading text-3xl text-stone-50 md:text-4xl">技術與體驗亮點</h2>
          <div className="flex flex-wrap justify-center gap-2">
            {highlights.map((tech) => (
              <Badge key={tech} variant="secondary" className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-sm text-stone-200">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 pt-12">
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-amber-200/15 bg-gradient-to-r from-amber-300/18 via-orange-300/14 to-sky-300/12 px-6 py-14 text-center shadow-2xl shadow-amber-950/20">
          <h2 className="mb-4 font-heading text-3xl text-white md:text-4xl lg:text-5xl">
            先把你的口味放上地圖
          </h2>
          <p className="mb-8 text-stone-200">
            建立個人檔案後，就能直接看見哪些人可能跟你吃得來、聊得來。
          </p>
          <Link
            href="/onboarding"
            className={cn(
              buttonVariants({ size: "lg", variant: "secondary" }),
              "h-11 rounded-full bg-white px-6 text-slate-950 hover:bg-stone-100"
            )}
          >
            立即開始
          </Link>
        </div>
      </section>
    </div>
  );
}
