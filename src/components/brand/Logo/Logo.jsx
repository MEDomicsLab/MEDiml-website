import { site } from "../../../lib/content.js";
import { cx } from "../../../lib/cx.js";
import styles from "./Logo.module.css";

export default function Logo({ className, inverse = false, decorative = false }) {
  const { brand } = site;
  const alt = decorative ? "" : brand.logoAlt;
  if (inverse) {
    return (
      <span className={cx(styles.logo, className)}>
        <img src={brand.logoInverse} alt={alt} width="500" height="500" />
      </span>
    );
  }
  return (
    <span className={cx(styles.logo, className)}>
      <img className={styles.light} src={brand.logo} alt={alt} width="500" height="500" />
      <img
        className={styles.dark}
        src={brand.logoInverse}
        alt=""
        aria-hidden="true"
        width="500"
        height="500"
      />
    </span>
  );
}
