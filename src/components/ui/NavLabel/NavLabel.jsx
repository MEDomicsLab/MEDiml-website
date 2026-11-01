import Mark from "../Scribble/Mark.jsx";
import styles from "./NavLabel.module.css";

export default function NavLabel({ children, marked = false }) {
  return (
    <span className={styles.label}>
      {children}
      {marked && <Mark name="underline" trigger="active" />}
    </span>
  );
}
