import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-b from-orange-50 to-white py-24 px-4 text-center">
        <Badge className="mb-4 bg-orange-100 text-orange-700 hover:bg-orange-100 border-0">
          TasteMap Date｜食感航線
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight mb-4 leading-snug">
          不要先想怎麼聊天
          <br />
          先從一起吃什麼開始
        </h1>
        <p className="text-lg text-gray-600 max-w-md mx-auto mb-8">
          以食物偏好為起點，透過互動地圖探索有相似口味的人，AI
          協助你發出低壓力的邀約。
        </p>
        <Link
          href="/onboarding"
          className={cn(buttonVariants({ size: "lg" }), "bg-orange-500 hover:bg-orange-600 text-white")}
        >
          建立我的食感檔案
        </Link>
      </section>

      {/* Problem */}
      <section className="py-16 px-4 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-10">傳統配對的壓力</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { title: "滑卡配對", desc: "只看照片做判斷，第一印象壓力大" },
            { title: "開場白恐慌", desc: "不知道說什麼，對話很快就冷掉" },
            { title: "見面前焦慮", desc: "約在哪裡？吃什麼？全都要猜" },
          ].map((item) => (
            <Card key={item.title} className="border-gray-100">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 bg-orange-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">
            三步驟開始食感約會
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "填寫食感檔案",
                desc: "選擇你喜歡的食物類型、偏好的約會區域、可約時段，以及一句心情描述。",
              },
              {
                step: "02",
                title: "探索食感地圖",
                desc: "在互動地圖上看到附近有相似喜好的人，點擊 Marker 查看詳細配對資訊。",
              },
              {
                step: "03",
                title: "AI 協助邀約",
                desc: "選中對象後，讓 Claude AI 幫你生成一句自然、不尷尬的邀約開場白。",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-4 text-sm">
                  {item.step}
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety design */}
      <section className="py-16 px-4 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-10">安全設計</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            {
              title: "只顯示約會區域",
              desc: "地圖上的位置為建議約會區域（行政區），非實際住址，保護個人隱私。",
            },
            {
              title: "低壓力互動",
              desc: "AI 邀約建議讓你不必想破頭，減少開口的心理負擔。",
            },
            {
              title: "主動選擇",
              desc: "收到邀約後可以接受或婉拒，主導權永遠在自己。",
            },
            {
              title: "Demo 模式",
              desc: "所有用戶資料為 deterministic mock 數據，不涉及真實個人資訊。",
            },
          ].map((item) => (
            <Card key={item.title} className="border-green-100 bg-green-50/50">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2 text-green-800">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Tech highlights */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">技術亮點</h2>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              "Next.js 16 App Router",
              "TypeScript + Zod v4",
              "Leaflet 互動地圖",
              "Anthropic Claude AI",
              "shadcn/ui + Tailwind v4",
              "React Hook Form",
              "240 筆 deterministic mock 用戶",
              "Google Cloud Run",
              "GitHub Actions CI/CD",
              "Workload Identity Federation",
            ].map((tech) => (
              <Badge key={tech} variant="secondary" className="text-sm">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center bg-orange-500">
        <h2 className="text-3xl font-bold text-white mb-4">
          準備好開始了嗎？
        </h2>
        <p className="text-orange-100 mb-8">
          建立你的食感檔案，探索台北的美食約會地圖。
        </p>
        <Link
          href="/onboarding"
          className={cn(buttonVariants({ size: "lg", variant: "secondary" }))}
        >
          立即開始
        </Link>
      </section>
    </div>
  );
}