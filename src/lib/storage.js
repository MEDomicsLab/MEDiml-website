import { site } from "./content.js";

export const storageKey = (name, suffix) =>
  `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${suffix}`;

export const keys = {
  theme: storageKey(site.brand.name, "theme"),
  banner: storageKey(site.brand.name, "banner"),
};

export function read(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function write(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    return;
  }
}
