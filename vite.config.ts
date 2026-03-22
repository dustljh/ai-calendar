import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// 화살표 함수 형태로 바꿔서 ({ mode })를 인자로 받아야 합니다.
export default defineConfig(({ mode }) => {
  return {
    base: mode === 'production' && process.env.GITHUB_ACTIONS ? "/ai-calendar/" : "/",

    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      port: 5173,
      strictPort: true,
    },
  };
});
