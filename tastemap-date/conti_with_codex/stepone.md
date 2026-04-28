# TasteMap Date｜Codex Handoff — Phase 0 完成紀錄

> 此文件由 Claude Code 撰寫，供 Codex 接手繼續開發使用。
> 請從 **Phase 1** 開始執行。

---

## 專案資訊

- **專案名稱：** TasteMap Date｜食感航線
- **根目錄：** `tastemap-date/`
- **Node 版本：** 22
- **Package Manager：** npm
- **框架：** Next.js 16.2.4 (App Router, TypeScript, Tailwind CSS v4)

---

## Phase 0 完成狀態：✅ 全部通過

### 驗證結果

```bash
npm run typecheck   # ✅ 無錯誤
npm run build       # ✅ 建置成功
```

---

## 已完成的所有步驟

### Step 1 — Next.js 專案初始化

```bash
npx create-next-app@latest tastemap-date \
  --typescript --tailwind --eslint --app --src-dir \
  --import-alias "@/*" --yes
```

### Step 2 — 安裝 Runtime 依賴

```bash
npm install zod react-hook-form @hookform/resolvers zustand \
  leaflet react-leaflet @anthropic-ai/sdk firebase-admin \
  lucide-react @radix-ui/react-label @radix-ui/react-slot
```

### Step 3 — 安裝 Dev 依賴

```bash
npm install -D vitest @vitejs/plugin-react jsdom \
  @testing-library/react @testing-library/jest-dom \
  playwright tsx @types/leaflet
```

### Step 4 — shadcn/ui 初始化與組件安裝

```bash
npx shadcn@latest init --yes --defaults
npx shadcn@latest add card badge dialog input select textarea \
  tabs alert separator skeleton sonner checkbox button --yes
```

> ⚠️ 注意：shadcn v4 的 `form` 組件未收錄在 registry，已**手動建立**於 `src/components/ui/form.tsx`

### Step 5 — 目錄結構建立

建立了以下目錄：

```
src/types/
src/data/
src/features/matching/
src/features/zodiac/
src/features/date-requests/
src/lib/ai/
src/components/
src/app/onboarding/
src/app/map/
src/app/inbox/
src/app/api/profiles/
src/app/api/match-advice/
src/app/api/date-requests/
docs/
scripts/
tests/e2e/
public/mock-avatars/
.github/workflows/
conti_with_codex/
```

---

## 新增的檔案

### 核心 TypeScript 型別

**`src/types/domain.ts`**
- `ZodiacElement` — "fire" | "earth" | "air" | "water"
- `FoodType` — 12 種食物類型
- `UserProfile` — 完整用戶資料結構
- `DateRequestStatus` — "pending" | "accepted" | "rejected"
- `DateRequest` — 約會邀請資料結構
- `MatchScoreBreakdown` — 配對分數細項

### 資料常數

**`src/data/food-types.ts`**
- `FOOD_TYPES: FoodType[]` — 12 種食物類型陣列
- `FOOD_TYPE_LABELS: Record<FoodType, string>` — 中文標籤對照

**`src/data/taipei-districts.ts`**
- `TAIPEI_AREAS` — 10 個台北/新北行政區含大略座標（as const）
- `TaipeiAreaName` — 型別別名

### 環境設定

**`src/lib/env.ts`**
- `env` 物件統一讀取所有環境變數
- `storageMode`: "local" | "firestore"

**`.env.example`**
```
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_STORAGE_MODE=local
STORAGE_MODE=local
ANTHROPIC_API_KEY=
GOOGLE_CLOUD_PROJECT=
```

### UI 組件（手動建立）

**`src/components/ui/form.tsx`**
- 完整的 shadcn/ui Form 組件（基於 react-hook-form + Radix UI）
- 包含：`Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormDescription`, `FormMessage`

### 設定檔

**`vitest.config.ts`**
- 測試環境：jsdom
- React 插件
- `@` alias 對應 `./src`

**`Dockerfile`**
- Multi-stage build：base → deps → builder → runner
- Node 22 Alpine
- 非 root 用戶（nextjs）
- PORT 8080，HOSTNAME 0.0.0.0
- `CMD ["node", "server.js"]`

**`.github/workflows/deploy-cloud-run.yml`**
- 觸發：push to main + workflow_dispatch
- 步驟：checkout → setup node → npm ci → generate:mock-users → typecheck → test → build → GCP auth (Workload Identity Federation) → Docker build/push → Cloud Run deploy → show URL
- GitHub Variables 需設定：`GCP_PROJECT_ID`, `GCP_REGION`, `GCP_ARTIFACT_REPOSITORY`, `CLOUD_RUN_SERVICE`, `GCP_WORKLOAD_IDENTITY_PROVIDER`, `GCP_SERVICE_ACCOUNT`

### 文件

**`docs/architecture.md`** — 產品目標、架構圖、前後端說明、GCP 部署策略、安全限制  
**`docs/route-map.md`** — 所有頁面路由與 API 路由說明  
**`docs/data-model.md`** — 所有型別詳細說明與欄位描述  
**`docs/decision-log.md`** — 7 個關鍵架構決策與理由  
**`docs/demo-script.md`** — 3 分鐘面試 Demo 腳本（8 步驟）  
**`README.md`** — 完整取代 create-next-app 預設 README

---

## 修改的檔案

### `next.config.ts`

加入 `output: "standalone"` 以支援 Docker / Cloud Run 部署：

```ts
const nextConfig: NextConfig = {
  output: "standalone",
};
```

### `package.json` — 新增 scripts

```json
"typecheck": "tsc --noEmit",
"generate:mock-users": "tsx scripts/generate-mock-users.ts",
"test": "vitest run",
"test:watch": "vitest",
"e2e": "playwright test"
```

---

## 已安裝套件完整清單

### Dependencies
- `next` 16.2.4
- `react` 19.2.4 / `react-dom` 19.2.4
- `typescript`
- `tailwindcss` v4
- `zod` v4
- `react-hook-form`
- `@hookform/resolvers`
- `zustand`
- `leaflet` + `react-leaflet`
- `@anthropic-ai/sdk`
- `firebase-admin`
- `lucide-react`
- `@radix-ui/react-label` + `@radix-ui/react-slot`
- shadcn/ui 組件（button, card, badge, dialog, input, select, textarea, tabs, alert, separator, skeleton, sonner, checkbox）

### DevDependencies
- `vitest` + `@vitejs/plugin-react`
- `jsdom`
- `@testing-library/react` + `@testing-library/jest-dom`
- `playwright`
- `tsx`
- `@types/leaflet`
- `eslint` + `eslint-config-next`

---

## 尚未實作（Phase 1 開始的工作）

以下為 **Codex 接手後需要實作** 的內容，請參考 `prompt_content/02-phase-1-product-skeleton-mock-data.md`：

### 需建立的檔案

```
scripts/generate-mock-users.ts       ← 生成 240 筆 deterministic mock users
src/data/mock-users.generated.json   ← 由 generate script 產生
src/app/page.tsx                     ← Landing page（取代預設）
src/app/onboarding/page.tsx          ← Onboarding 表單頁
src/app/map/page.tsx                 ← Taste Map 頁（Leaflet dynamic import）
src/app/layout.tsx                   ← 更新（加入 leaflet CSS import）
src/app/api/profiles/route.ts        ← GET /api/profiles（支援 foodType/area/zodiacElement/limit 篩選）
src/components/TasteMap.tsx          ← Leaflet 地圖（"use client"，dynamic import）
src/components/CandidateCard.tsx     ← 候選人資訊卡
src/components/FoodTagFilter.tsx     ← 食物類型篩選器
src/components/OnboardingForm.tsx    ← React Hook Form + Zod 表單
src/components/MatchReasonPanel.tsx  ← 配對理由面板（Phase 1 可為 placeholder）
```

### Mock Data 規格

- **數量：** 240 筆
- **種子：** 固定 seed（deterministic）
- **Avatar：** DiceBear API URL（`https://api.dicebear.com/7.x/avataaars/svg?seed=<id>`）
- **座標：** 從 `TAIPEI_AREAS` 取大略中心點 + 隨機 jitter（約 ±0.005 度）
- **食物偏好：** 每人 2-4 個，分布要平均覆蓋 12 種類型
- **生日：** 要讓 12 星座分布合理

### Landing Page 必要段落

1. Hero（產品定位）
2. Problem（現有問題）
3. How it works（3 步驟）
4. Safety design（安全設計說明）
5. Tech highlights
6. CTA → `/onboarding`

### Onboarding 表單欄位

- `nickname` (string)
- `birthDate` (date)
- `foodPreferences` (FoodType[], 多選 checkbox)
- `preferredArea` (string, select from TAIPEI_AREAS)
- `availableSlots` (string[], 多選)
- `vibePrompt` (string, textarea)

儲存到 `localStorage` key: `tastemap.viewerProfile`，完成後 redirect 到 `/map`

### API `/api/profiles` 規格

```ts
// Query params
foodType?: FoodType
area?: string
zodiacElement?: ZodiacElement
limit?: number  // default 60, max 240

// Response
{
  items: UserProfile[];
  total: number;
}
```

### Acceptance Criteria（Phase 1 完成條件）

```bash
npm run generate:mock-users  # 產生 240 筆用戶
npm run typecheck            # 無錯誤
npm run build                # 建置成功
```

手動驗證：
- `/` 頁面正常載入
- `/onboarding` 表單可填寫並跳轉 `/map`
- `/map` 頁面不因 Leaflet SSR 崩潰
- `/api/profiles` 回傳用戶資料
- 食物篩選功能正常
- 點擊 marker 顯示 CandidateCard

---

## 重要注意事項給 Codex

1. **Leaflet SSR 問題：** `TasteMap.tsx` 必須用 `dynamic()` import 且 `{ ssr: false }`，否則 build 會失敗
2. **Leaflet CSS：** 必須在 `src/app/layout.tsx` 加入 `import "leaflet/dist/leaflet.css"`
3. **Leaflet marker icon：** Next.js 環境下預設 marker PNG 路徑會 broken，建議改用 `L.divIcon` 自訂 avatar marker
4. **tsconfig resolveJsonModule：** 已設定為 `true`，可直接 import JSON 檔案
5. **shadcn form 組件：** 已手動建立於 `src/components/ui/form.tsx`，不需重新安裝
6. **storage mode：** `NEXT_PUBLIC_STORAGE_MODE=local` 為預設，Phase 1 全用 localStorage
7. **配對分數：** Phase 1 的 CandidateCard 可先用 placeholder 分數，真正計算在 Phase 2

---

## Phase 2 預覽（Phase 1 完成後才執行）

詳見 `prompt_content/03-phase-2-matching-ai-request-flow.md`

主要工作：
- `src/features/zodiac/zodiac.ts` + 單元測試
- `src/features/matching/calculateMatchScore.ts` + 單元測試
- `src/lib/ai/generateInviteAdvice.ts`（Anthropic API + fallback）
- `src/app/api/match-advice/route.ts`
- `src/app/api/date-requests/route.ts` + `[id]/route.ts`
- `src/features/date-requests/browserLocalDateRequestStore.ts`
- `src/features/date-requests/firestoreDateRequestStore.server.ts`
- `src/app/inbox/page.tsx`
- `src/components/DateRequestDialog.tsx`

---

*Generated by Claude Code — 2026-04-28*