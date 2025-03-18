import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import { viteSingleFile } from "vite-plugin-singlefile";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const plugins: any[] = [tailwindcss(), react()];
const standalone = !!process.env.VITE_RR_STANDALONE;
if (standalone) {
  plugins.push(viteSingleFile());
}

export default defineConfig({
  plugins,
  build: {
    outDir: standalone ? "dist-standalone" : "dist",
  },
});
