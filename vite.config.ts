import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import vitePluginString from "vite-plugin-string";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      formats: ["cjs", "es"],
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "r3f-vrm",
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: (id) => !id.startsWith(".") && !path.isAbsolute(id),
    },
    sourcemap: true,
    emptyOutDir: true,
  },
  plugins: [react(), vitePluginString(), dts()],
});
