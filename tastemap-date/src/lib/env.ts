export const env = {
  appEnv: process.env.NEXT_PUBLIC_APP_ENV ?? "development",
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  googleCloudProject: process.env.GOOGLE_CLOUD_PROJECT,
} as const;
