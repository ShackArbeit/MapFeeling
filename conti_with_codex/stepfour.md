# Phase 3 完成紀錄｜給後續編輯的接手文件

> 本文件記錄 Phase 3（GCP Deploy + CI/CD + Testing + Demo Polish）由 Claude Code 完成的所有實作細節。

---

## 專案位置

```
C:\Users\user\Desktop\FeelMap\
├── .github/workflows/deploy-cloud-run.yml   ← CI/CD（repo 根目錄）
├── tastemap-date/                           ← Next.js 專案
└── conti_with_codex/                        ← 接手文件
```

---

## 完成狀態

- `npm run test` — 22 tests pass（4 test files）
- `npm run typecheck` — 0 errors
- `npm run build` — Next.js 16 production build 成功
- GitHub Actions CI — Success（2m 51s）
- Cloud Run — 已部署，URL 可從 `gcloud run services describe` 取得

---

## 本次修正與新增的項目

### 1. `.github/workflows/deploy-cloud-run.yml`（移至 repo 根目錄）

**問題：** CODEX 原本把 workflow 放在 `tastemap-date/.github/workflows/`，GitHub Actions 只讀 repo 根目錄的 `.github/workflows/`，導致 CI 永遠不會觸發。

**修正：** 在 repo 根目錄（`FeelMap/.github/workflows/`）重新建立 workflow 檔案，並加入：

```yaml
defaults:
  run:
    working-directory: tastemap-date
```

這讓所有 `run:` steps（npm ci、npm run build、docker build 等）都在 `tastemap-date/` 子目錄執行。

同時修正 `cache-dependency-path`：

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: 22
    cache: npm
    cache-dependency-path: tastemap-date/package-lock.json
```

完整 deploy 指令（含 Secret Manager）：

```yaml
gcloud run deploy $SERVICE \
  --image=$REGION-docker.pkg.dev/$PROJECT_ID/$REPOSITORY/$IMAGE_NAME:${{ github.sha }} \
  --region=$REGION \
  --platform=managed \
  --allow-unauthenticated \
  --service-account=tastemap-runner@$PROJECT_ID.iam.gserviceaccount.com \
  --set-env-vars="NEXT_PUBLIC_APP_ENV=production,NEXT_PUBLIC_STORAGE_MODE=local,STORAGE_MODE=local" \
  --set-secrets="ANTHROPIC_API_KEY=ANTHROPIC_API_KEY:latest"
```

---

### 2. `@playwright/test` 安裝

**問題：** CODEX 的 `package.json` 只有 `playwright`，但 `playwright.config.ts` 和 `tests/e2e/tastemap.spec.ts` 都用 `@playwright/test` 的 API，E2E 無法執行。

**修正：**

```bash
npm install --save-dev @playwright/test
```

`package.json` devDependencies 已更新，`package-lock.json` 已同步。

---

### 3. 所有 Phase 2 & 3 檔案 Committed & Pushed

CODEX 寫完的程式碼全部在本機但未 commit（git status 顯示大量 `??`）。本次一次 stage 並 commit：

**Commit hash：** `5e31764`

**新增檔案清單：**

| 檔案 | 說明 |
|---|---|
| `.github/workflows/deploy-cloud-run.yml` | CI/CD workflow（repo 根目錄） |
| `tastemap-date/docs/gcp-deploy.md` | GCP 完整 setup 指令 |
| `tastemap-date/playwright.config.ts` | E2E 設定，baseURL localhost:3000 |
| `tastemap-date/tests/e2e/tastemap.spec.ts` | 5 個 happy path E2E 測試 |
| `tastemap-date/src/app/api/date-requests/route.ts` | GET/POST（Firestore mode） |
| `tastemap-date/src/app/api/date-requests/[id]/route.ts` | PATCH status（Firestore mode） |
| `tastemap-date/src/app/api/match-advice/route.ts` | POST AI 邀約建議 |
| `tastemap-date/src/app/inbox/page.tsx` | 收件匣頁面 |
| `tastemap-date/src/components/DateRequestDialog.tsx` | 發送邀約 Dialog |
| `tastemap-date/src/features/date-requests/dateRequest.types.ts` | DateRequestStore interface |
| `tastemap-date/src/features/date-requests/browserLocalDateRequestStore.ts` | localStorage 實作 |
| `tastemap-date/src/features/date-requests/dateRequest.service.ts` | facade re-export |
| `tastemap-date/src/features/date-requests/browserLocalDateRequestStore.test.ts` | 5 個單元測試 |
| `tastemap-date/src/features/matching/calculateMatchScore.ts` | 配對評分純函數 |
| `tastemap-date/src/features/matching/calculateMatchScore.test.ts` | 8 個單元測試 |
| `tastemap-date/src/features/zodiac/zodiac.test.ts` | 5 個單元測試 |
| `tastemap-date/src/lib/ai/generateInviteAdvice.ts` | Claude Haiku + fallback |
| `tastemap-date/src/lib/ai/generateInviteAdvice.test.ts` | 3 個單元測試 |
| `tastemap-date/src/lib/firestore.server.ts` | firebase-admin singleton |

**更新檔案清單：**

| 檔案 | 說明 |
|---|---|
| `tastemap-date/README.md` | 面試可讀版 |
| `tastemap-date/docs/demo-script.md` | 3 分鐘 demo 腳本 |
| `tastemap-date/src/components/CandidateCard.tsx` | 真實互動流程（AI 邀約 + dialog） |
| `tastemap-date/src/components/MatchReasonPanel.tsx` | 真實配對分數（5 維度） |
| `tastemap-date/tsconfig.json` | 排除 e2e / playwright.config.ts |
| `tastemap-date/vitest.config.ts` | 排除 tests/e2e |
| `tastemap-date/package.json` | 新增 @playwright/test |
| `tastemap-date/package-lock.json` | 同步 |

---

## GCP 資源（已由 CODEX 建立完畢）

| 資源 | 值 |
|---|---|
| Project ID | `tastemap-date-494806` |
| Project Number | `1048249578662` |
| Region | `asia-east1` |
| Artifact Registry | `tastemap-date` |
| Cloud Run Service | `tastemap-date-web` |
| Runtime SA | `tastemap-runner@tastemap-date-494806.iam.gserviceaccount.com` |
| Deployer SA | `github-deployer@tastemap-date-494806.iam.gserviceaccount.com` |
| WIF Provider | `projects/1048249578662/locations/global/workloadIdentityPools/github-pool/providers/github-provider` |
| Secret | `ANTHROPIC_API_KEY`（v2，真實 key，已啟用） |

---

## GitHub Repository Variables（已手動設定）

| Variable | 值 |
|---|---|
| `GCP_PROJECT_ID` | `tastemap-date-494806` |
| `GCP_PROJECT_NUMBER` | `1048249578662` |
| `GCP_REGION` | `asia-east1` |
| `GCP_ARTIFACT_REPOSITORY` | `tastemap-date` |
| `CLOUD_RUN_SERVICE` | `tastemap-date-web` |
| `GCP_SERVICE_ACCOUNT` | `github-deployer@tastemap-date-494806.iam.gserviceaccount.com` |
| `GCP_WORKLOAD_IDENTITY_PROVIDER` | `projects/1048249578662/locations/global/workloadIdentityPools/github-pool/providers/github-provider` |

---

## ANTHROPIC_API_KEY 注意事項

- 真實 key 存在 GCP Secret Manager，**不在** GitHub Variables
- Cloud Run 透過 `--set-secrets` 在 runtime 注入
- 沒有 key 時 app 自動走 deterministic fallback，demo 不會掛掉
- 費用估算：每次 AI 呼叫約 $0.00064（Claude Haiku），$5 額度可撐 ~7,800 次

---

## 未完成項目（選填）

- `src/features/date-requests/firestoreDateRequestStore.server.ts`
  — Firestore adapter 實作，`getAdminFirestore()` 已備好
  — 現在 local mode 用 localStorage，切換 `STORAGE_MODE=firestore` 即可啟用 Firestore
  — 面試 demo 不需要，優先級低

---

## 下一步（若需繼續）

1. **確認 Cloud Run URL** — 從 Actions run 最後一步 "Show Cloud Run URL" 取得，或跑：
   ```bash
   gcloud run services describe tastemap-date-web \
     --region=asia-east1 \
     --format='value(status.url)' \
     --project=tastemap-date-494806
   ```

2. **本機 E2E 測試**（選填）：
   ```bash
   cd tastemap-date
   npx playwright install chromium
   npm run e2e
   ```

3. **面試 demo** — 照 `docs/demo-script.md` 走 3 分鐘流程
