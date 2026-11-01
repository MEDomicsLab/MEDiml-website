import styles from "./NavHighlight.module.css";

export default function NavHighlight({ highlight }) {
  return <span ref={highlight} className={styles.highlight} aria-hidden="true" />;
}
