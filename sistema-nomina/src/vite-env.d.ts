/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_UPLOAD_MAX_MB: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}