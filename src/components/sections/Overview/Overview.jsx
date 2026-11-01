import IndexList from "../../ui/IndexList/IndexList.jsx";
import Section from "../../ui/Section/Section.jsx";
import SectionHeader from "../../ui/SectionHeader/SectionHeader.jsx";
import VideoEmbed from "../../ui/VideoEmbed/VideoEmbed.jsx";
import Mat from "../../ui/Screen/Screen.jsx";
import styles from "./Overview.module.css";

export default function Overview({ id, title, text, video, image, items = [], align = "split" }) {
  return (
    <Section id={id}>
      <SectionHeader title={title} text={text} align={align} />
      <div className={styles.grid}>
        <div className={styles.media} data-reveal="">
          {video && <VideoEmbed video={video} />}
          {!video && image && <Mat image={image} />}
        </div>
        {items.length > 0 && (
          <div className={styles.list} data-reveal="" style={{ "--reveal-delay": "140ms" }}>
            <IndexList items={items} size="lg" />
          </div>
        )}
      </div>
    </Section>
  );
}
