import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npm run preview -- --host 127.0.0.1",
    port: 4173,
    reuseExistingServer: true,
  },
  projects: [
    {
      name: "chromium-desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 720 } },
    },
    { name: "chromium-mobile", use: { ...devices["Pixel 7"] } },
  ],
});
