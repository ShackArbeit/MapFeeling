# Phase 2 & Phase 3 完成紀錄｜給 Codex 的接手文件

> 本文件記錄 Phase 2（Matching + AI Advice + Date Request Flow）與
> Phase 3（GCP Deploy + CI/CD + Testing + Demo Polish）的所有實作細節，
> 供後續編輯繼續使用。

---

## 專案位置

```
C:\Users\user\Desktop\FeelMap\tastemap-date\
```

---

## 目前狀態：Phase 1 ✅ Phase 2 ✅ Phase 3 ✅

所有程式碼已通過：
- `npm run test` — 22 tests pass（4 test files）
- `npm run typecheck` — 0 errors
- `npm run build` — Next.js 16 production build 成功

---

## Phase 2 新建的所有檔案

### 1. `src/features/zodiac/zodiac.test.ts`
測試 `calculateZodiac()` 純函數，包含 5 個測試案例：
- 1997-08-08 → 獅子座 / fire
- 1995-01-20 → 水瓶座 / air
- 1993-12-22 → 摩羯座 / earth
- 2000-01-01 → 摩羯座 / earth
- 2000-03-21 → 牡羊座 / fire

---

### 2. `src/features/matching/calculateMatchScore.ts`
配對評分純函數。

**函數簽名：**
```ts
export function calculateMatchScore(viewer: UserProfile, candidate: UserProfile): MatchScoreBreakdown
```

**評分權重：**
```ts
totalScore = foodOverlapScore * 0.4 + zodiacElementScore * 0.2 + locationScore * 0.2 + availabilityScore * 0.1 + vibePromptScore * 0.1
```

**各維度規則：**
| 維度 | 規則 |
|---|---|
| 食物重疊 | 0項→0, 1項→50, 2項→80, 3+項→100 |
| 星座 | 同星座→100, 同元素→80, 其他→40 |
| 地點 | 同區→100, 都在大台北→70, 其他→40 |
| 時間 | 有重疊→100, 無重疊→40 |
| 氛圍 | 雙方有 vibePrompt→80, 否則→50 |

每個維度同時回傳人類可讀的 `reasons` 字串。

---

### 3. `src/features/matching/calculateMatchScore.test.ts`
8 個單元測試，覆蓋：完整 breakdown 結構、各維度邊界值、加權總分計算。

---

### 4. `src/features/date-requests/dateRequest.types.ts`
定義 `DateRequestStore` interface 與 `CreateDateRequestInput` type：

```ts
export type CreateDateRequestInput = Omit<DateRequest, "id" | "status" | "createdAt" | "updatedAt">;

export interface DateRequestStore {
  create(input: CreateDateRequestInput): Promise<DateRequest>;
  listByReceiver(receiverId: string): Promise<DateRequest[]>;
  updateStatus(id: string, status: DateRequestStatus): Promise<DateRequest>;
}
```

---

### 5. `src/features/date-requests/browserLocalDateRequestStore.ts`
`"use client"` 檔案。用 `localStorage` key `tastemap.dateRequests` 實作 `DateRequestStore`：
- `create()` — 產生 `dr_${Date.now()}_xxxxx` id，status 預設 `pending`
- `listByReceiver()` — 篩選 receiverId
- `updateStatus()` — 找不到 id 時 throw Error

---

### 6. `src/features/date-requests/dateRequest.service.ts`
`"use client"` facade，直接 re-export `browserLocalDateRequestStore` 為 `dateRequestService`。

---

### 7. `src/features/date-requests/browserLocalDateRequestStore.test.ts`
5 個測試：create、listByReceiver 篩選、pending→accepted、pending→rejected、id 不存在 throw。

---

### 8. `src/lib/ai/generateInviteAdvice.ts`
伺服器端函數。呼叫 Anthropic Claude Haiku 產生邀約建議。

**函數簽名：**
```ts
export async function generateInviteAdvice(input: AdviceInput): Promise<AdviceOutput>
// AdviceOutput = { reason: string; suggestedMessage: string }
```

**規則：**
- 若 `ANTHROPIC_API_KEY` 未設，直接回傳 fallback（不 throw）
- 若 API 呼叫失敗（網路、parse 錯誤），catch 後回傳 fallback
- fallback 內容引用 sharedFoodTypes 的中文名稱
- 使用模型：`claude-haiku-4-5-20251001`
- 要求 Claude 回傳純 JSON `{ reason, suggestedMessage }`

---

### 9. `src/lib/ai/generateInviteAdvice.test.ts`
3 個測試：有 reason/suggestedMessage 欄位、内容非空、空 sharedFoodTypes 時 fallback 含「美食」。

---

### 10. `src/lib/firestore.server.ts`
`getAdminFirestore()` 函數，用 `firebase-admin/app` 的 `applicationDefault()` 初始化（singleton pattern）。
僅在 Firestore mode 下被 API routes 呼叫，local mode 不會 import。

---

### 11. `src/app/api/match-advice/route.ts`
```
POST /api/match-advice
```
Request body（Zod 驗證）：
```ts
{ viewerId, candidateId, sharedFoodTypes: string[], matchScore: number, viewerVibe, candidateVibe }
```
Response：`{ reason: string, suggestedMessage: string }`

呼叫 `generateInviteAdvice()`，自動 fallback。

---

### 12. `src/app/api/date-requests/route.ts`
```
GET  /api/date-requests?receiverId=xxx
POST /api/date-requests
```
**僅在 `STORAGE_MODE=firestore` 時有效**，local mode 回傳 501。
local mode 下 client 直接用 browserLocalDateRequestStore，不走這個 route。

---

### 13. `src/app/api/date-requests/[id]/route.ts`
```
PATCH /api/date-requests/:id
```
Body：`{ status: "accepted" | "rejected" }`
同上，僅 Firestore mode 有效。

---

### 14. `src/app/inbox/page.tsx`
`"use client"` 頁面，路徑 `/inbox`。

**功能：**
- 從 localStorage 讀取 viewer profile（顯示名稱）
- Demo 模式預設以 `mock-user-2` 身份查看收件匣
- 呼叫 `browserLocalDateRequestStore.listByReceiver()` 載入邀約
- 按 createdAt 降序排列
- 分「待回應」與「歷史紀錄」兩區塊
- 「接受邀約」/ 「婉拒」按鈕即時更新狀態
- 空狀態：顯示 📭 + 導回地圖按鈕

---

### 15. `src/components/DateRequestDialog.tsx`
`"use client"` 元件。Dialog（使用 `@base-ui/react/dialog`）。

**重要：** base-ui 的 DialogTrigger 不支援 `asChild`，改用 `render` prop：
```tsx
<DialogTrigger render={<Button ... />}>
  發送邀約
</DialogTrigger>
```

**重要：** base-ui Select 的 `onValueChange` 簽名為 `(value: string | null, ...) => void`，
必須做 null 檢查：
```tsx
onValueChange={(v) => { if (v !== null) setState(v); }}
```

**功能：**
- Props：`viewer`, `candidate`, `suggestedMessage`, `onSent`
- 表單欄位：食物種類（Select）、約會區域（Select）、可約時間（Select）、邀約訊息（Textarea）
- 訊息欄預填 AI 建議文字，可自由修改
- 送出後呼叫 `dateRequestService.create()`，1.2 秒後關閉 dialog
- 送出中 / 送出成功 狀態顯示

---

## Phase 2 更新的現有檔案

### `src/components/MatchReasonPanel.tsx`
**從** 硬編碼假資料（85分佔位）
**改為** 真實計算：

- 新增 `"use client"` directive
- 使用 `useMemo` 呼叫 `calculateMatchScore(viewerProfile, user)`
- 若無 viewerProfile，顯示提示文字
- 顯示 4 位數字大分（有顏色：≥80橘、≥60黃、其他灰）
- 5 個維度各有進度條（orange-400）+ 標籤 + 理由文字 + 分數

---

### `src/components/CandidateCard.tsx`
**從** 靜態卡片 + 無功能按鈕
**改為** 完整互動流程：

- 新增 `"use client"` directive
- 食物偏好 badge：與 viewer 共同的項目顯示橘色高亮
- **「產生邀約建議」按鈕** → `fetch POST /api/match-advice` → 顯示 AI reason + suggestedMessage
- 建議生成後，按鈕消失，改顯示 **「發送邀約」** → 開啟 `DateRequestDialog`
- 邀約送出後，顯示「邀約已送出 ✓」+ 「前往收件匣查看」連結
- 未有 viewerProfile 時顯示「建立檔案後才能邀約」

---

## 完整用戶流程（Phase 2 後可完整跑通）

```
1. /onboarding → 建立 profile → 存入 localStorage
2. /map        → 食物篩選 → 點擊 marker
3. 右側面板    → CandidateCard 顯示候選人資訊
               → MatchReasonPanel 顯示真實配對分數（5維度）
4. 點「產生邀約建議」→ POST /api/match-advice → AI 或 fallback 文案
5. 點「發送邀約」  → DateRequestDialog 開啟
               → 填寫食物/地點/時間/訊息
               → 確認送出 → browserLocalDateRequestStore.create()
6. /inbox      → 以 mock-user-2 身份查看
               → 接受邀約 → status 變 accepted
               → 婉拒邀約 → status 變 rejected
```

---

## 已安裝套件（相關）

```json
"@anthropic-ai/sdk": "^0.91.1",
"firebase-admin": "^13.8.0",
"@base-ui/react": "^1.4.1",
"zod": "^4.3.6"
```

> **注意 Zod v4**：使用 `z.object`, `z.string`, `z.array`, `z.enum`, `.safeParse()` 均正常，
> 但 `z.nativeEnum` 行為有變，建議避免使用。

> **注意 @base-ui/react**：這不是 Radix UI。
> - DialogTrigger：用 `render` prop，不支援 `asChild`
> - Select：`onValueChange` 第一個參數型別為 `string | null`

---

## 未完成項目（Phase 2 選填）

- `src/features/date-requests/firestoreDateRequestStore.server.ts`
  — Firestore adapter 實作。Phase 2 文件明確標為「optional if time is short」。
  — `firestore.server.ts` 的 `getAdminFirestore()` 已建好，可直接使用。
  — API routes（`/api/date-requests`）已有 Firestore mode 分支，只需補 store 實作即可串接。

---

## Phase 3 已完成的所有檔案

| 檔案 | 說明 |
|---|---|
| `next.config.ts` | `output: "standalone"` |
| `Dockerfile` | Node 22 Alpine，多階段，port 8080，non-root |
| `.github/workflows/deploy-cloud-run.yml` | test→build→push→Cloud Run deploy |
| `playwright.config.ts` | E2E，baseURL localhost:3000 |
| `tests/e2e/tastemap.spec.ts` | 5 個 happy path |
| `docs/gcp-deploy.md` | GCP 完整 setup 指令 |
| `docs/demo-script.md` | 3 分鐘 demo 腳本 |
| `README.md` | 面試可讀版 |

**vitest.config.ts** 已更新，排除 `tests/e2e/**`（避免 vitest 誤抓 Playwright 測試）。
**tsconfig.json** 已更新，exclude `tests/e2e` 與 `playwright.config.ts`。

---

## 下一步（若需繼續）

1. **補 Firestore adapter**（選填）
   - 建立 `src/features/date-requests/firestoreDateRequestStore.server.ts`
   - 實作 `DateRequestStore` interface，使用 `getAdminFirestore()`
   - 修改 `/api/date-requests` route 改為呼叫 Firestore store

2. **GCP 部署**
   - 照 `docs/gcp-deploy.md` 設定 GCP 資源
   - 在 GitHub repo 填入 Variables（GCP_PROJECT_ID 等 7 個）
   - Push to main → CI 自動跑

3. **E2E 測試完整化**
   - 安裝 `@playwright/test`（目前只有 `playwright`）
   - 補全 onboarding 表單互動測試
