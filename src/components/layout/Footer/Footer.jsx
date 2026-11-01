import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { site, ui } from "../../../lib/content.js";
import { cx } from "../../../lib/cx.js";
import { scrollToTop } from "../../../lib/scroll.js";
import { fill } from "../../../lib/tokens.js";
import useIsoLayoutEffect from "../../../lib/useIsoLayoutEffect.js";
import Logo from "../../brand/Logo/Logo.jsx";
import SmartLink from "../../ui/SmartLink/SmartLink.jsx";
import styles from "./Footer.module.css";

gsap.registerPlugin(ScrollTrigger);

const navLinks = (items) =>
  items.flatMap((item) => [...(item.to || item.href ? [item] : []), ...(item.children ?? [])]);

function FooterLink({ link }) {
  return (
    <SmartLink link={link} className={link.disabled ? styles.disabled : undefined}>
      {fill(link.label)}
    </SmartLink>
  );
}

function Credit({ credit }) {
  const label = <span className={styles.shiny}>{fill(credit.label)}</span>;
  if (!credit.href && !credit.to) return label;
  return (
    <SmartLink link={credit} className={styles.credit}>
      {label}
    </SmartLink>
  );
}

export default function Footer() {
  const { footer, nav, brand } = site;
  const element = useRef(null);
  const word = fill(footer.wordmark ?? brand.name);
  const columns = footer.columns.map((column) => ({
    ...column,
    links: column.source === "nav" ? navLinks(nav.items) : (column.links ?? []),
  }));

  useIsoLayoutEffect(() => {
    const root = element.current;
    const mark = root.querySelector(`.${styles.wordmark}`);
    const bottom = root.querySelector(`.${styles.bottom}`);
    let disposed = false;
    const fit = () => {
      if (disposed) return;
      const context = document.createElement("canvas").getContext("2d");
      const family = getComputedStyle(mark).fontFamily;
      context.font = `600 100px ${family}`;
      context.letterSpacing = "-4.5px";
      const metrics = context.measureText(word);
      const width = bottom.clientWidth;
      const size = (width / (metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight)) * 100;
      context.font = `600 ${size}px ${family}`;
      context.letterSpacing = `${size * -0.045}px`;
      root.style.setProperty("--footer-word-size", `${size}px`);
      root.style.setProperty(
        "--footer-ink-left",
        `${context.measureText(word).actualBoundingBoxLeft}px`
      );
    };
    fit();
    document.fonts?.ready.then(fit);
    const observer = new ResizeObserver(fit);
    observer.observe(root);
    return () => {
      disposed = true;
      observer.disconnect();
    };
  }, [word]);

  useIsoLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const root = element.current;
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "clamp(top bottom)",
          end: "clamp(bottom bottom)",
          scrub: 0.65,
        },
      });
      timeline.fromTo(
        root.querySelector(`.${styles.grid}`),
        { y: 50 },
        { y: 0, ease: "power2.out" },
        0
      );
      root.querySelectorAll(`.${styles.column}`).forEach((column, index) => {
        timeline.fromTo(
          column,
          { y: [60, 110, 180, 260][index % 4] },
          { y: 0, ease: "power2.out" },
          0
        );
      });
      timeline.fromTo(
        root.querySelectorAll(`.${styles.wordmark}, .${styles.bottom}`),
        { y: 50 },
        { y: 0, ease: "power2.out" },
        0
      );
      let frame = 0;
      const observer = new ResizeObserver(() => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => ScrollTrigger.refresh());
      });
      observer.observe(document.body);
      return () => {
        cancelAnimationFrame(frame);
        observer.disconnect();
        timeline.scrollTrigger?.kill();
        timeline.revert();
      };
    });
    return () => media.revert();
  }, []);

  return (
    <footer ref={element} className={cx(styles.footer, "paper")}>
      <div className={styles.inner}>
        <div className={styles.grid} style={{ "--columns": columns.length }}>
          <SmartLink
            to="/"
            onClick={scrollToTop}
            aria-label={fill(ui.a11y.backToTop)}
            className={styles.logo}
          >
            <Logo inverse decorative />
          </SmartLink>
          {columns.map((column) => (
            <nav key={column.title} className={styles.column} aria-label={fill(column.title)}>
              <h2>{fill(column.title)}</h2>
              <div className={styles.links}>
                {column.links.map((link) => (
                  <FooterLink key={`${link.label}-${link.to ?? link.href}`} link={link} />
                ))}
              </div>
            </nav>
          ))}
        </div>
        <div className={styles.wordmark} aria-hidden="true">
          {word}
        </div>
        <div className={styles.bottom}>
          {footer.note &&
            (footer.note.href || footer.note.to ? (
              <SmartLink link={footer.note}>{fill(footer.note.label)}</SmartLink>
            ) : (
              <span>{fill(footer.note.label)}</span>
            ))}
          {footer.credit && <Credit credit={footer.credit} />}
        </div>
      </div>
    </footer>
  );
}
