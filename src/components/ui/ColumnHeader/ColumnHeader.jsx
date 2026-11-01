import { cx } from "../../../lib/cx.js";
import { fill } from "../../../lib/tokens.js";
import RichText from "../RichText/RichText.jsx";
import styles from "./ColumnHeader.module.css";

export default function ColumnHeader({ title, meta, className }) {
  return (
    <header className={cx(styles.head, className)}>
      <h3 className={styles.title}>
        <RichText text={title} />
      </h3>
      {meta && <p className={styles.meta}>{fill(meta)}</p>}
    </header>
  );
}
