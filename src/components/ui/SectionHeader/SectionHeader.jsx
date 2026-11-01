import { cx } from "../../../lib/cx.js";
import RichText from "../RichText/RichText.jsx";
import styles from "./SectionHeader.module.css";

export default function SectionHeader({
  title,
  text,
  values,
  align = "split",
  as: Heading = "h2",
  id,
  children,
  className,
}) {
  return (
    <header className={cx(styles.header, styles[align], className)}>
      <Heading id={id} className={styles.title} data-reveal="">
        <RichText text={title} values={values} />
      </Heading>
      {(text || children) && (
        <div className={styles.side} data-reveal="" style={{ "--reveal-delay": "120ms" }}>
          {text && (
            <p className={styles.text}>
              <RichText text={text} values={values} />
            </p>
          )}
          {children}
        </div>
      )}
    </header>
  );
}
