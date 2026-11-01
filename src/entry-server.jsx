import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import App from "./App.jsx";
import { homePage, notFoundPage } from "./lib/content.js";
import { headTags, renderHead } from "./lib/seo.js";

export { siteFiles } from "./lib/seo.js";

const pages = [homePage, notFoundPage];

export const routes = pages.map((page) => page.path);

export function render(url) {
  const page = pages.find((candidate) => candidate.path === url) ?? notFoundPage;
  const html = renderToString(
    <StrictMode>
      <StaticRouter
        location={url}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <App />
      </StaticRouter>
    </StrictMode>
  );
  return { html, head: renderHead(headTags(page)) };
}
