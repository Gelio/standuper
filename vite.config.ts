/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import { playwright } from "@vitest/browser-playwright";
import solid from "vite-plugin-solid";
import tailwind from "@tailwindcss/vite";

export default defineConfig({
  plugins: [solid(), tailwind()],
  test: {
    // NOTE: neither project needs jsdom/happy-dom.
    // Browser tests run in a real browser using Playwright.
    // Unit tests do not rely on DOM APIs.
    environment: "node",

    projects: [
      {
        extends: true,
        test: {
          name: "browser",
          include: ["src/**/*.test.tsx"],
          browser: {
            enabled: true,
            testerHtmlPath: "./index.test.html",
            provider: playwright(),
            // https://vitest.dev/guide/browser/playwright
            instances: [{ browser: "chromium" }],
          },
        },
      },
      {
        extends: true,
        test: {
          name: "unit",
          include: ["src/**/*.test.ts"],
        },
      },
    ],
  },
});
