# TasteMap Date｜Codex Handoff — Phase 1 完成紀錄

> 此文件由 Claude Code 撰寫，供 Codex 接手繼續開發使用。
> 請從 **Phase 2** 開始執行。

---

## 專案資訊

- **專案名稱：** TasteMap Date｜食感航線
- **根目錄：** `tastemap-date/`
- **Node 版本：** 22
- **Package Manager：** npm
- **框架：** Next.js 16.2.4 (App Router, TypeScript, Tailwind CSS v4)

---

## Phase 1 完成狀態：✅ 全部通過

### 驗證結果

```bash
npm run generate:mock-users  # ✅ 240 筆用戶生成（星座各 20 人，12 種食物全覆蓋）
npm run typecheck            # ✅ 無錯誤
npm run build                # ✅ 建置成功
```

---

## 新增的所有檔案

### 核心功能

**`src/features/zodiac/zodiac.ts`**
- `calculateZodiac(birthDate: string): { zodiacSign: string; zodiacElement: ZodiacElement }`
- 純函數，依生日計算星座與元素（火/土/風/水）
- 12 星座邊界正確處理（摩羯座跨年問題以 md 整數比較解決）

**`scripts/generate-mock-users.ts`**
- Mulberry32 固定 seed（42）的 PRNG，確保 deterministic
- 240 筆用戶，星座 `i % 12` 確保各星座恰好 20 人
- 食物偏好：每人 2–4 種，primary = `FOOD_TYPES[i % 12]`（確保 12 種均有覆蓋）
- 區域：`TAIPEI_AREAS[i % 10]`（10 個行政區各 24 人）
- 座標：區域中心點 + `±0.005°` jitter
- Avatar：DiceBear `https://api.dicebear.com/7.x/avataaars/svg?seed=user_XXX`
- 輸出路徑：`src/data/mock-users.generated.json`

**`src/data/mock-users.generated.json`** ← 已生成，已 committed

### API

**`src/app/api/profiles/route.ts`**
- `GET /api/profiles`
- Query params：`foodType`, `area`, `zodiacElement`, `limit`（default 60, max 240）
- 使用 ESM `import` 直接載入 JSON（`resolveJsonModule: true`）
- 無效的 foodType / zodiacElement 會被忽略（不 crash）

### Pages

**`src/app/page.tsx`** ← 取代 create-next-app 預設
- 6 個段落：Hero / Problem / How it works / Safety design / Tech highlights / CTA
- **注意：** 此版本 shadcn/ui 使用 Base UI，Button 不支援 `asChild`
  - 改用 `buttonVariants` + `<Link>` 直接套用樣式
  - `import { buttonVariants } from "@/components/ui/button"`

**`src/app/onboarding/page.tsx`**
- Server Component，render `<OnboardingForm />`
- 背景色：`bg-orange-50`

**`src/app/map/page.tsx`** ← `"use client"`
- 用戶端狀態：`selectedFood`, `selectedUser`, `viewerProfile`, `users`
- `useEffect` 從 `localStorage` 讀取 viewer profile（key: `tastemap.viewerProfile`）
- `useEffect` 依 `selectedFood` 變化重新 fetch `/api/profiles`，同時 clear selectedUser
- Leaflet 以 `dynamic(() => import(...).then(m => m.TasteMap), { ssr: false })` 載入
- Layout：`flex flex-col h-screen` → header + flex row（map + 右側面板）
- 右側面板寬 `w-72`，顯示 `CandidateCard` + `MatchReasonPanel`

### Components

**`src/components/TasteMap.tsx`** ← `"use client"`

```ts
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
```

- Props：`users: UserProfile[]`, `selectedUserId: string | null`, `onSelectUser: (user) => void`
- 自訂 `L.divIcon` 頭像 marker（避免 Next.js 環境下預設 Leaflet marker PNG 路徑 broken）
- 選中 marker 顯示橘色邊框 + 陰影
- `MapContainer center={[25.045, 121.52]} zoom={12} preferCanvas`
- TileLayer：OpenStreetMap

**`src/components/CandidateCard.tsx`**
- 顯示：頭像、暱稱、區域、星座、bio、食物偏好 badges、vibePrompt、可約時段、安全說明
- "產生邀約建議" 按鈕為 placeholder（Phase 2 實作）
- Props：`user: UserProfile`, `viewerProfile: UserProfile | null`

**`src/components/FoodTagFilter.tsx`** ← `"use client"`
- 一列篩選按鈕（全部 + 12 種食物）
- 點選已選的再點一次 → 取消篩選（回到全部）
- Props：`selected: FoodType | null`, `onSelect: (food: FoodType | null) => void`

**`src/components/OnboardingForm.tsx`** ← `"use client"`
- React Hook Form + Zod schema
- 欄位：`nickname`, `birthDate`, `foodPreferences`（checkbox grid）, `preferredArea`（Select）, `availableSlots`（checkbox grid）, `vibePrompt`（textarea）
- Submit：計算 `zodiacSign/zodiacElement`，組成 `UserProfile`，存 `localStorage`，`router.push("/map")`
- **重要：** Select 使用 `value={field.value}` 而非 `defaultValue`（Base UI Select 必須受控）

**`src/components/MatchReasonPanel.tsx`**
- Phase 1 placeholder，固定顯示「85 分」
- Phase 2 啟用真實配對計算

### 修改的檔案

**`src/app/layout.tsx`**
- 加入 `import "leaflet/dist/leaflet.css";`（Leaflet 必須在全域 CSS 中引入）
- 更新 metadata：`title: "TasteMap Date｜食感航線"`

---

## 重要注意事項給 Codex

### 1. Base UI Button — 不支援 `asChild`

此版本 shadcn/ui 使用 `@base-ui/react/button`，**沒有** `asChild` prop。

```tsx
// ❌ 錯誤 — 會有 TypeScript 錯誤
<Button asChild size="lg"><Link href="/map">Go</Link></Button>

// ✅ 正確 — 用 buttonVariants + Link
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

<Link href="/map" className={cn(buttonVariants({ size: "lg" }))}>Go</Link>
```

### 2. Base UI Select — 必須受控

```tsx
// ❌ 會有 warning
<Select defaultValue={field.value}>

// ✅ 正確
<Select value={field.value} onValueChange={field.onChange}>
```

### 3. Leaflet SSR 注意

- `TasteMap.tsx` 已用 `dynamic(() => import(...), { ssr: false })` 載入，勿改動
- `leaflet/dist/leaflet.css` 已在 `layout.tsx` 引入
- Leaflet marker icon 已改用 `L.divIcon`（避免 PNG 路徑 broken）

### 4. JSON mock 資料

- `src/data/mock-users.generated.json` 已 committed，TypeScript import 方式：
  ```ts
  import mockUsersJson from "@/data/mock-users.generated.json";
  const ALL_USERS = mockUsersJson as UserProfile[];
  ```
- `resolveJsonModule: true` 已在 tsconfig 設定

### 5. shadcn form 組件

`src/components/ui/form.tsx` 為手動建立（shadcn v4 registry 未收錄），勿重新安裝。

---

## 尚未實作（Phase 2 開始的工作）

請參考 `prompt_content/03-phase-2-matching-ai-request-flow.md`

### 需建立的檔案

```
src/features/zodiac/zodiac.ts            ← ✅ 已完成（Phase 1）
src/features/matching/calculateMatchScore.ts   ← ⏳ Phase 2
src/features/matching/calculateMatchScore.test.ts
src/features/zodiac/zodiac.test.ts
src/lib/ai/generateInviteAdvice.ts       ← ⏳ Phase 2（Anthropic API + fallback）
src/app/api/match-advice/route.ts        ← ⏳ Phase 2
src/app/api/date-requests/route.ts       ← ⏳ Phase 2
src/app/api/date-requests/[id]/route.ts  ← ⏳ Phase 2
src/features/date-requests/browserLocalDateRequestStore.ts  ← ⏳ Phase 2
src/features/date-requests/firestoreDateRequestStore.server.ts
src/app/inbox/page.tsx                   ← ⏳ Phase 2
src/components/DateRequestDialog.tsx     ← ⏳ Phase 2
```

### Phase 2 主要工作

1. **配對分數計算**（純函數 + 單元測試）
   ```ts
   // src/features/matching/calculateMatchScore.ts
   const totalScore =
     foodOverlapScore * 0.4 +
     zodiacElementScore * 0.2 +
     locationScore * 0.2 +
     availabilityScore * 0.1 +
     vibePromptScore * 0.1;
   ```

2. **zodiac 單元測試**
   - `src/features/zodiac/zodiac.test.ts`
   - 測試 12 星座邊界日期（例：Jan 19 → 摩羯，Jan 20 → 水瓶，Dec 21 → 射手，Dec 22 → 摩羯）

3. **AI 邀約建議**（`src/lib/ai/generateInviteAdvice.ts`）
   - 使用 `@anthropic-ai/sdk` 呼叫 Claude API
   - `ANTHROPIC_API_KEY` 不存在時回傳 deterministic fallback 文字

4. **DateRequest 流程**
   - `DateRequestStore` interface（`create`, `listByReceiver`, `updateStatus`）
   - `browserLocalDateRequestStore.ts`：localStorage 實作
   - `firestoreDateRequestStore.server.ts`：Firestore 實作（server only）
   - 切換由 `env.storageModeServer` 決定

5. **`src/app/inbox/page.tsx`**
   - 顯示收到的邀約清單
   - 可接受或婉拒

6. **`src/components/DateRequestDialog.tsx`**
   - 點擊 CandidateCard「產生邀約建議」後開啟
   - 呼叫 `/api/match-advice` 取得 AI 文字
   - 送出後呼叫 `/api/date-requests`

### Phase 2 Acceptance Criteria

```bash
npm run test      # zodiac + calculateMatchScore 單元測試通過
npm run typecheck # 無錯誤
npm run build     # 建置成功
```

手動驗證：
- CandidateCard 顯示真實配對分數與理由
- 點擊「產生邀約建議」開啟 Dialog，AI 文字或 fallback 均可顯示
- 送出邀約後，Inbox 可看到邀約並接受/婉拒

---

## Phase 3 預覽（Phase 2 完成後才執行）

詳見 `prompt_content/04-phase-3-gcp-cicd-testing-demo.md`

主要工作：
- Playwright e2e 測試（happy path）
- GitHub Actions workflow 驗證
- Cloud Run / Dockerfile 驗證
- README 與 demo-script 最終整理

---

*Generated by Claude Code — 2026-04-28*