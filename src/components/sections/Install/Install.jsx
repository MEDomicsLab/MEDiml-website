import { useEffect, useState } from "react";
import { ui } from "../../../lib/content.js";
import { cx } from "../../../lib/cx.js";
import { detectOs } from "../../../lib/platform.js";
import { fill } from "../../../lib/tokens.js";
import ActionLinks from "../../ui/ActionLinks/ActionLinks.jsx";
import ColumnHeader from "../../ui/ColumnHeader/ColumnHeader.jsx";
import CodeBlock from "../../ui/CodeBlock/CodeBlock.jsx";
import Icon from "../../ui/Icon/Icon.jsx";
import RichText from "../../ui/RichText/RichText.jsx";
import Section from "../../ui/Section/Section.jsx";
import SectionHeader from "../../ui/SectionHeader/SectionHeader.jsx";
import SmartLink from "../../ui/SmartLink/SmartLink.jsx";
import styles from "./Install.module.css";

function Downloads({ block, os }) {
  return (
    <div className={styles.column} data-reveal="">
      <ColumnHeader title={block.title} meta={block.release} />
      <ul className={styles.downloads}>
        {block.items.map((item) => {
          const mine = !!os && item.os === os;
          return (
            <li key={item.label}>
              <SmartLink
                href={item.href}
                newTab={false}
                className={cx(styles.download, mine && styles.mine, mine && "paper")}
              >
                <span className={styles.platform}>{fill(item.label)}</span>
                {mine && <span className={styles.yours}>{ui.recommended}</span>}
                {item.file && <span className={styles.file}>{item.file}</span>}
                <Icon name="download" size={17} className={styles.downloadIcon} />
              </SmartLink>
            </li>
          );
        })}
      </ul>
      <ActionLinks links={block.links} variant="link" className={styles.links} />
    </div>
  );
}

function Help({ block }) {
  return (
    <div className={styles.column} data-reveal="" style={{ "--reveal-delay": "120ms" }}>
      <ColumnHeader title={block.title} />
      <ul className={styles.issues}>
        {block.items.map((item) => (
          <li key={item.title} className={styles.issue}>
            <span className={cx(styles.rule, "paper")} aria-hidden="true" />
            <p className={styles.issueTitle}>{fill(item.title)}</p>
            {item.text && (
              <p className={styles.text}>
                <RichText text={item.text} />
              </p>
            )}
            {item.code && <CodeBlock code={item.code} language={item.language} compact />}
          </li>
        ))}
      </ul>
      <ActionLinks links={block.links} variant="link" className={styles.links} />
    </div>
  );
}

export default function Install({ id, title, text, download, help, align = "split" }) {
  const [os, setOs] = useState(null);
  useEffect(() => setOs(detectOs()), []);
  return (
    <Section id={id}>
      <SectionHeader title={title} text={text} align={align} />
      <div className={styles.grid}>
        {download && <Downloads block={download} os={os} />}
        {help && <Help block={help} />}
      </div>
    </Section>
  );
}
