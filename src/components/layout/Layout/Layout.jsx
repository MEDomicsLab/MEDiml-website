import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { ui } from "../../../lib/content.js";
import { scrollToId, scrollToTop } from "../../../lib/scroll.js";
import useReveal from "../../../lib/useReveal.js";
import InkDefs from "../../ui/Scribble/InkDefs.jsx";
import Footer from "../Footer/Footer.jsx";
import Nav from "../Nav/Nav.jsx";
import styles from "./Layout.module.css";

function useRouteScroll() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      scrollToTop();
      return undefined;
    }
    let cancelled = false;
    const go = () => !cancelled && scrollToId(hash.slice(1), { immediate: true });
    const frame = requestAnimationFrame(go);
    document.fonts?.ready.then(() => requestAnimationFrame(go));
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [pathname, hash]);
}

export default function Layout({ footer = true }) {
  const main = useRef(null);
  useRouteScroll();
  useReveal(main);
  return (
    <>
      <a className="skip-link" href="#main">
        {ui.a11y.skipToContent}
      </a>
      <InkDefs />
      <div className={styles.header} data-site-header="">
        <Nav />
      </div>
      <main id="main" ref={main} className={styles.main} tabIndex={-1}>
        <Outlet />
      </main>
      {footer && <Footer />}
    </>
  );
}
