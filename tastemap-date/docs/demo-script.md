# 3-Minute Demo Script — TasteMap Date｜食感航線

## Setup (before demo)

1. Open browser at `http://localhost:3000` (or Cloud Run URL)
2. Have a second tab ready at `/inbox`

---

## Demo Flow (~3 minutes)

### 0:00 — Product Pitch (20 sec)

> "這是一個食物優先的交友 MVP。核心概念是：第一步不是滑卡配對，是先從一起吃什麼開始。"

Show the landing page headline: **「不要先想怎麼聊天，先從一起吃什麼開始」**

---

### 0:20 — Onboarding (40 sec)

Click **「建立我的食感檔案」** → `/onboarding`

Fill in:
- 暱稱：Demo User
- 生日（選一個，顯示星座）
- 食物偏好：選 2-3 個，例如「咖啡」「拉麵」
- 約會區域：大安
- 約會心情：「喜歡悠閒的午後時光」

Click submit → redirected to `/map`

---

### 1:00 — Taste Map (50 sec)

> "這是食感地圖。240 個 mock 用戶分布在大台北各區。"

Point out:
- 頂部食物篩選器
- 地圖上的頭像 marker

Click **「咖啡」** filter → map updates to show coffee lovers only

Click a marker on the map

Right panel shows:
- 候選人卡片：食物偏好、約會心情、可約時段（共同食物 badge 橘色高亮）
- 配對評分：5 個維度（食物、星座、地點、時間、氛圍）+ 加權總分

---

### 1:50 — AI Invite (40 sec)

> "系統計算出配對分數後，可以請 AI 幫你生成邀約建議。"

Click **「產生邀約建議」**

Show the AI-generated reason + suggested message

> "如果沒有 API key，會走 deterministic fallback，demo 不會掛掉。"

Click **「發送邀約」** → dialog opens

Show the pre-filled form: 食物選項、區域、時間、訊息（可編輯）

Click **「確認送出」**

---

### 2:30 — Inbox (30 sec)

> "邀約送出後，對方可以在 Inbox 收到、接受或拒絕。"

Click **「前往收件匣查看」** or navigate to `/inbox`

Show the pending request card

Click **「接受邀約」** → status changes to **已接受**

> "狀態即時更新，存在 localStorage，deploy 後可切換 Firestore mode。"

---

### 2:55 — Architecture Wrap (5 sec)

> "Next.js App Router + TypeScript + GCP Cloud Run，CI/CD 走 GitHub Actions + Workload Identity Federation，無需 Service Account Key。"

---

## Key Talking Points

- **No over-engineering**: localStorage first, Firestore adapter ready to swap
- **AI is optional**: fallback ensures demo stability without an API key
- **Match score is pure function**: explainable, testable, no AI black box
- **Privacy-first**: jittered coordinates only, no exact addresses
- **Deploy-ready**: Dockerfile + Cloud Run + GitHub Actions secret injection wired up
