import { cx } from "../../../lib/cx.js";
import { iconFor } from "../../../lib/links.js";
import { fill } from "../../../lib/tokens.js";
import Icon, { LEADING } from "../Icon/Icon.jsx";
import SmartLink from "../SmartLink/SmartLink.jsx";
import styles from "./Button.module.css";

export default function Button({ link, variant, size = "md", className, ...props }) {
  const icon = iconFor(link);
  const leading = LEADING.has(icon);
  const tone = variant ?? link.variant ?? "secondary";
  const iconSize = tone === "link" ? 13 : size === "sm" ? 14 : 16;
  return (
    <SmartLink
      link={link}
      className={cx(styles.button, styles[tone], styles[size], className)}
      {...props}
    >
      {leading && <Icon name={icon} size={iconSize} className={styles.icon} />}
      <span className={styles.label}>{fill(link.label)}</span>
      {!leading && <Icon name={icon} size={iconSize} className={styles.icon} />}
    </SmartLink>
  );
}
