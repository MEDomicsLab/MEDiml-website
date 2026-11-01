import { cx } from "../../../lib/cx.js";
import styles from "./Section.module.css";

export default function Section({ id, label, className, inner, children, flush = false }) {
  return (
    <section
      id={id}
      aria-label={label}
      className={cx(styles.section, flush && styles.flush, className)}
    >
      <div className={cx(styles.inner, inner)}>{children}</div>
    </section>
  );
}
