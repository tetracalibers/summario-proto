import { defineConfig } from "vitest/config"
import { playwright } from "@vitest/browser-playwright"
import { resolve } from "path"

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          include: ["app/**/ui.{test,spec}.ts"],
          name: "ui",
          environment: "node",
          alias: {
            "~": resolve(__dirname, "./app")
          }
        }
      },
      {
        test: {
          include: ["app/libs/tiptap-editor/extensions/**/*.{test,spec}.ts"],
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
