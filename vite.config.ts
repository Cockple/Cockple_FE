/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";

// https://vite.dev/config/
// ✅ defineConfig에 함수를 전달하여 'mode'를 받아옵니다.
export default defineConfig(({ mode }) => {
  const isProduction = mode === "production";

  return {
    plugins: [react(), svgr(), tailwindcss()],
    assetsInclude: ["**/*.svg"],

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
    define: {
      global: "globalThis", // 또는 'window'
      // 'process.env': {},           // (혹시 'process is not defined' 뜨면 주석 해제)
    },

    // ✅ 프로덕션 빌드가 아닐 때만 test 설정을 포함시킵니다.
    ...(!isProduction && {
      test: {
        projects: [
          {
            extends: true,
            plugins: [
              storybookTest({
                configDir: fileURLToPath(
                  new URL("./.storybook", import.meta.url),
                ),
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
    }),
  };
});
