# GCP Deploy Guide for TasteMap Date

This project is now wired to the following Google Cloud project:

- Project name: `tastemap-date`
- Project ID: `tastemap-date-494806`
- Project number: `1048249578662`
- Region: `asia-east1`
- GitHub repository: `ShackArbeit/MapFeeling`

## Current GCP Status

The following resources have already been created:

- Artifact Registry repository: `tastemap-date`
- Runtime service account: `tastemap-runner@tastemap-date-494806.iam.gserviceaccount.com`
- GitHub deployer service account: `github-deployer@tastemap-date-494806.iam.gserviceaccount.com`
- Workload Identity Pool: `github-pool`
- Workload Identity Provider: `github-provider`
## Enabled Services

These APIs have been enabled on `tastemap-date-494806`:

```bash
gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  firestore.googleapis.com \
  iamcredentials.googleapis.com \
  --project=tastemap-date-494806
```

## Resource Commands

Artifact Registry:

```bash
gcloud artifacts repositories create tastemap-date \
  --repository-format=docker \
  --location=asia-east1 \
  --description="Docker images for TasteMap Date MVP" \
  --project=tastemap-date-494806
```

Runtime service account:

```bash
gcloud iam service-accounts create tastemap-runner \
  --display-name="TasteMap Cloud Run runtime service account" \
  --project=tastemap-date-494806
```

Optional Firestore access:

```bash
gcloud projects add-iam-policy-binding tastemap-date-494806 \
  --member="serviceAccount:tastemap-runner@tastemap-date-494806.iam.gserviceaccount.com" \
  --role="roles/datastore.user"
```

GitHub deployer service account:

```bash
gcloud iam service-accounts create github-deployer \
  --display-name="GitHub Actions deployer for TasteMap Date" \
  --project=tastemap-date-494806
```

Grant deployer roles:

```bash
gcloud projects add-iam-policy-binding tastemap-date-494806 \
  --member="serviceAccount:github-deployer@tastemap-date-494806.iam.gserviceaccount.com" \
  --role="roles/artifactregistry.writer"

gcloud projects add-iam-policy-binding tastemap-date-494806 \
  --member="serviceAccount:github-deployer@tastemap-date-494806.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud iam service-accounts add-iam-policy-binding \
  tastemap-runner@tastemap-date-494806.iam.gserviceaccount.com \
  --member="serviceAccount:github-deployer@tastemap-date-494806.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser" \
  --project=tastemap-date-494806
```

## Workload Identity Federation

Create pool:

```bash
gcloud iam workload-identity-pools create github-pool \
  --project=tastemap-date-494806 \
  --location=global \
  --display-name="GitHub Actions Pool"
```

Create provider:

```bash
gcloud iam workload-identity-pools providers create-oidc github-provider \
  --project=tastemap-date-494806 \
  --location=global \
  --workload-identity-pool=github-pool \
  --display-name="GitHub Provider" \
  --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository,attribute.ref=assertion.ref" \
  --attribute-condition="assertion.repository=='ShackArbeit/MapFeeling'" \
  --issuer-uri="https://token.actions.githubusercontent.com"
```

Allow the GitHub repository to impersonate the deployer account:

```bash
gcloud iam service-accounts add-iam-policy-binding \
  github-deployer@tastemap-date-494806.iam.gserviceaccount.com \
  --project=tastemap-date-494806 \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/1048249578662/locations/global/workloadIdentityPools/github-pool/attribute.repository/ShackArbeit/MapFeeling"
```

## GitHub Actions Variables & Secrets

The workflow expects these repository **variables** in GitHub Actions (Settings → Secrets and variables → Actions → Variables):

| Variable | Value |
|---|---|
| `GCP_PROJECT_ID` | `tastemap-date-494806` |
| `GCP_PROJECT_NUMBER` | `1048249578662` |
| `GCP_REGION` | `asia-east1` |
| `GCP_ARTIFACT_REPOSITORY` | `tastemap-date` |
| `CLOUD_RUN_SERVICE` | `tastemap-date-web` |
| `GCP_SERVICE_ACCOUNT` | `github-deployer@tastemap-date-494806.iam.gserviceaccount.com` |
| `GCP_WORKLOAD_IDENTITY_PROVIDER` | `projects/1048249578662/locations/global/workloadIdentityPools/github-pool/providers/github-provider` |

And this repository **secret** (Settings → Secrets and variables → Actions → Secrets):

| Secret | Value |
|---|---|
| `ANTHROPIC_API_KEY` | Your Anthropic API key (`sk-ant-...`) |

## Manual Deploy

Build and push:

```bash
docker build -t asia-east1-docker.pkg.dev/tastemap-date-494806/tastemap-date/tastemap-date-web:latest .
docker push asia-east1-docker.pkg.dev/tastemap-date-494806/tastemap-date/tastemap-date-web:latest
```

Deploy to Cloud Run:

```bash
gcloud run deploy tastemap-date-web \
  --image=asia-east1-docker.pkg.dev/tastemap-date-494806/tastemap-date/tastemap-date-web:latest \
  --region=asia-east1 \
  --platform=managed \
  --allow-unauthenticated \
  --service-account=tastemap-runner@tastemap-date-494806.iam.gserviceaccount.com \
  --set-env-vars="NEXT_PUBLIC_APP_ENV=production,NEXT_PUBLIC_STORAGE_MODE=local,STORAGE_MODE=local,ANTHROPIC_API_KEY=YOUR_KEY" \
  --project=tastemap-date-494806
```

Check the deployed URL:

```bash
gcloud run services describe tastemap-date-web \
  --region=asia-east1 \
  --format='value(status.url)' \
  --project=tastemap-date-494806
```
