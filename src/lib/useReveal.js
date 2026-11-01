import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function useReveal(scope) {
  const { pathname } = useLocation();
  useEffect(() => {
    const root = scope.current;
    if (!root) return undefined;
    const pending = () => root.querySelectorAll("[data-reveal]:not([data-revealed])");
    if (!("IntersectionObserver" in window)) {
      pending().forEach((node) => node.setAttribute("data-revealed", ""));
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.setAttribute("data-revealed", "");
          observer.unobserve(entry.target);
        }),
      { rootMargin: "0px 0px -8% 0px" }
    );
    const watch = () => pending().forEach((node) => observer.observe(node));
    watch();
    const mutations = new MutationObserver(watch);
    mutations.observe(root, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
  }, [scope, pathname]);
}
