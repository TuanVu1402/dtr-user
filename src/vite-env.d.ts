/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_ENV: 'development' | 'production';
  readonly VITE_APP_VERSION: string;
  readonly VITE_API_URL: string;
  readonly VITE_API_TIMEOUT: string;
  readonly VITE_ENABLE_DEVTOOLS: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}