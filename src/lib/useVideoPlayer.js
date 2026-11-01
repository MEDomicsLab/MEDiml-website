import { useEffect, useRef, useState } from "react";
import { loadYouTube } from "./youtube.js";

export default function useVideoPlayer(frame, source, title) {
  const player = useRef(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const host = frame.current;
    if (!source || !host) return;
    let disposed = false;
    let instance;
    const iframe = document.createElement("iframe");
    iframe.src = source;
    iframe.title = title;
    iframe.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframe.allowFullscreen = true;
    host.replaceChildren(iframe);
    setReady(false);
    setPlaying(false);
    loadYouTube()
      .then((YT) => {
        if (disposed) return;
        instance = new YT.Player(iframe, {
          events: {
            onReady: ({ target }) => {
              if (disposed) return;
              player.current = target;
              setReady(true);
              target.playVideo();
            },
            onStateChange: ({ data }) => {
              if (disposed) return;
              setPlaying(data === YT.PlayerState.PLAYING || data === YT.PlayerState.BUFFERING);
            },
            onError: () => {
              if (!disposed) setReady(false);
            },
          },
        });
      })
      .catch(() => {
        if (!disposed) setReady(false);
      });
    return () => {
      disposed = true;
      player.current = null;
      instance?.destroy();
      host.replaceChildren();
    };
  }, [frame, source, title]);

  const toggle = () => {
    if (!ready) return;
    if (playing) player.current?.pauseVideo();
    else player.current?.playVideo();
  };

  return { ready, playing, toggle };
}
