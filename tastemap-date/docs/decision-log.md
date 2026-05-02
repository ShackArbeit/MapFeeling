# Decision Log｜TasteMap Date

## Web MVP Only — No Flutter

**Decision:** Build web only with Next.js App Router.  
**Reason:** 3-day timebox. A cross-platform app would double the scope without adding interview value. Next.js enables SSR, API routes, and deployment to Cloud Run in a single codebase.

## 240 Deterministic Mock Users

**Decision:** Generate 240 fake users with a seeded script, commit JSON to repo, no DB for read-only profiles.  
**Reason:** The interview MVP goal is to demo browsability and matching, not database design. Deterministic seed means the demo is reproducible. No backend dependency for the read path means faster load and simpler deployment.

## Approximate Dating Area Only — No Exact Address

**Decision:** All user coordinates are area center + random jitter. UI labels say "推薦約會區域" not "住家位置".  
**Reason:** Dating app safety standard. Showing exact home addresses would be a serious privacy risk, even in a demo context.

## Match Score Is Rule-Based, Not AI

**Decision:** `calculateMatchScore` is a pure TypeScript function with documented weights. AI is only used to generate invite copy.  
**Reason:** Rule-based scoring is explainable, testable, and does not require an API key. AI as a scoring layer would be opaque, unreliable, and costly. The interviewer can read the scoring logic directly.

## AI Is Explainable Copy Layer, Not Decision Layer

**Decision:** Anthropic API generates low-pressure invite suggestion text. If the key is missing, a deterministic fallback is returned.  
**Reason:** AI should enhance UX, not gate it. The product works without an API key. This also demonstrates responsible AI integration.

## Cloud Run Instead of Vercel

**Decision:** Deploy to GCP Cloud Run with Docker + Artifact Registry.  
**Reason:** The job requires GCP experience. Cloud Run gives containerized deploys, custom environment variables, and no vendor lock-in to Vercel. The standalone Next.js output fits perfectly.

## GitHub Actions + Workload Identity Federation

**Decision:** CI/CD uses Workload Identity Federation instead of long-lived service account key JSON.  
**Reason:** Long-lived keys are a security risk and poor practice. Workload Identity Federation allows GitHub Actions to authenticate to GCP without storing credentials as secrets. This demonstrates production-grade GCP security knowledge.

## DateRequestStore Adapter Pattern

**Decision:** Define a `DateRequestStore` interface implemented by both `browserLocalDateRequestStore` and `firestoreDateRequestStore`.  
**Reason:** Allows demo to work fully offline (localStorage) while proving the architecture can scale to a real backend (Firestore) without changing any UI code.
