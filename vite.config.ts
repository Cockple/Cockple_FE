/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
  const isProduction = mode === "production";

  return {
    plugins: [
      react(),
      svgr(),
      tailwindcss(),
      VitePWA({
        registerType: "autoUpdate",
        // 개발에서도 PWA 테스트할 수 있게
        devOptions: {
          enabled: true,
        },
        manifest: {
          name: "콕플:Cockple",
          short_name: "Cockple",
          description: "배드민턴을 위한 가장 스마트한 모임 플랫폼",
          start_url: "/",
          display: "standalone",
          background_color: "#ffffff",
          theme_color: "#ffffff",
          lang: "ko",
          icons: [
            {
              src: "icons/app_icon.png",
              sizes: "192x192",
              type: "image/png",
              purpose: "any maskable",
            },
            {
              src: "icons/app_icon.png",
              sizes: "512x512",
              type: "image/png",
            },
          ],
        },
        // 필요하면 캐싱 전략 등을 여기서 workbox로 커스터마이즈 가능
        // workbox: { /* runtimeCaching 등 */ },
      }),
    ],

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
      global: "globalThis",
    },

    // vitest / storybook 테스트 설정은 prod가 아닐 때만 포함
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
                instances: [{ browser: "chromium" }],
              },
              setupFiles: [".storybook/vitest.setup.ts"],
            },
          },
        ],
      },
    }),
  };
});
