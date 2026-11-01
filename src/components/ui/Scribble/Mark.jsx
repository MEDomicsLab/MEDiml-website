import { cx } from "../../../lib/cx.js";
import { MARKS } from "./marks.js";
import styles from "./Mark.module.css";

export default function Mark({ name = "underline", trigger = "hover", className }) {
  const mark = MARKS[name]?.box ? MARKS[name] : MARKS.underline;
  const [width, height] = mark.box;
  return (
    <svg
      className={cx(styles.mark, styles[mark.mode], styles[trigger], className)}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
    >
      <path d={mark.d} pathLength="1" />
    </svg>
  );
}
