export const env = {
  appEnv: process.env.NEXT_PUBLIC_APP_ENV ?? "development",
  storageMode: (process.env.NEXT_PUBLIC_STORAGE_MODE ?? "local") as "local" | "firestore",
  storageModeServer: (process.env.STORAGE_MODE ?? "local") as "local" | "firestore",
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  googleCloudProject: process.env.GOOGLE_CLOUD_PROJECT,
} as const;
