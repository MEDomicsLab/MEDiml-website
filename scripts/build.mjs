import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { build } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
const dist = path.join(root, "dist");
const server = path.join(root, "dist-ssr");

await build({ root, logLevel: "warn" });
await build({
  root,
  logLevel: "warn",
  build: { ssr: "src/entry-server.jsx", outDir: server, emptyOutDir: true },
});

const { render, routes, siteFiles } = await import(
  pathToFileURL(path.join(server, "entry-server.js")).href
);
const template = await fs.readFile(path.join(dist, "index.html"), "utf8");

for (const route of routes) {
  const { html, head } = render(route);
  const page = template
    .replace('<template id="app-head"></template>', head)
    .replace('<div id="root"></div>', `<div id="root" data-route="${route}">${html}</div>`);
  const file =
    route === "/"
      ? "index.html"
      : route === "/404"
        ? "404.html"
        : path.join(route.slice(1), "index.html");
  await fs.mkdir(path.dirname(path.join(dist, file)), { recursive: true });
  await fs.writeFile(path.join(dist, file), page);
  console.log(`prerendered ${route} → dist/${file}`);
}

for (const [name, content] of Object.entries(siteFiles())) {
  await fs.writeFile(path.join(dist, name), content);
}
await fs.rm(server, { recursive: true, force: true });
console.log("wrote sitemap.xml and robots.txt");
