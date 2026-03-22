/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_DEFAULT_LANGUAGE: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_APT_CHAT_BOT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
