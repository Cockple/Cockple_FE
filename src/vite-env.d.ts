/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />
interface ImportMetaEnv {
  readonly VITE_SERVER_API_URL: string;
  readonly VITE_KAKAO_REST_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
