import Button from "../../ui/Button/Button.jsx";
import ColumnHeader from "../../ui/ColumnHeader/ColumnHeader.jsx";
import CodeBlock from "../../ui/CodeBlock/CodeBlock.jsx";
import LinkRows from "../../ui/LinkRows/LinkRows.jsx";
import RichText from "../../ui/RichText/RichText.jsx";
import Section from "../../ui/Section/Section.jsx";
import SectionHeader from "../../ui/SectionHeader/SectionHeader.jsx";
import VideoEmbed from "../../ui/VideoEmbed/VideoEmbed.jsx";
import styles from "./Learn.module.css";

function Track({ track, index }) {
  return (
    <article
      className={styles.track}
      data-reveal=""
      style={{ "--reveal-delay": `${index * 120}ms` }}
    >
      <ColumnHeader title={track.title} meta={track.meta} />
      {track.text && (
        <p className={styles.text}>
          <RichText text={track.text} />
        </p>
      )}
      {track.video && <VideoEmbed video={track.video} className={styles.video} />}
      {track.install && (
        <CodeBlock code={track.install.code} language={track.install.language} compact />
      )}
      {track.items?.length > 0 && (
        <LinkRows items={track.items} label={track.linkLabel} className={styles.rows} />
      )}
      {track.action && (
        <div className={styles.action}>
          <Button link={track.action} variant={track.action.variant ?? "primary"} />
        </div>
      )}
    </article>
  );
}

export default function Learn({ id, title, text, tracks = [], align = "split" }) {
  return (
    <Section id={id}>
      <SectionHeader title={title} text={text} align={align} />
      <div className={styles.tracks}>
        {tracks.map((track, index) => (
          <Track key={track.title} track={track} index={index} />
        ))}
      </div>
    </Section>
  );
}
