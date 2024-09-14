/// <reference types="vitest" />
import { resolve } from "node:path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [react()],
  test: {
    // ... Specify options here.
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/tests/setup.ts"
  },
  resolve: {
    alias: [{ find: "@", replacement: resolve(__dirname, "./src") }]
  }
})
