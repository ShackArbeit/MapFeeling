# Demo Script｜TasteMap Date (3 分鐘)

## 開場白（30 秒）

> "這是 TasteMap Date，食感航線。它解決的問題是：現有交友 app 的第一步是滑卡或開話題，這對很多人來說壓力很大。我們把第一步換成『你喜歡吃什麼』——從食物偏好開始，找到有共鳴的人。"

---

## Step 1 — Landing Page（15 秒）

打開首頁，指出：
- Hero: 產品定位一句話
- 說明食物優先的情感邏輯
- 安全設計說明（無精確位置）
- 點擊「開始探索」

---

## Step 2 — Onboarding（20 秒）

填寫 demo profile：
- 暱稱、生日（星座會自動算出）
- 選擇食物偏好（例：咖啡、壽司）
- 選擇大略約會區域（例：大安）
- 填寫 Vibe prompt
- Submit → 儲存到 localStorage，跳轉 /map

---

## Step 3 — Taste Map（30 秒）

地圖打開，指出：
- "這裡有 240 個 mock 用戶，座標都是模糊化的大略區域，不是真實住址"
- 點選食物篩選（例：咖啡）→ 地圖 marker 縮減
- 點擊一個 marker → 候選人卡片出現

---

## Step 4 — Candidate Card & Match Score（30 秒）

指出 Candidate Card 的內容：
- 個人簡介、食物偏好、星座元素
- 配對分數：food 40% / zodiac 20% / area 20% / availability 10% / vibe 10%
- "分數是純函數計算，不是 AI，可以完整解釋"
- 指出 match reasons（例：你們都喜歡咖啡、同為風象星座）

---

## Step 5 — AI 邀約建議（20 秒）

點擊「產生邀約建議」：
- 呼叫 `/api/match-advice`
- 顯示 AI 生成的邀約理由 + 建議訊息
- "如果沒有 API key，會回傳 deterministic fallback，不會 crash"

---

## Step 6 — 送出約會邀請（15 秒）

打開 DateRequestDialog：
- 選食物類型、地區、時段
- 加入個人訊息
- Submit → 儲存到 localStorage（local mode）

---

## Step 7 — Inbox Accept / Reject（20 秒）

切換到 /inbox，選 mock receiver：
- 顯示 pending 邀請
- 點擊「接受」→ 狀態變 accepted
- 點擊「拒絕」→ 狀態變 rejected
- "狀態管理用 adapter 模式，local mode 用 localStorage，切換 env var 就能改成 Firestore"

---

## Step 8 — 架構說明（20 秒）

> "整個 stack 是 Next.js App Router + TypeScript + Tailwind + Leaflet。部署是 GCP Cloud Run，CI/CD 是 GitHub Actions + Workload Identity Federation，不用存 service account key。AI key 放在 Secret Manager。"

---

## 結尾（10 秒）

> "這個 MVP 3 天完成，重點是穩定可 demo、架構可解釋、deploy 可驗證。有任何技術細節想深入討論的嗎？"