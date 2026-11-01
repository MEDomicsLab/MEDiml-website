import { useEffect, useMemo, useRef, useState } from "react";
import { ui } from "../../../lib/content.js";
import { cx } from "../../../lib/cx.js";
import { highlight } from "../../../lib/highlight.js";
import { fill } from "../../../lib/tokens.js";
import Icon from "../Icon/Icon.jsx";
import styles from "./CodeBlock.module.css";

export default function CodeBlock({
  code,
  language = ui.codeLanguage,
  className,
  compact = false,
}) {
  const text = fill(code);
  const tokens = useMemo(() => highlight(text, language), [text, language]);
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = () =>
    navigator.clipboard
      ?.writeText(text)
      .then(() => {
        setCopied(true);
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setCopied(false), 1800);
      })
      .catch(() => setCopied(false));

  return (
    <div className={cx(styles.block, compact && styles.compact, className)}>
      <div className={styles.bar}>
        <span className={styles.language}>{language}</span>
        <button
          type="button"
          className={styles.copy}
          onClick={copy}
          data-copied={copied || undefined}
        >
          <Icon name={copied ? "check" : "copy"} size={14} />
          <span aria-live="polite">{copied ? ui.copied : ui.copy}</span>
        </button>
      </div>
      <pre className={styles.pre} data-lenis-prevent="">
        <code>
          {tokens.map((token, index) =>
            token.type === "plain" ? (
              token.text
            ) : (
              <span key={index} className={styles[token.type]}>
                {token.text}
              </span>
            )
          )}
        </code>
      </pre>
    </div>
  );
}
