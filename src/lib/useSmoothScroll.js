import { useEffect } from "react";
import Lenis from "lenis";
import { setLenis } from "./scroll.js";

const QUERY = "(min-width: 768px) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

export default function useSmoothScroll() {
  useEffect(() => {
    const media = window.matchMedia(QUERY);
    let dispose = () => {};
    const update = () => {
      dispose();
      dispose = () => {};
      if (!media.matches) return;
      const lenis = new Lenis({ smoothWheel: true, lerp: 0.085 });
      setLenis(lenis);
      let frame = 0;
      const loop = (time) => {
        lenis.raf(time);
        frame = requestAnimationFrame(loop);
      };
      const visibility = () => {
        cancelAnimationFrame(frame);
        if (!document.hidden) frame = requestAnimationFrame(loop);
      };
      visibility();
      document.addEventListener("visibilitychange", visibility);
      dispose = () => {
        cancelAnimationFrame(frame);
        document.removeEventListener("visibilitychange", visibility);
        setLenis(null);
        lenis.destroy();
      };
    };
    update();
    media.addEventListener("change", update);
    return () => {
      dispose();
      media.removeEventListener("change", update);
    };
  }, []);
}
