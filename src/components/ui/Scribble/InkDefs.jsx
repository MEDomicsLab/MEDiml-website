import { theme } from "../../../lib/content.js";

export default function InkDefs() {
  const stops = theme.accent.ink ?? [theme.accent.color, theme.accent.color];
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute" }}>
      <defs>
        <linearGradient id="paper-ink" x1="0" y1="0" x2="0.35" y2="1">
          {stops.map((color, index) => (
            <stop
              key={color}
              offset={stops.length > 1 ? index / (stops.length - 1) : 0}
              stopColor={color}
            />
          ))}
        </linearGradient>
      </defs>
    </svg>
  );
}
