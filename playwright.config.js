import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.js",
  fullyParallel: true,
  use: { baseURL: "http://localhost:4173", trace: "retain-on-failure" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    {
      name: "mobile",
      use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" },
    },
    {
      name: "webkit-iphone",
      testMatch: "**/audio.spec.js",
      use: { ...devices["iPhone 13"] },
    },
  ],
  webServer: {
    command: "npm start",
    url: "http://localhost:4173",
    reuseExistingServer: !process.env.CI,
  },
});
