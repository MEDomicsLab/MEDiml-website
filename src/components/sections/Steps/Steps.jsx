import { useCallback, useMemo, useRef, useState } from "react";
import { cx } from "../../../lib/cx.js";
import { plain } from "../../../lib/text.js";
import { fill } from "../../../lib/tokens.js";
import useInView from "../../../lib/useInView.js";
import useIsoLayoutEffect from "../../../lib/useIsoLayoutEffect.js";
import useScrollSequence from "../../../lib/useScrollSequence.js";
import RichText from "../../ui/RichText/RichText.jsx";
import Mark from "../../ui/Scribble/Mark.jsx";
import { MARKS, markFor } from "../../ui/Scribble/marks.js";
import Section from "../../ui/Section/Section.jsx";
import SectionHeader from "../../ui/SectionHeader/SectionHeader.jsx";
import styles from "./Steps.module.css";

const STROKE = 2.4;

function connectorTransform(mark, start, end) {
  const [fx, fy] = mark.from;
  const [tx, ty] = mark.to;
  const path = Math.hypot(tx - fx, ty - fy);
  const screen = Math.hypot(end.x - start.x, end.y - start.y);
  const scale = screen / path;
  const angle =
    ((Math.atan2(end.y - start.y, end.x - start.x) - Math.atan2(ty - fy, tx - fx)) * 180) / Math.PI;
  return {
    transform: `translate(${start.x} ${start.y}) rotate(${angle}) scale(${scale}) translate(${-fx} ${-fy})`,
    width: STROKE / scale,
  };
}

export default function Steps({
  id,
  index: order = 0,
  title,
  text,
  items = [],
  align = "center",
  scrollProgress = false,
}) {
  const uid = id ?? `steps-${order}`;
  const [active, setActive] = useState(0);
  const { scroller, pinned, supported, go } = useScrollSequence({
    count: items.length,
    enabled: scrollProgress,
    onSelect: setActive,
  });
  const [geometry, setGeometry] = useState([]);
  const [board, inView] = useInView({ rootMargin: "0px 0px -30% 0px" });
  const words = useRef([]);
  const anchor = useRef(null);
  const marks = useMemo(() => items.map((item, index) => markFor(item.mark, index)), [items]);
  const values = { count: items.length };

  const measure = useCallback(() => {
    const host = board.current;
    const target = anchor.current;
    if (!host || !target || !window.matchMedia("(min-width: 1012px)").matches) {
      setGeometry([]);
      return;
    }
    const origin = host.getBoundingClientRect();
    const box = target.getBoundingClientRect();
    const line = parseFloat(getComputedStyle(target).lineHeight) || 48;
    const end = { x: box.left - origin.left - 14, y: box.top - origin.top + line * 0.52 };
    setGeometry(
      items.map((_, index) => {
        const mark = MARKS[marks[index]];
        const word = words.current[index];
        if (mark.mode !== "connect" || !word) return null;
        const rect = word.getBoundingClientRect();
        const start = {
          x: rect.right - origin.left + 14,
          y: rect.top - origin.top + rect.height * 0.56,
        };
        if (end.x - start.x < 64) return null;
        return connectorTransform(mark, start, end);
      })
    );
  }, [items, marks, board]);

  useIsoLayoutEffect(() => {
    measure();
    const observer = new ResizeObserver(measure);
    if (board.current) observer.observe(board.current);
    document.fonts?.ready.then(measure);
    return () => observer.disconnect();
  }, [measure, board]);

  const onKey = (event) => {
    const last = items.length - 1;
    const next =
      event.key === "ArrowDown" || event.key === "ArrowRight"
        ? Math.min(last, active + 1)
        : event.key === "ArrowUp" || event.key === "ArrowLeft"
          ? Math.max(0, active - 1)
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? last
              : null;
    if (next === null) return;
    event.preventDefault();
    go(next);
    board.current?.querySelector(`[data-step="${next}"]`)?.focus();
  };

  return (
    <Section id={id}>
      <div
        ref={scroller}
        className={styles.scroller}
        data-scroll={scrollProgress || undefined}
        style={{ "--count": items.length }}
      >
        <div className={styles.sticky}>
          <SectionHeader title={title} text={text} values={values} align={align} />
          <div ref={board} className={styles.board} data-drawn={inView || undefined}>
            <ul
              className={styles.words}
              role={supported ? "tablist" : undefined}
              aria-orientation={supported ? "vertical" : undefined}
              aria-label={plain(title, values)}
            >
              {items.map((item, index) => {
                const on = index === active;
                const mark = MARKS[marks[index]];
                return (
                  <li
                    key={item.title}
                    className={styles.item}
                    role={supported ? "presentation" : undefined}
                  >
                    <button
                      type="button"
                      role={supported ? "tab" : undefined}
                      id={`${uid}-tab-${index}`}
                      aria-selected={supported ? on : undefined}
                      aria-controls={supported ? `${uid}-panel-${index}` : undefined}
                      tabIndex={!supported || on ? 0 : -1}
                      data-step={index}
                      className={styles.word}
                      data-mark-host=""
                      data-active={on || undefined}
                      onMouseEnter={() => !pinned && setActive(index)}
                      onFocus={() => !pinned && setActive(index)}
                      onClick={() => go(index)}
                      onKeyDown={onKey}
                    >
                      <span
                        ref={(node) => {
                          words.current[index] = node;
                        }}
                        className={styles.label}
                      >
                        {fill(item.title)}
                        {mark.mode !== "connect" && <Mark name={marks[index]} trigger="active" />}
                      </span>
                    </button>
                    <p className={styles.inline}>
                      <RichText text={item.text} />
                    </p>
                  </li>
                );
              })}
            </ul>

            <div className={styles.details}>
              {items.map((item, index) => (
                <p
                  key={item.title}
                  ref={index === 0 ? anchor : undefined}
                  id={`${uid}-panel-${index}`}
                  role="tabpanel"
                  aria-hidden={!supported || index !== active}
                  aria-labelledby={`${uid}-tab-${index}`}
                  className={styles.detail}
                  data-active={index === active || undefined}
                >
                  <RichText text={item.text} />
                </p>
              ))}
            </div>

            <svg className={styles.ink} aria-hidden="true">
              {geometry.map(
                (shape, index) =>
                  shape && (
                    <path
                      key={index}
                      d={MARKS[marks[index]].d}
                      transform={shape.transform}
                      strokeWidth={shape.width}
                      pathLength="1"
                      className={cx(styles.stroke, index === active && styles.strokeOn)}
                    />
                  )
              )}
            </svg>
          </div>
        </div>
      </div>
    </Section>
  );
}
