/// <reference types="vitest" />

import { reactRouter } from "@react-router/dev/vite"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"
import babel from "vite-plugin-babel"

export default defineConfig({
  plugins: [
    babel({
      filter: /\.(t|j)sx?$/,
      exclude: [/node_modules/],
      apply: "serve", // 開発時のみ
      babelConfig: {
        presets: ["@babel/preset-typescript"],
        plugins: ["jotai/babel/plugin-react-refresh", "jotai/babel/plugin-debug-label"]
      }
    }),
    reactRouter(),
    tsconfigPaths()
  ],
  ssr: {
    noExternal: ["jotai-devtools"]
  },
  test: {
    globals: true
  }
})
