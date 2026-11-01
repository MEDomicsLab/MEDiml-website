import { cx } from "../../../lib/cx.js";
import Icon from "../Icon/Icon.jsx";
import RichText from "../RichText/RichText.jsx";
import Mark from "../Scribble/Mark.jsx";
import { MARKS } from "../Scribble/marks.js";
import SmartLink from "../SmartLink/SmartLink.jsx";
import styles from "./IndexList.module.css";

const pad = (value) => String(value).padStart(2, "0");

export default function IndexList({ items, mark = "underline", size = "md", className }) {
  return (
    <ol className={cx(styles.list, styles[size], className)}>
      {items.map((item, index) => {
        const entry = typeof item === "string" ? { title: item } : item;
        const name = entry.mark ?? mark;
        const tick = MARKS[name]?.mode === "check";
        const linked = Boolean(entry.href || entry.to);
        const Content = linked ? SmartLink : "div";
        return (
          <li key={`${entry.title}-${index}`} className={styles.item} data-mark-host="">
            <span className={cx(styles.index, tick && styles.ticked)}>
              <span className={styles.number}>{pad(index + 1)}</span>
              {tick && <Mark name="check" className={styles.tick} />}
            </span>
            <Content
              className={cx(styles.content, linked && styles.link)}
              {...(linked && { link: entry })}
            >
              <p className={styles.title}>
                <span className={styles.anchor}>
                  <RichText text={entry.title} />
                  {!tick && <Mark name={name} />}
                </span>
                {linked && <Icon name="arrowUpRight" size={18} className={styles.arrow} />}
              </p>
              {entry.text && (
                <p className={styles.text}>
                  <RichText text={entry.text} />
                </p>
              )}
            </Content>
          </li>
        );
      })}
    </ol>
  );
}
