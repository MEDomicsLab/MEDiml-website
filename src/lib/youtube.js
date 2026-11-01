import { resolveHref } from "./links.js";

let pending;

export function loadYouTube() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (pending) return pending;
  pending = new Promise((resolve, reject) => {
    const previous = window.onYouTubeIframeAPIReady;
    const script = document.createElement("script");
    window.onYouTubeIframeAPIReady = () => {
      resolve(window.YT);
      previous?.();
    };
    script.src = resolveHref("@youtubeApi");
    script.onerror = () => {
      pending = undefined;
      window.onYouTubeIframeAPIReady = previous;
      script.remove();
      reject();
    };
    document.head.append(script);
  });
  return pending;
}
