# TasteMap Date｜Claude Code & Codex CLI 協作 Prompt Pack

> 目的：把 `TasteMap Date｜食感航線 MVP` 拆成可直接丟給 Claude Code CLI 與 Codex CLI 的執行文件。  
> 建議節奏：4 個 Phase，Phase 0–3。  
> 原則：Claude Code 負責主要建置；Codex 負責獨立審查、測試補強、風險掃描與小範圍修補。

---

## 1. MVP 應分成幾個 Phase？

我建議分成 **4 個 Phase**：

| Phase | 時間 | 目標 | 主力工具 | 產出 |
|---|---:|---|---|---|
| Phase 0 | 0.5 天 | Scope、Repo、架構、文件、技術基底 | Claude Code | README、architecture、route map、schema、repo base |
| Phase 1 | Day 1 | 產品骨架 + 200+ mock users + 地圖瀏覽 | Claude Code | Landing、Onboarding、Profiles API、Map、Filter、Candidate Card |
| Phase 2 | Day 2 | Matching + AI advice + date request 閉環 | Claude Code 主建，Codex 審查 | Zodiac、Match Score、AI fallback、Request、Inbox、Accept/Reject |
| Phase 3 | Day 3 | GCP Deploy + CI/CD + Testing + Demo polish | Claude Code 主整合，Codex 壓測審查 | Dockerfile、GitHub Actions、Cloud Run、Vitest、Playwright、Demo script |

**不要再拆成 5–6 個 Phase。**  
這個 MVP 只有 3 個工作天，Phase 太多會讓執行節奏碎掉。Phase 0–3 剛好對應：準備 → 可看 → 可互動 → 可部署展示。

---

## 2. Claude Code 與 Codex 各自角色

### Claude Code：主要 Builder / Pair Programmer

Claude Code 應負責：

- repo 初始化
- Next.js App Router 架構
- TypeScript domain model
- UI component 實作
- mock data generator
- API route handler
- matching / zodiac pure function
- AI advice fallback
- storage adapter
- Dockerfile
- GitHub Actions workflow
- README / demo script
- 基礎 unit / e2e test

**使用方式：**

```bash
# 互動式，建議用這個跑每個 Phase
claude

# 或一次性執行某個 prompt
claude -p "$(cat docs/ai-prompts/01-phase-0-scope-architecture.md)"
```

在 Claude Code 裡可以這樣引用檔案：

```txt
Please read @docs/ai-prompts/00-claude-general-intro.md first.
Then execute @docs/ai-prompts/01-phase-0-scope-architecture.md.
```

---

### Codex：獨立 Reviewer / Fixer / Interview Risk Auditor

Codex 不建議一開始跟 Claude 同時改同一批檔案。  
它最適合在每個 Phase 完成後做：

- technical review
- security / privacy review
- test gap review
- CI/CD workflow review
- bug fix suggestion
- 小範圍 auto-edit 修補
- 面試官視角提問與回答

**使用方式：**

```bash
# 安全審查模式，預設只提議，不直接改
codex "$(cat docs/ai-prompts/05-codex-review-and-fix-prompts.md)"

# 需要它直接修小問題時
codex --auto-edit "$(cat docs/ai-prompts/05-codex-review-and-fix-prompts.md)"
```

Windows PowerShell 可用：

```powershell
codex (Get-Content docs/ai-prompts/05-codex-review-and-fix-prompts.md -Raw)
```

---

## 3. 建議執行順序

```bash
# 0. 建議先開新 repo / branch
git checkout -b feature/tastemap-mvp

# 1. 先讓 Claude 建立全局理解
claude -p "$(cat docs/ai-prompts/00-claude-general-intro.md)"

# 2. Phase 0
claude -p "$(cat docs/ai-prompts/01-phase-0-scope-architecture.md)"

# 3. Phase 1
claude -p "$(cat docs/ai-prompts/02-phase-1-product-skeleton-mock-data.md)"

# 4. Phase 1 review
codex "$(cat docs/ai-prompts/05-codex-review-and-fix-prompts.md)"

# 5. Phase 2
claude -p "$(cat docs/ai-prompts/03-phase-2-matching-ai-request-flow.md)"

# 6. Phase 2 review
codex "$(cat docs/ai-prompts/05-codex-review-and-fix-prompts.md)"

# 7. Phase 3
claude -p "$(cat docs/ai-prompts/04-phase-3-gcp-cicd-testing-demo.md)"

# 8. Final review
codex "$(cat docs/ai-prompts/05-codex-review-and-fix-prompts.md)"
```

---

## 4. 重要執行規則

1. **每個 Phase 完成後一定要 commit。**
2. Claude Code 負責「產出」；Codex 負責「挑錯」。
3. Codex 只在明確修 bug 時開 `--auto-edit`。
4. 不要讓兩個 CLI 同時改同一個 branch 的同一批檔案。
5. Day 1 / Day 2 先用 `NEXT_PUBLIC_STORAGE_MODE=local`。
6. Day 3 再補 Firestore mode 與 GCP deploy。
7. 沒有 `ANTHROPIC_API_KEY` 時，AI advice 必須 fallback，不准 demo 爆掉。
8. dating product 不顯示住家精準位置，只顯示 approximate dating area。

---

## 5. Prompt 檔案說明

| 檔案 | 用途 |
|---|---|
| `00-claude-general-intro.md` | Claude Code 一開始讀的總說明 |
| `01-phase-0-scope-architecture.md` | Phase 0：scope、repo、架構 |
| `02-phase-1-product-skeleton-mock-data.md` | Phase 1：產品骨架、mock users、map |
| `03-phase-2-matching-ai-request-flow.md` | Phase 2：matching、AI advice、date request |
| `04-phase-3-gcp-cicd-testing-demo.md` | Phase 3：GCP、CI/CD、testing、demo |
| `05-codex-review-and-fix-prompts.md` | Codex 審查與修補 prompt |
| `06-cli-usage-guide.md` | CLI 使用備忘與指令 |
| `CLAUDE.md` | 可放在 repo root，作為 Claude Code project memory |
| `AGENTS.md` | 可放在 repo root，作為 Codex project memory |
