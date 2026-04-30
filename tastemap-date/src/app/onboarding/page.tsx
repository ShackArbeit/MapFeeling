import { OnboardingForm } from "@/components/OnboardingForm";

export default function OnboardingPage() {
  return (
    <div className="page-shell min-h-screen px-4 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.28em] text-amber-200/70">Profile Setup</p>
          <h1 className="mb-3 font-heading text-[2rem] leading-tight text-stone-50 sm:text-4xl md:text-5xl">建立你的味覺名片</h1>
          <p className="mx-auto max-w-2xl text-sm leading-[1.8] text-stone-300">
            用幾個關鍵欄位把你的飲食偏好、活動區域與約會氛圍整理出來，後續的配對與邀約就會更準確。
          </p>
        </div>
        <div className="glass-panel mx-auto max-w-3xl rounded-[2rem] p-6 md:p-8">
          <OnboardingForm />
        </div>
      </div>
    </div>
  );
}
