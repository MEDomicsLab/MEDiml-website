import { useState } from "react";
import { cx } from "../../../lib/cx.js";
import { fill } from "../../../lib/tokens.js";
import Icon from "../../ui/Icon/Icon.jsx";
import MenuLink from "../../ui/MenuLink/MenuLink.jsx";
import styles from "./NavDropdown.module.css";

export default function NavDropdown({ item, index, open, panelRef, onEnter, onLeave, onClose }) {
  const [active, setActive] = useState(0);
  const preview = item.children.some((child) => child.text);
  return (
    <div
      id={`nav-menu-${index}`}
      ref={panelRef}
      role="region"
      aria-labelledby={`nav-trigger-${index}`}
      aria-hidden={!open}
      inert={open ? undefined : ""}
      className={cx(styles.menu, open && styles.open)}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onBlur={(event) => {
        if (
          !event.currentTarget.contains(event.relatedTarget) &&
          event.relatedTarget?.id !== `nav-trigger-${index}`
        )
          onClose();
      }}
    >
      <div className={cx(styles.inner, preview && styles.withPreview)}>
        <div className={styles.column}>
          <h2 className={styles.title}>{fill(item.title ?? item.label)}</h2>
          {item.text && <p className={styles.description}>{fill(item.text)}</p>}
          <ul className={styles.links}>
            {item.children.map((child, childIndex) => (
              <li key={child.label}>
                <MenuLink
                  link={child}
                  fallbackIcon="book"
                  className={styles.link}
                  data-active={preview && active === childIndex ? "" : undefined}
                  onMouseEnter={() => setActive(childIndex)}
                  onFocus={() => setActive(childIndex)}
                  onClick={onClose}
                />
              </li>
            ))}
          </ul>
        </div>
        {preview && (
          <div className={styles.previews}>
            {item.children.map((child, childIndex) => (
              <div
                key={child.label}
                className={cx(styles.preview, childIndex === active && styles.previewActive)}
                aria-hidden={childIndex !== active}
              >
                <Icon name={child.icon ?? "book"} size={44} className={styles.icon} />
                <h3>{fill(child.label)}</h3>
                {child.text && <p>{fill(child.text)}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
