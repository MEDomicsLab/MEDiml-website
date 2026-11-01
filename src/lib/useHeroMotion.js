import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useIsoLayoutEffect from "./useIsoLayoutEffect.js";

gsap.registerPlugin(ScrollTrigger);

export default function useHeroMotion({ scene, copy, stage, expand, classes }) {
  useIsoLayoutEffect(() => {
    const canvas = stage.current;
    const container = scene.current;
    const content = copy.current;
    if (!canvas || !container || !content) return undefined;

    const main = canvas.querySelector(`.${classes.main}`);
    const inset = canvas.querySelector(`.${classes.inset}`);
    const badges = canvas.querySelectorAll(`.${classes.badge}`);
    const controls = [
      ...content.querySelectorAll("[data-hero-actions] a, [data-hero-actions] button"),
    ];
    const media = gsap.matchMedia();

    media.add(
      {
        desktop: "(min-width: 1012px) and (min-height: 650px)",
        parallax: "(min-width: 768px)",
        motion: "(prefers-reduced-motion: no-preference)",
      },
      ({ conditions }) => {
        if (!conditions.motion) return undefined;

        if (expand && conditions.desktop) {
          const frame = canvas.parentElement;
          const timeline = gsap.timeline({
            defaults: { ease: "power2.inOut", duration: 1 },
            onUpdate() {
              const cover = canvas.getBoundingClientRect();
              controls.forEach((control) => {
                const bounds = control.getBoundingClientRect();
                const covered =
                  bounds.right > cover.left &&
                  bounds.left < cover.right &&
                  bounds.bottom > cover.top &&
                  bounds.top < cover.bottom;
                if (control.inert !== covered) control.inert = covered;
              });
            },
            scrollTrigger: {
              trigger: container,
              start: () => `top ${Math.min(window.innerHeight * 0.16, 150)}px`,
              end: () => `+=${Math.min(container.offsetHeight * 0.85, window.innerHeight * 0.6)}`,
              pin: true,
              scrub: 0.35,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          timeline.fromTo(
            content,
            { x: 0, y: 0, scale: 1, opacity: 1, transformOrigin: "right center" },
            {
              x: () => container.clientWidth * 0.42,
              y: () => container.clientHeight * 0.06,
              scale: 0.78,
              opacity: 0,
              duration: 0.75,
            },
            0
          );
          timeline.fromTo(
            canvas,
            {
              x: 0,
              y: 0,
              width: () => frame.clientWidth,
              height: () => frame.clientHeight,
            },
            {
              x: () => container.getBoundingClientRect().left - frame.getBoundingClientRect().left,
              y: () => -frame.offsetTop,
              width: () => container.clientWidth,
              height: () => container.clientHeight,
            },
            0
          );
          if (main) {
            timeline.fromTo(
              main,
              { left: "20%", top: "14%", width: "96%", yPercent: 0 },
              { left: "21%", top: "13%", width: "72%", yPercent: 0 },
              0
            );
          }
          if (inset) {
            timeline.fromTo(
              inset,
              { left: "6%", width: "36%", yPercent: 0 },
              { left: "5.5%", width: "25%", yPercent: -3 },
              0
            );
          }
        } else if (conditions.parallax) {
          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: canvas,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
            },
          });
          if (main) timeline.fromTo(main, { yPercent: 4 }, { yPercent: -6, ease: "none" }, 0);
          if (inset) timeline.fromTo(inset, { yPercent: 14 }, { yPercent: -14, ease: "none" }, 0);
          if (badges.length) timeline.fromTo(badges, { y: 24 }, { y: -32, ease: "none" }, 0);
        }

        return () => {
          controls.forEach((control) => {
            control.inert = false;
          });
        };
      }
    );

    return () => media.revert();
  }, [scene, copy, stage, expand, classes]);
}
