/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_JWT_TOKEN: string
  readonly VITE_COMPONENT_DATA_URL: string
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
