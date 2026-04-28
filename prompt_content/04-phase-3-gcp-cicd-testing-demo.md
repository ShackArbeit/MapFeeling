# Phase 3｜GCP Deploy + GitHub CI/CD + Testing + Demo Polish

> Use with Claude Code CLI.  
> Goal: make the MVP deployable, testable, and interview-ready.

You are implementing **Phase 3** of TasteMap Date MVP.

---

## Phase Goal

Finish engineering polish:

- Dockerfile for Cloud Run
- Next.js standalone output
- GitHub Actions CI/CD
- Artifact Registry image push
- Cloud Run deploy
- Secret Manager config
- optional Firestore mode
- Vitest unit tests
- Playwright e2e test
- README deploy guide
- 3-minute demo script

---

## Timebox

Recommended: **Day 3**

---

## Required Files

Create or update:

```txt
Dockerfile
next.config.ts
.github/workflows/deploy-cloud-run.yml
playwright.config.ts
tests/e2e/tastemap.spec.ts
vitest.config.ts
docs/gcp-deploy.md
docs/demo-script.md
README.md
```

---

## Technical Imports Must Be Precise

### `next.config.ts`

```ts
import type { NextConfig } from "next";
```

Required config:

```ts
const nextConfig: NextConfig = {
  output: "standalone",
};

export default nextConfig;
```

### Playwright test

`tests/e2e/tastemap.spec.ts`

```ts
import { expect, test } from "@playwright/test";
```

### Vitest config

`vitest.config.ts`

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
```

---

## Dockerfile Requirements

Use Node 22 Alpine.

Required behavior:

- support npm / pnpm / yarn lockfiles
- build Next.js
- copy standalone output
- run on port 8080
- use non-root user
- command: `node server.js`

Expected Dockerfile:

```dockerfile
FROM node:22-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN \
  if [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm install --frozen-lockfile; \
  elif [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  else npm install; \
  fi

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run generate:mock-users
RUN \
  if [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm build; \
  elif [ -f yarn.lock ]; then yarn build; \
  else npm run build; \
  fi

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 8080

CMD ["node", "server.js"]
```

If `npm run generate:mock-users` should run before Docker build in CI instead, keep Dockerfile simpler and document the decision.

---

## GitHub Actions Requirements

Workflow path:

```txt
.github/workflows/deploy-cloud-run.yml
```

Required pipeline:

1. checkout
2. setup node
3. install dependencies
4. generate mock users
5. typecheck
6. unit tests
7. build
8. authenticate to GCP using Workload Identity Federation
9. configure Docker auth
10. build Docker image
11. push image to Artifact Registry
12. deploy to Cloud Run
13. print URL

Required permissions:

```yaml
permissions:
  contents: read
  id-token: write
```

Use these GitHub Variables:

```txt
GCP_PROJECT_ID
GCP_PROJECT_NUMBER
GCP_REGION
GCP_ARTIFACT_REPOSITORY
CLOUD_RUN_SERVICE
GCP_WORKLOAD_IDENTITY_PROVIDER
GCP_SERVICE_ACCOUNT
```

Recommended values:

```txt
GCP_REGION=asia-east1
GCP_ARTIFACT_REPOSITORY=tastemap-date
CLOUD_RUN_SERVICE=tastemap-date-web
GCP_SERVICE_ACCOUNT=github-deployer@PROJECT_ID.iam.gserviceaccount.com
GCP_WORKLOAD_IDENTITY_PROVIDER=projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/github-pool/providers/github-provider
```

Workflow:

```yaml
name: Deploy to Cloud Run

on:
  push:
    branches:
      - main
  workflow_dispatch:

env:
  PROJECT_ID: ${{ vars.GCP_PROJECT_ID }}
  REGION: ${{ vars.GCP_REGION }}
  REPOSITORY: ${{ vars.GCP_ARTIFACT_REPOSITORY }}
  SERVICE: ${{ vars.CLOUD_RUN_SERVICE }}
  IMAGE_NAME: tastemap-date-web

jobs:
  test-build-deploy:
    runs-on: ubuntu-latest

    permissions:
      contents: read
      id-token: write

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Generate mock users
        run: npm run generate:mock-users

      - name: Type check
        run: npm run typecheck

      - name: Unit tests
        run: npm run test

      - name: Build Next.js
        run: npm run build

      - name: Authenticate to Google Cloud
        uses: google-github-actions/auth@v3
        with:
          workload_identity_provider: ${{ vars.GCP_WORKLOAD_IDENTITY_PROVIDER }}
          service_account: ${{ vars.GCP_SERVICE_ACCOUNT }}

      - name: Setup gcloud
        uses: google-github-actions/setup-gcloud@v3

      - name: Configure Docker for Artifact Registry
        run: gcloud auth configure-docker $REGION-docker.pkg.dev --quiet

      - name: Build Docker image
        run: |
          docker build \
            -t $REGION-docker.pkg.dev/$PROJECT_ID/$REPOSITORY/$IMAGE_NAME:${{ github.sha }} \
            -t $REGION-docker.pkg.dev/$PROJECT_ID/$REPOSITORY/$IMAGE_NAME:latest \
            .

      - name: Push Docker image
        run: |
          docker push $REGION-docker.pkg.dev/$PROJECT_ID/$REPOSITORY/$IMAGE_NAME:${{ github.sha }}
          docker push $REGION-docker.pkg.dev/$PROJECT_ID/$REPOSITORY/$IMAGE_NAME:latest

      - name: Deploy to Cloud Run
        run: |
          gcloud run deploy $SERVICE \
            --image=$REGION-docker.pkg.dev/$PROJECT_ID/$REPOSITORY/$IMAGE_NAME:${{ github.sha }} \
            --region=$REGION \
            --platform=managed \
            --allow-unauthenticated \
            --service-account=tastemap-runner@$PROJECT_ID.iam.gserviceaccount.com \
            --set-env-vars="NEXT_PUBLIC_APP_ENV=production,NEXT_PUBLIC_STORAGE_MODE=local,STORAGE_MODE=local" \
            --set-secrets="ANTHROPIC_API_KEY=ANTHROPIC_API_KEY:latest"

      - name: Show Cloud Run URL
        run: |
          gcloud run services describe $SERVICE \
            --region=$REGION \
            --format='value(status.url)'
```

If using Firestore, change env vars:

```txt
NEXT_PUBLIC_STORAGE_MODE=firestore,STORAGE_MODE=firestore
```

---

## GCP Setup Commands

Create `docs/gcp-deploy.md` with these commands.

Enable services:

```bash
gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  secretmanager.googleapis.com \
  firestore.googleapis.com \
  iamcredentials.googleapis.com
```

Create Artifact Registry:

```bash
gcloud artifacts repositories create tastemap-date \
  --repository-format=docker \
  --location=asia-east1 \
  --description="Docker images for TasteMap Date MVP"
```

Create runtime service account:

```bash
gcloud iam service-accounts create tastemap-runner \
  --display-name="TasteMap Cloud Run runtime service account"
```

Grant Secret Manager access:

```bash
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:tastemap-runner@PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

Grant Firestore access only if using Firestore:

```bash
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:tastemap-runner@PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/datastore.user"
```

Create GitHub deployer:

```bash
gcloud iam service-accounts create github-deployer \
  --display-name="GitHub Actions deployer for TasteMap Date"
```

Grant deployer roles:

```bash
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:github-deployer@PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/artifactregistry.writer"

gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:github-deployer@PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud iam service-accounts add-iam-policy-binding \
  tastemap-runner@PROJECT_ID.iam.gserviceaccount.com \
  --member="serviceAccount:github-deployer@PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"
```

Create secret:

```bash
echo -n "your-anthropic-api-key" | gcloud secrets create ANTHROPIC_API_KEY \
  --data-file=-
```

If there is no key, still create a placeholder or remove `--set-secrets` from deploy command and rely on fallback.

---

## Workload Identity Federation Setup

Add to `docs/gcp-deploy.md`.

Create pool:

```bash
gcloud iam workload-identity-pools create github-pool \
  --project=PROJECT_ID \
  --location=global \
  --display-name="GitHub Actions Pool"
```

Create provider:

```bash
gcloud iam workload-identity-pools providers create-oidc github-provider \
  --project=PROJECT_ID \
  --location=global \
  --workload-identity-pool=github-pool \
  --display-name="GitHub Provider" \
  --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository,attribute.ref=assertion.ref" \
  --issuer-uri="https://token.actions.githubusercontent.com"
```

Allow repo to impersonate deployer service account:

```bash
gcloud iam service-accounts add-iam-policy-binding \
  github-deployer@PROJECT_ID.iam.gserviceaccount.com \
  --project=PROJECT_ID \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/github-pool/attribute.repository/GITHUB_OWNER/GITHUB_REPO"
```

---

## Testing Requirements

### Unit Tests

Ensure these pass:

```bash
npm run test
```

Required test coverage:

```txt
calculateZodiac
calculateMatchScore
date request local storage transition
AI fallback output shape
```

### E2E Test

Create basic Playwright test:

```txt
1. open landing page
2. go to onboarding
3. submit demo profile
4. open map
5. filter coffee
6. select candidate
7. generate invite advice
8. send date request
9. open inbox
10. accept request
```

If full e2e is unstable, at minimum test:

```txt
landing loads
map loads
profiles API returns items
```

---

## README Requirements

Update README with:

- project positioning
- tech stack
- architecture diagram
- local setup
- env vars
- mock data generation
- testing commands
- GCP deploy steps
- CI/CD explanation
- tradeoffs
- 3-minute demo script
- safety and privacy notes

---

## Final Local Verification

Run:

```bash
npm run generate:mock-users
npm run typecheck
npm run test
npm run build
```

Optional:

```bash
npx playwright install
npm run e2e
```

Docker check:

```bash
docker build -t tastemap-date-web .
docker run -p 8080:8080 --env NEXT_PUBLIC_APP_ENV=production --env NEXT_PUBLIC_STORAGE_MODE=local --env STORAGE_MODE=local tastemap-date-web
```

Open:

```txt
http://localhost:8080
```

---

## Acceptance Criteria

Phase 3 is done only if:

- Docker build passes
- local container runs
- GitHub Actions file exists
- GCP deploy doc exists
- README is interview-readable
- tests pass or failing tests are documented
- Cloud Run deploy command is ready
- demo script can be delivered in 3 minutes

Commit message suggestion:

```bash
git add .
git commit -m "chore: add gcp deployment ci and demo polish"
```
