import { useEffect } from "react";
import { getLenis } from "./scroll.js";

export default function useModalNavigation({ open, root, trigger, onClose }) {
  useEffect(() => {
    if (!open) return undefined;
    const html = document.documentElement;
    const overflow = html.style.overflow;
    const background = [...document.querySelectorAll("main, footer, .skip-link")];
    const previous = background.map((node) => node.inert);
    const lenis = getLenis();
    const wasStopped = lenis?.isStopped;
    background.forEach((node) => {
      node.inert = true;
    });
    html.style.overflow = "hidden";
    lenis?.stop();

    const handleKey = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        trigger.current?.focus();
      }
      if (event.key !== "Tab") return;
      const focusable = [
        ...root.current.querySelectorAll("a[href], button:not([disabled])"),
      ].filter((node) => !node.closest("[inert]") && node.getClientRects().length);
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      html.style.overflow = overflow;
      background.forEach((node, index) => {
        node.inert = previous[index];
      });
      if (!wasStopped) lenis?.start();
      document.removeEventListener("keydown", handleKey);
    };
  }, [open, root, trigger, onClose]);
}
