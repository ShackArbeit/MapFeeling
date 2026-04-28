import { OnboardingForm } from "@/components/OnboardingForm";

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-orange-50 py-12 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">建立你的食感檔案</h1>
          <p className="text-gray-600 text-sm">告訴我們你的飲食偏好，開始在地圖上探索吧！</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <OnboardingForm />
        </div>
      </div>
    </div>
  );
}
