import { site } from "./content.js";
import { fill } from "./tokens.js";

export function resolveHref(href) {
  if (typeof href !== "string") return href;
  if (!href.startsWith("@")) return fill(href);
  const [name, ...rest] = href.slice(1).split("/");
  const base = site.links[name];
  if (base === undefined) {
    console.warn(`Unknown link "@${name}": add it to site.json → links`);
    return "#";
  }
  return fill(rest.length ? `${base.replace(/\/$/, "")}/${rest.join("/")}` : base);
}

export const isExternal = (url = "") => /^(https?:)?\/\//.test(url);

export const isFile = (url = "") =>
  /\.(pdf|zip|exe|dmg|deb|rpm|appimage|msi|tar\.gz)(\?.*)?$/i.test(url);

export function iconFor(link) {
  if (link.icon) return link.icon;
  const url = link.to ?? resolveHref(link.href) ?? "";
  if (url.startsWith("mailto:")) return "mail";
  if (isFile(url)) return "download";
  if (link.to) return "arrowRight";
  return "arrowUpRight";
}
