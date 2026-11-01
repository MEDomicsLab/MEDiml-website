import { site } from "./content.js";

const GLOBALS = { name: site.brand.name, version: site.brand.version };

export const fill = (template = "", values = {}) =>
  String(template).replace(/\{(\w+)\}/g, (match, key) =>
    key in values ? String(values[key]) : key in GLOBALS ? String(GLOBALS[key]) : match
  );
