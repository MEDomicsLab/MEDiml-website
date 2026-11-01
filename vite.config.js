import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import theme from "./scripts/theme.mjs";

const root = path.dirname(fileURLToPath(import.meta.url));

const scopedName = (local, file) => {
  const component = path.basename(file).replace(/\.module\.css(\?.*)?$/, "");
  const hash = crypto
    .createHash("md5")
    .update(`${path.relative(root, file)}:${local}`)
    .digest("base64url")
    .slice(0, 5);
  return `${component}_${local}__${hash}`;
};

export default defineConfig({
  plugins: [react(), theme()],
  css: { modules: { localsConvention: "camelCaseOnly", generateScopedName: scopedName } },
  server: { port: 5176 },
  preview: { port: 4176 },
  ssr: { noExternal: ["gsap"] },
});
