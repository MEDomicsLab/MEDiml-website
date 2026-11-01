import { cx } from "../../../lib/cx.js";
import Button from "../Button/Button.jsx";
import styles from "./ActionLinks.module.css";

export default function ActionLinks({ links = [], variant, size, className, ...props }) {
  if (!links.length) return null;
  return (
    <div className={cx(styles.group, className)} {...props}>
      {links.map((link) => (
        <Button
          key={`${link.label}-${link.to ?? link.href}`}
          link={link}
          variant={variant}
          size={size}
        />
      ))}
    </div>
  );
}
