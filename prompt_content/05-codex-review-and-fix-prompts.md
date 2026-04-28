# Codex Review and Fix Prompts｜TasteMap Date MVP

> Use with Codex CLI.  
> Codex role: independent technical reviewer, test-gap finder, privacy-risk auditor, and small-scope fixer.

---

## How to Run

From repo root:

```bash
codex "$(cat docs/ai-prompts/05-codex-review-and-fix-prompts.md)"
```

If you want Codex to make small edits:

```bash
codex --auto-edit "$(cat docs/ai-prompts/05-codex-review-and-fix-prompts.md)"
```

Use `--auto-edit` only after committing the current work.

---

## Prompt A｜General Technical Review

You are reviewing the TasteMap Date MVP as if you are a technical interviewer for a startup hiring a **Vibe Coding Engineer**.

Context:

- The app is a food-first dating web MVP.
- It was built within 3 working days.
- The product goal is emotional UX, not full production completeness.
- Existing users are deterministic 200+ mock profiles.
- Dating safety matters: no exact home address should be shown.
- Deployment target is GCP Cloud Run.
- CI/CD should use GitHub Actions + Artifact Registry + Cloud Run.
- AI advice must fallback when `ANTHROPIC_API_KEY` is missing.
- Match scoring must be rule-based and explainable.

Please inspect the repository and review:

1. Does the app demonstrate 0-to-1 product thinking?
2. Does the architecture demonstrate full-stack ability?
3. Is the GCP deployment credible?
4. Is the GitHub + GCP CI/CD workflow credible?
5. Are mock data and storage decisions defensible?
6. Are there privacy or safety problems?
7. Are tests meaningful enough for an interview MVP?
8. What should be simplified before the interview?
9. What should be highlighted during the demo?

Return:

- critical issues
- quick fixes within 3 hours
- interview talking points
- likely interviewer questions
- suggested answers

Do not rewrite the whole app.  
Prioritize realistic fixes.

---

## Prompt B｜Phase 1 Review

Review only Phase 1:

- landing page
- onboarding page
- mock data generator
- profiles API
- taste map
- food filter
- candidate card

Check:

1. Does `npm run generate:mock-users` create at least 200 users?
2. Is mock data deterministic?
3. Does `/api/profiles` support filtering safely?
4. Does the map avoid exact addresses?
5. Are Leaflet SSR issues handled?
6. Is UI demo-friendly?
7. Are TypeScript types clean?

Return:

- build blockers
- UX blockers
- privacy blockers
- quick fixes
- files to edit

If using `--auto-edit`, only fix small issues that are clearly safe.

---

## Prompt C｜Phase 2 Review

Review only Phase 2:

- zodiac calculation
- match scoring
- AI advice endpoint
- fallback strategy
- date request flow
- inbox
- localStorage / Firestore adapter

Check:

1. Is matching explainable and not AI-dependent?
2. Does AI advice fallback without API key?
3. Are API schemas validated with Zod?
4. Are client-only localStorage files isolated from server code?
5. Does accept / reject update status correctly?
6. Is there any exact location leakage?
7. Are unit tests meaningful?

Return:

- correctness bugs
- architecture concerns
- safety concerns
- test gaps
- quick fixes

If using `--auto-edit`, only fix:

- type errors
- missing imports
- broken tests
- obvious null checks
- fallback logic bugs

---

## Prompt D｜Phase 3 Review

Review only Phase 3:

- Dockerfile
- next.config.ts
- GitHub Actions workflow
- GCP docs
- tests
- README
- demo script

Check:

1. Does Dockerfile support Cloud Run port 8080?
2. Does Next.js use `output: "standalone"`?
3. Does CI run generate → typecheck → test → build → docker → deploy?
4. Does GitHub Actions use Workload Identity Federation?
5. Are GCP project variables configurable?
6. Are secrets handled through Secret Manager?
7. Are long-lived service account keys avoided?
8. Is README understandable to interviewer?
9. Can demo be completed in 3 minutes?

Return:

- deployment blockers
- CI/CD blockers
- security risks
- quick fixes
- final demo talking points

---

## Prompt E｜Fix Failing Build

Use this only if build fails.

Task:

1. Run or inspect:
   - `npm run typecheck`
   - `npm run test`
   - `npm run build`
2. Identify the smallest set of changes needed.
3. Fix only build/type/test blockers.
4. Do not refactor unrelated code.
5. Do not add new features.

Return:

- root cause
- files changed
- commands run
- remaining risks

---

## Prompt F｜Interview Q&A Generator

Read the repo and generate interview Q&A.

Focus on:

- why mock users instead of DB
- why Cloud Run
- why GitHub Actions + Workload Identity Federation
- why AI is not matching decision layer
- how dating safety is handled
- what would be improved after MVP
- what tradeoffs were made in 3 days

Return:

- 10 likely questions
- concise answer
- stronger senior-level answer
- possible follow-up
