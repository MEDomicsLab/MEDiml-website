import { useState } from "react";
import { ui } from "../../../lib/content.js";
import { cx } from "../../../lib/cx.js";
import { fill } from "../../../lib/tokens.js";
import Icon from "../../ui/Icon/Icon.jsx";
import MenuLink from "../../ui/MenuLink/MenuLink.jsx";
import styles from "./MobileNav.module.css";

export default function MobileNav({ nav, open, onClose }) {
  const [group, setGroup] = useState(null);
  return (
    <nav
      id="mobile-navigation"
      aria-label={ui.a11y.mainNav}
      className={cx(styles.menu, open && styles.open)}
      aria-hidden={!open}
      inert={open ? undefined : ""}
      data-lenis-prevent=""
      style={{ "--menu-count": nav.items.length }}
    >
      <ul className={styles.list}>
        {nav.items.map((item, index) => (
          <li key={item.label} className={styles.row} style={{ "--menu-index": index }}>
            {item.children ? (
              <>
                <button
                  type="button"
                  className={styles.link}
                  aria-expanded={group === index}
                  aria-controls={`mobile-group-${index}`}
                  onClick={() => setGroup(group === index ? null : index)}
                >
                  {fill(item.label)}
                  <Icon name="chevronDown" size={18} className={styles.chevron} />
                </button>
                <div
                  id={`mobile-group-${index}`}
                  className={cx(styles.group, group === index && styles.groupOpen)}
                  aria-hidden={group !== index}
                  inert={group === index ? undefined : ""}
                >
                  <ul className={styles.children}>
                    {item.children.map((child) => (
                      <li key={child.label}>
                        <MenuLink
                          link={child}
                          iconSize={20}
                          className={styles.child}
                          onClick={onClose}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <MenuLink link={item} arrowSize={18} className={styles.link} onClick={onClose} />
            )}
          </li>
        ))}
      </ul>
      <div className={styles.ctas}>
        {[nav.secondary, nav.primary].filter(Boolean).map((link) => (
          <MenuLink
            key={link.label}
            link={link}
            arrowSize={18}
            arrowClassName={styles.arrow}
            className={cx(
              styles.cta,
              link === nav.primary && styles.primary,
              link === nav.primary && "paper"
            )}
            onClick={onClose}
          />
        ))}
      </div>
    </nav>
  );
}
