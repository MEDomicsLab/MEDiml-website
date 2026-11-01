import { cx } from "../../../lib/cx.js";
import { iconFor } from "../../../lib/links.js";
import { fill } from "../../../lib/tokens.js";
import useHighlight from "../../../lib/useHighlight.js";
import Icon from "../Icon/Icon.jsx";
import RichText from "../RichText/RichText.jsx";
import SmartLink from "../SmartLink/SmartLink.jsx";
import styles from "./LinkRows.module.css";

const pad = (value) => String(value).padStart(2, "0");

export default function LinkRows({ items, label, className, ...props }) {
  const { highlight, unspot, handlers } = useHighlight();
  return (
    <div className={cx(styles.wrap, className)} onMouseLeave={unspot} {...props}>
      <span ref={highlight} className={cx(styles.highlight, "paper")} aria-hidden="true" />
      <ol className={styles.rows}>
        {items.map((item, index) => (
          <li key={item.title}>
            <SmartLink
              link={item}
              className={styles.row}
              aria-label={
                (item.label ?? label)
                  ? `${fill(item.title)}: ${fill(item.label ?? label)}`
                  : undefined
              }
              {...handlers}
            >
              <span className={styles.index}>{pad(index + 1)}</span>
              <span className={styles.copy}>
                <span className={styles.title}>
                  <RichText text={item.title} />
                </span>
                {item.text && (
                  <span className={styles.text}>
                    <RichText text={item.text} />
                  </span>
                )}
              </span>
              <Icon name={iconFor(item)} size={16} className={styles.arrow} />
            </SmartLink>
          </li>
        ))}
      </ol>
    </div>
  );
}
