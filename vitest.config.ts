import { defineConfig } from "vitest/config"
import { playwright } from "@vitest/browser-playwright"
import { resolve } from "path"

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          include: ["app/**/*.{test,spec}.ts"],
          exclude: ["app/**/*.browser.{test,spec}.ts"],
          name: "script",
          environment: "node",
          alias: {
            "~": resolve(__dirname, "./app")
          }
        }
      },
      {
        test: {
          include: ["app/**/*.browser.{test,spec}.ts"],
          name: "browser",
          alias: {
            "~": resolve(__dirname, "./app")
          },
          browser: {
            enabled: true,
            provider: playwright(),
            instances: [{ browser: "chromium" }]
          }
        }
      }
    ]
  }
})
