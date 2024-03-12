import { defineConfig } from "vite"
import { resolve } from "path"
import solidPlugin from "vite-plugin-solid"
import dts from "vite-plugin-dts"


// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/main.ts"),
      formats: ["es"],
      fileName: "main",
    },
    rollupOptions: {
      external: ["solid-js", "solid-js/web", "@solidjs/start"]
    },
  },
  resolve: { alias: { src: resolve("src/") } },
  plugins: [dts(), solidPlugin()],
})
