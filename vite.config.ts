/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr(), tailwindcss()],

  // @ 경로 별칭을 ESM 표준 방식으로 수정
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    extensions: [".js", ".ts", ".jsx", ".tsx"],
  },

  optimizeDeps: {
    include: ["swiper", "swiper/react"],
  },
  server: {
    host: true,
  },
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          storybookTest({
            // ✅ 이 부분도 ESM 방식으로 경로를 지정하여 일관성 유지
            configDir: fileURLToPath(new URL("./.storybook", import.meta.url)),
          }),
        ],

        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: "playwright",
            instances: [
              {
                browser: "chromium",
              },
            ],
          },
          setupFiles: [".storybook/vitest.setup.ts"],
        },
      },
    ],
  },
});
