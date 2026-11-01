import { cx } from "../../../lib/cx.js";
import { fitFor } from "../../../lib/media.js";
import { plain } from "../../../lib/text.js";
import styles from "./Screen.module.css";

export function Screen({ image, fit, className, priority = false, sizes }) {
  return (
    <figure className={cx(styles.screen, fit && styles[fit], className)}>
      <img
        src={image.src}
        alt={plain(image.alt ?? "")}
        width={image.width}
        height={image.height}
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        {...(priority ? { fetchpriority: "high" } : {})}
      />
    </figure>
  );
}

export default function Mat({ image, className, priority, children, tone = "paper" }) {
  const fit = fitFor(image);
  return (
    <div className={cx(styles.mat, tone === "paper" && "paper", styles[tone], className)}>
      <Screen image={image} fit={fit} priority={priority} />
      {children}
    </div>
  );
}
