/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LEADS_ENDPOINT?: string
  readonly VITE_SITE_ORIGIN?: string
  readonly BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

/** Отпечатки файлов из `public/photos`, подставляются при сборке. */
declare const __PHOTO_FINGERPRINTS__: Record<string, string>
