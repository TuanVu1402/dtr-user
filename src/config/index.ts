import { env } from './env';

export const config = {
  app: {
    version: env.VITE_APP_VERSION,
    environment: env.VITE_APP_ENV,
    isDevelopment: env.VITE_APP_ENV === 'development',
    isProduction: env.VITE_APP_ENV === 'production',
  },

  api: {
    baseUrl: env.VITE_API_URL,
    timeout: env.VITE_API_TIMEOUT,
  },

  features: {
    devtools: env.VITE_ENABLE_DEVTOOLS,
  },
} as const;

// Convenience helpers
export const isDev = config.app.isDevelopment;
export const isProd = config.app.isProduction;

// App metadata
export const APP_NAME = 'DTR Point';
export const APP_DESCRIPTION = 'Hệ thống quản lý chấm công';

// API helpers
export const API_TIMEOUT = config.api.timeout;
export const API_BASE_URL = config.api.baseUrl;
