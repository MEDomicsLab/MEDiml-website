import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = fileURLToPath(new URL("..", import.meta.url));
const SRC = path.join(root, "assets");
const OUT = path.join(root, "public");
const read = async (file) => JSON.parse(await fs.readFile(path.join(root, file), "utf8"));
const site = await read("src/data/site.json");
const theme = await read("src/data/_shared/theme.json");

const exists = (file) =>
  fs.access(file).then(
    () => true,
    () => false
  );

const out = async (...parts) => {
  const file = path.join(OUT, ...parts);
  await fs.mkdir(path.dirname(file), { recursive: true });
  return file;
};

async function walk(dir) {
  if (!(await exists(dir))) return [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const full = path.join(dir, entry.name);
      return entry.isDirectory() ? walk(full) : [full];
    })
  );
  return nested.flat();
}

const IMAGE = /\.(png|jpe?g|webp|tiff?)$/i;

async function images() {
  const files = (await walk(path.join(SRC, "images"))).filter((file) => IMAGE.test(file));
  for (const file of files) {
    const relative = path.relative(SRC, file).replace(IMAGE, ".webp");
    const target = await out(relative);
    await sharp(file)
      .resize({ width: 2400, withoutEnlargement: true })
      .webp({ quality: 84, alphaQuality: 90 })
      .toFile(target);
    console.log(`image   ${path.relative(root, file)} → public/${relative}`);
  }
}

async function brand() {
  const dir = path.join(SRC, "brand");
  for (const name of ["logo", "logo-white"]) {
    const file = path.join(dir, `${name}.png`);
    if (!(await exists(file))) continue;
    await sharp(file)
      .resize({ width: 500, withoutEnlargement: true })
      .webp({ quality: 90, alphaQuality: 95 })
      .toFile(await out("images/brand", `${name}.webp`));
    console.log(`brand   assets/brand/${name}.png → public/images/brand/${name}.webp`);
  }
  const icon = path.join(dir, "icon.png");
  if (!(await exists(icon))) return;
  await sharp(icon)
    .resize(96, 96)
    .png()
    .toFile(await out("favicon.png"));
  const background = theme.light.bg;
  await sharp(icon)
    .resize(148, 148)
    .extend({ top: 16, bottom: 16, left: 16, right: 16, background })
    .flatten({ background })
    .png()
    .toFile(await out("apple-touch-icon.png"));
  console.log("brand   assets/brand/icon.png → public/favicon.png, public/apple-touch-icon.png");
}

async function textures() {
  const file = path.join(SRC, "textures", "accent.png");
  if (!(await exists(file))) return;
  await sharp(file)
    .webp({ quality: 80 })
    .toFile(await out("textures", "accent.webp"));
  console.log("texture assets/textures/accent.png → public/textures/accent.webp");
}

const escapeMarkup = (value) =>
  String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

async function text(content, { size, weight = 400, color, width }) {
  const family = theme.fonts.sans.split(",")[0].replaceAll(/['"]/g, "").trim();
  const face = theme.fontFaces.find((entry) => {
    const [low, high = low] = entry.weight.split(" ").map(Number);
    return entry.family === family && entry.style === "normal" && weight >= low && weight <= high;
  });
  return sharp({
    text: {
      text: `<span foreground="${color}" letter_spacing="${Math.round(size * -0.04 * 1024)}">${escapeMarkup(content)}</span>`,
      font: `${family} ${size}`,
      ...(face && { fontfile: path.join(OUT, face.src) }),
      width,
      rgba: true,
      dpi: 72,
    },
  })
    .png()
    .toBuffer();
}

async function socialImage() {
  const texture = path.join(OUT, theme.accent.texture);
  const logo = path.join(OUT, site.brand.logoInverse);
  if (!(await exists(texture))) return;
  const W = 1200;
  const H = 630;
  const cream = theme.light.onAccent;
  const base = await sharp(texture).resize(W, H, { fit: "cover" }).toBuffer();
  const tint = await sharp({
    create: { width: W, height: H, channels: 4, background: theme.accent.tint },
  })
    .png()
    .toBuffer();
  const paper = await sharp(path.join(OUT, theme.accent.paper))
    .resize(W, H, { fit: "cover" })
    .toBuffer();
  const layers = [
    { input: tint, blend: "over" },
    { input: paper, blend: "soft-light" },
  ];
  const name = await text(site.brand.name, {
    size: 190,
    weight: 600,
    color: cream,
    width: 900,
  });
  layers.push({ input: name, left: 72, top: 330 });
  const tagline = await text(site.seo.description, { size: 30, color: cream, width: 640 });
  layers.push({ input: tagline, left: 76, top: 92 });
  if (await exists(logo)) {
    const mark = await sharp(logo).resize(250, 250).toBuffer();
    layers.push({ input: mark, left: W - 250 - 64, top: 64 });
  }
  await sharp(base)
    .composite(layers)
    .png({ compressionLevel: 9 })
    .toFile(await out("images", "og.png"));
  console.log("social  public/images/og.png");
}

await images();
await brand();
await textures();
await socialImage();
