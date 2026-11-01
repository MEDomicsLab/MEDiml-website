import { useEffect, useState } from "react";

export default function useScrollSpy(ids, pathname) {
  const [active, setActive] = useState(null);
  const key = ids.join("|");

  useEffect(() => {
    const targets = key
      .split("|")
      .map((id) => id && document.getElementById(id))
      .filter(Boolean);
    if (!targets.length || !("IntersectionObserver" in window)) return undefined;
    const visible = new Map();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => visible.set(entry.target.id, entry.isIntersecting));
        const current = targets.find((target) => visible.get(target.id));
        setActive(current ? current.id : null);
      },
      { rootMargin: "-38% 0px -58% 0px" }
    );
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [key, pathname]);

  return active;
}
