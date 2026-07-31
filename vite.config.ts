import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// GitHub Pages 把站点挂在 /<repo>/ 子路径下，构建产物必须带同样的 base；
// 本地 dev 仍走根路径。部署到根路径的托管（自定义域名等）时设 DEPLOY_BASE=/。
// 按 mode 而非 command 判断：dev 是 development，build 与 preview 都是 production，
// 这样 `vite preview` 也能以正确的 base 预览生产构建（用 command 判断会漏掉 preview，
// 导致 dist 里的子路径资源全部 404）。vitest 的 mode 为 test，走 "/" 分支。
export default defineConfig(({ mode }) => ({
  base: mode === "production" ? (process.env.DEPLOY_BASE ?? "/decisive-moments/") : "/",
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["src/test/setup.ts"],
    globals: true,
    exclude: ["tests/**", "node_modules/**", "dist/**"],
  },
}));
