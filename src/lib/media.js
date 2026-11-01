import { resolveHref } from "./links.js";

export const fitFor = (image) =>
  image.fit ??
  (image.width && image.height && image.width / image.height < 1.25 ? "contain" : "bleed");

export const embedUrl = ({ youtube, playlist }, origin) => {
  const url = new URL(
    playlist ? "videoseries" : encodeURIComponent(youtube),
    resolveHref("@youtubeEmbed")
  );
  if (playlist) url.searchParams.set("list", playlist);
  url.searchParams.set("autoplay", "1");
  url.searchParams.set("rel", "0");
  url.searchParams.set("enablejsapi", "1");
  url.searchParams.set("playsinline", "1");
  if (origin) url.searchParams.set("origin", origin);
  return url.href;
};
