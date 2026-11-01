import { useRef, useState } from "react";
import { site, ui } from "../../../lib/content.js";
import { cx } from "../../../lib/cx.js";
import { plain } from "../../../lib/text.js";
import { embedUrl } from "../../../lib/media.js";
import { fill } from "../../../lib/tokens.js";
import useVideoPlayer from "../../../lib/useVideoPlayer.js";
import Icon from "../Icon/Icon.jsx";
import styles from "./VideoEmbed.module.css";

export default function VideoEmbed({ video, className }) {
  const [source, setSource] = useState(null);
  const frame = useRef(null);
  const title = plain(video.title);
  const player = useVideoPlayer(frame, source, title);
  return (
    <div className={cx(styles.embed, className)}>
      <div className={styles.frame}>
        {source ? (
          <div ref={frame} className={styles.player} />
        ) : (
          <button
            type="button"
            className={cx(styles.poster, "paper")}
            onClick={() => setSource(embedUrl(video, window.location.origin))}
            aria-label={fill(ui.a11y.playVideo, { title })}
          >
            {video.poster && (
              <img className={styles.image} src={video.poster} alt="" loading="lazy" />
            )}
            <span className={styles.top}>
              <span className={styles.caption}>{plain(video.caption ?? video.title)}</span>
              <Icon name="youtube" size={22} className={styles.brand} />
            </span>
            <span className={styles.play} aria-hidden="true">
              <span className={styles.playGlyph} />
            </span>
            <span className={styles.word} aria-hidden="true">
              {site.brand.name}
            </span>
          </button>
        )}
      </div>
      {source && player.ready && (
        <div className={cx(styles.controls, "paper")}>
          <span className={styles.caption}>{plain(video.caption ?? video.title)}</span>
          <button
            type="button"
            className={styles.control}
            onClick={player.toggle}
            aria-label={fill(player.playing ? ui.a11y.pauseVideo : ui.a11y.playVideo, { title })}
          >
            <span className={styles.play} aria-hidden="true">
              <span className={cx(styles.playGlyph, player.playing && styles.pauseGlyph)} />
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
