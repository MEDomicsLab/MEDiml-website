import { cx } from "../../../lib/cx.js";
import styles from "./Marquee.module.css";

export default function Marquee({ items, render, label, repeat = 3, duration = 40, className }) {
  const set = (hidden) => (
    <ul className={styles.set} aria-hidden={hidden || undefined} inert={hidden ? "" : undefined}>
      {Array.from({ length: repeat }, (_, round) =>
        items.map((item, index) => (
          <li
            key={`${round}-${index}`}
            className={styles.item}
            aria-hidden={round > 0 || undefined}
            inert={round > 0 ? "" : undefined}
          >
            {render(item)}
          </li>
        ))
      )}
    </ul>
  );
  return (
    <div className={cx(styles.marquee, className)} aria-label={label} role="group">
      <div className={styles.track} style={{ "--duration": `${duration}s` }}>
        {set(false)}
        {set(true)}
      </div>
    </div>
  );
}
