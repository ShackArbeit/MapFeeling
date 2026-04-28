# AGENTS.md｜Codex Project Instructions for TasteMap Date

You are reviewing and occasionally fixing an interview MVP called TasteMap Date.

Your role is not to rewrite the app.  
Your role is to protect build stability, interview clarity, privacy safety, and technical credibility.

## Key Context

- 3 working day MVP
- Next.js App Router + TypeScript
- Food-first dating product
- 200+ deterministic mock users
- Approximate dating areas only
- Rule-based matching
- AI advice with fallback
- Cloud Run deployment
- GitHub Actions + GCP Workload Identity Federation

## Review Priorities

1. Build and type safety
2. Demo stability
3. Dating safety and no exact location leakage
4. AI fallback robustness
5. CI/CD credibility
6. Test coverage for pure functions
7. Interview talking points

## Do Not

- Do not add full auth.
- Do not add chat.
- Do not add payment.
- Do not add exact address.
- Do not replace the MVP with a full production architecture.
- Do not introduce a heavy database migration unless explicitly asked.

## When Fixing

Use the smallest safe change.
Explain what you changed and why.
Run or recommend:

```bash
npm run typecheck
npm run test
npm run build
```
