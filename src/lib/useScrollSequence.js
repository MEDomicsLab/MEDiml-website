import { useCallback, useEffect, useRef } from "react";
import { scrollToY } from "./scroll.js";
import useMediaQuery from "./useMediaQuery.js";

export const SCROLL_SEQUENCE_QUERY =
  "(min-width: 1012px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)";

export default function useScrollSequence({ count, enabled = true, onSelect, onProgress }) {
  const scroller = useRef(null);
  const supported = useMediaQuery(SCROLL_SEQUENCE_QUERY);
  const pinned = enabled && supported;

  useEffect(() => {
    const node = scroller.current;
    if (!node || !pinned || !count) return undefined;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const span = node.offsetHeight - window.innerHeight;
      if (span <= 0) return;
      const progress = Math.min(Math.max(-node.getBoundingClientRect().top / span, 0), 0.9999);
      const position = progress * count;
      onSelect(Math.floor(position));
      onProgress?.(position);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [pinned, count, onSelect, onProgress]);

  const go = useCallback(
    (index) => {
      const node = scroller.current;
      if (!pinned || !node) {
        onSelect(index);
        return;
      }
      const span = node.offsetHeight - window.innerHeight;
      const top = node.getBoundingClientRect().top + window.scrollY;
      scrollToY(top + ((index + 0.08) / count) * span);
    },
    [pinned, count, onSelect]
  );

  return { scroller, pinned, supported, go };
}
