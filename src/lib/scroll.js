let instance = null;

export const setLenis = (lenis) => {
  instance = lenis;
};

export const getLenis = () => instance;

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const headerOffset = () => {
  const header = document.querySelector("[data-site-header]");
  return (header?.offsetHeight ?? 0) + 16;
};

export function scrollToElement(element, { immediate = false, offset: custom } = {}) {
  if (!element) return;
  const offset = custom ?? -headerOffset();
  if (instance) {
    instance.scrollTo(element, { offset, immediate: immediate || reduced(), duration: 1.15 });
    return;
  }
  const top = element.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior: immediate || reduced() ? "instant" : "smooth" });
}

export function scrollToY(top) {
  if (instance) {
    instance.scrollTo(top, { immediate: reduced(), duration: 1.1 });
    return;
  }
  window.scrollTo({ top, behavior: reduced() ? "instant" : "smooth" });
}

export function scrollToId(id, options) {
  scrollToElement(document.getElementById(decodeURIComponent(id)), options);
}

export function scrollToTop() {
  instance?.scrollTo(0, { immediate: true, force: true });
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  instance?.reset();
}
