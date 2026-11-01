import { notFoundPage } from "../lib/content.js";
import RichText from "../components/ui/RichText/RichText.jsx";
import Button from "../components/ui/Button/Button.jsx";
import Mark from "../components/ui/Scribble/Mark.jsx";
import usePageHead from "../lib/usePageHead.js";
import styles from "./NotFound.module.css";

export default function NotFound() {
  usePageHead(notFoundPage);
  const { heading, description, action } = notFoundPage;
  return (
    <section className={styles.page}>
      <h1 className={styles.heading} data-nav-release="">
        <RichText text={heading} />
      </h1>
      <p className={styles.text}>{description}</p>
      {action && (
        <span className={styles.action} data-mark-host="" data-active="">
          <Button link={{ ...action, variant: "primary" }} size="lg" />
          <Mark name="circle" trigger="active" className={styles.circle} />
        </span>
      )}
    </section>
  );
}
