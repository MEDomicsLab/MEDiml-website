import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { site, ui } from "../../../lib/content.js";
import { cx } from "../../../lib/cx.js";
import { scrollToTop } from "../../../lib/scroll.js";
import useHighlight from "../../../lib/useHighlight.js";
import useModalNavigation from "../../../lib/useModalNavigation.js";
import { fill } from "../../../lib/tokens.js";
import Logo from "../../brand/Logo/Logo.jsx";
import Icon from "../../ui/Icon/Icon.jsx";
import NavHighlight from "../../ui/NavHighlight/NavHighlight.jsx";
import NavLabel from "../../ui/NavLabel/NavLabel.jsx";
import SmartLink from "../../ui/SmartLink/SmartLink.jsx";
import MobileNav from "../MobileNav/MobileNav.jsx";
import NavDropdown from "../NavDropdown/NavDropdown.jsx";
import Notice from "../Notice/Notice.jsx";
import ThemeToggle from "../ThemeToggle/ThemeToggle.jsx";
import useHeaderMotion from "./useHeaderMotion.js";
import useScrollSpy from "./useScrollSpy.js";
import styles from "./Nav.module.css";

const hashOf = (item) => item.to?.split("#")[1];
const CLOSE_DELAY = 180;

export default function Nav() {
  const { nav } = site;
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menu, setMenu] = useState(null);
  const [focusMenu, setFocusMenu] = useState(false);
  const root = useRef(null);
  const dock = useRef(null);
  const bar = useRef(null);
  const notice = useRef(null);
  const { highlight, unspot, handlers } = useHighlight();
  const burger = useRef(null);
  const held = useRef(false);
  const closeTimer = useRef(0);
  const triggers = useRef({});
  const menuPanel = useRef(null);
  const active = useScrollSpy(nav.items.map(hashOf).filter(Boolean), pathname);

  const closeMenu = useCallback(() => {
    window.clearTimeout(closeTimer.current);
    setMenu(null);
    setFocusMenu(false);
  }, []);

  const closeMobile = useCallback(() => setMobileOpen(false), []);
  useHeaderMotion({ root, dock, notice, bar, held, pathname, onHide: closeMenu });
  useModalNavigation({ open: mobileOpen, root, trigger: burger, onClose: closeMobile });

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  useEffect(() => {
    setMobileOpen(false);
    closeMenu();
  }, [pathname, closeMenu]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1100px)");
    const resize = () => {
      closeMenu();
      if (desktop.matches) setMobileOpen(false);
    };
    desktop.addEventListener("change", resize);
    return () => desktop.removeEventListener("change", resize);
  }, [closeMenu]);

  useEffect(() => {
    held.current = mobileOpen || menu !== null;
  }, [mobileOpen, menu]);

  useEffect(() => {
    if (menu === null) return undefined;
    const trigger = triggers.current[menu];
    if (trigger && dock.current) {
      const bounds = trigger.getBoundingClientRect();
      const width = menuPanel.current?.offsetWidth ?? 608;
      const x =
        bounds.left + bounds.width / 2 - dock.current.getBoundingClientRect().left - width / 2;
      dock.current.style.setProperty(
        "--menu-x",
        `${Math.max(0, Math.min(x, dock.current.offsetWidth - width))}px`
      );
    }
    if (focusMenu) menuPanel.current?.querySelector("a")?.focus();
    const outside = (event) => {
      if (!root.current?.contains(event.target)) closeMenu();
    };
    const escape = (event) => {
      if (event.key !== "Escape") return;
      const restore = menuPanel.current?.contains(document.activeElement);
      closeMenu();
      if (restore) triggers.current[menu]?.focus();
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [menu, focusMenu, closeMenu]);

  const toggleMobile = () => {
    root.current.style.setProperty(
      "--nav-menu-top",
      `${bar.current.getBoundingClientRect().bottom}px`
    );
    setMobileOpen((value) => !value);
  };

  const tab = {
    "data-tab": "",
    ...handlers,
    onBlur: (event) => event.relatedTarget?.hasAttribute("data-tab") || unspot(),
  };

  const openMenu = (index, focus = false) => {
    window.clearTimeout(closeTimer.current);
    setMenu(index);
    setFocusMenu(focus);
  };

  const scheduleClose = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(closeMenu, CLOSE_DELAY);
  };

  const home = (event) => {
    if (pathname !== "/") return;
    event.preventDefault();
    window.history.replaceState(null, "", "/");
    scrollToTop();
  };

  return (
    <header ref={root} className={styles.nav} data-menu-open={mobileOpen}>
      <div ref={dock} className={styles.dock}>
        {site.banner?.enabled && (
          <div
            ref={notice}
            className={cx(styles.notice, "paper")}
            inert={mobileOpen ? "" : undefined}
          >
            <Notice />
          </div>
        )}
        <div ref={bar} className={styles.bar} onMouseLeave={unspot}>
          <NavHighlight highlight={highlight} />
          <SmartLink
            to="/"
            className={styles.logo}
            onClick={(event) => {
              closeMobile();
              home(event);
            }}
            onMouseEnter={unspot}
            aria-label={fill(ui.a11y.home)}
          >
            <Logo className={styles.logoMark} decorative />
          </SmartLink>
          <nav className={styles.links} aria-label={ui.a11y.mainNav}>
            <ul className={styles.list}>
              {nav.items.map((item, index) =>
                item.children ? (
                  <li key={item.label}>
                    <button
                      type="button"
                      ref={(node) => {
                        triggers.current[index] = node;
                      }}
                      className={styles.link}
                      id={`nav-trigger-${index}`}
                      aria-expanded={menu === index}
                      aria-controls={`nav-menu-${index}`}
                      {...tab}
                      onMouseEnter={(event) => {
                        handlers.onMouseEnter(event);
                        openMenu(index);
                      }}
                      onMouseLeave={scheduleClose}
                      onClick={() => (menu === index ? closeMenu() : openMenu(index))}
                      onKeyDown={(event) => {
                        if (event.key === "Escape") closeMenu();
                        if (["ArrowDown", "Enter", " "].includes(event.key)) {
                          event.preventDefault();
                          openMenu(index, true);
                        }
                      }}
                    >
                      <span className={styles.label}>{fill(item.label)}</span>
                      <Icon name="chevronDown" size={14} className={styles.chevron} />
                    </button>
                  </li>
                ) : (
                  <li key={item.label}>
                    <SmartLink
                      to={item.to}
                      href={item.href}
                      className={styles.link}
                      aria-current={
                        hashOf(item) && active === hashOf(item) ? "location" : undefined
                      }
                      data-mark-host=""
                      data-active={hashOf(item) && active === hashOf(item) ? "" : undefined}
                      {...tab}
                    >
                      <NavLabel marked={Boolean(hashOf(item))}>{fill(item.label)}</NavLabel>
                    </SmartLink>
                  </li>
                )
              )}
            </ul>
          </nav>
          <div className={styles.ctas}>
            {nav.themeToggle && (
              <ThemeToggle className={styles.toggle} onMouseEnter={unspot} onFocus={unspot} />
            )}
            {nav.secondary && (
              <SmartLink
                link={nav.secondary}
                className={cx(styles.link, styles.secondary)}
                {...tab}
              >
                {nav.secondary.icon && <Icon name={nav.secondary.icon} size={16} />}
                <span className={styles.label}>{fill(nav.secondary.label)}</span>
              </SmartLink>
            )}
            {nav.primary && (
              <SmartLink
                link={nav.primary}
                className={cx(styles.primary, "paper")}
                onMouseEnter={unspot}
              >
                {nav.primary.icon && <Icon name={nav.primary.icon} size={16} />}
                <span className={styles.label}>{fill(nav.primary.label)}</span>
                <Icon name="arrowUpRight" size={15} />
              </SmartLink>
            )}
          </div>
          <div className={styles.compact}>
            {nav.themeToggle && <ThemeToggle className={styles.toggle} />}
            <button
              type="button"
              ref={burger}
              className={styles.burger}
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
              aria-label={mobileOpen ? ui.a11y.closeMenu : ui.a11y.openMenu}
              onClick={toggleMobile}
            >
              <span className={styles.burgerGlyph} aria-hidden="true" />
            </button>
          </div>
        </div>
        {nav.items.map(
          (item, index) =>
            item.children && (
              <NavDropdown
                key={item.label}
                item={item}
                index={index}
                open={menu === index}
                panelRef={menu === index ? menuPanel : undefined}
                onEnter={() => openMenu(index)}
                onLeave={scheduleClose}
                onClose={closeMenu}
              />
            )
        )}
      </div>
      <MobileNav nav={nav} open={mobileOpen} onClose={closeMobile} />
    </header>
  );
}
