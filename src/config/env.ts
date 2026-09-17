function readEnv() {
  const raw = import.meta.env
  const timeout = Number(raw.VITE_API_TIMEOUT ?? 10000)

  return {
    VITE_APP_VERSION: raw.VITE_APP_VERSION || '1.0.0',
    VITE_APP_ENV: raw.VITE_APP_ENV === 'production' ? ('production' as const) : ('development' as const),
    VITE_API_URL: raw.VITE_API_URL || 'http://localhost:8010/v1',
    VITE_API_TIMEOUT: Number.isFinite(timeout) && timeout > 0 ? timeout : 10000,
    VITE_ENABLE_DEVTOOLS: String(raw.VITE_ENABLE_DEVTOOLS ?? 'true') !== 'false',
  }
}

export const env = readEnv()
