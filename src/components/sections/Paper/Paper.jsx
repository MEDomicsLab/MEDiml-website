import { ui } from "../../../lib/content.js";
import { cx } from "../../../lib/cx.js";
import { resolveHref } from "../../../lib/links.js";
import { plain } from "../../../lib/text.js";
import { fill } from "../../../lib/tokens.js";
import ActionLinks from "../../ui/ActionLinks/ActionLinks.jsx";
import Icon from "../../ui/Icon/Icon.jsx";
import RichText from "../../ui/RichText/RichText.jsx";
import Section from "../../ui/Section/Section.jsx";
import SectionHeader from "../../ui/SectionHeader/SectionHeader.jsx";
import SmartLink from "../../ui/SmartLink/SmartLink.jsx";
import Tabs from "../../ui/Tabs/Tabs.jsx";
import styles from "./Paper.module.css";

function Block({ block }) {
  const content = Array.isArray(block.content) ? block.content : [block.content];
  return (
    <div className={cx(styles.block, block.wide && styles.wide)}>
      <span className={cx(styles.rule, "paper")} aria-hidden="true" />
      <dt className={styles.blockTitle}>{fill(block.title)}</dt>
      {content.map((entry, position) => (
        <dd key={position} className={styles.blockContent}>
          <RichText text={entry} />
        </dd>
      ))}
    </div>
  );
}

function PaperContent({ paper, open, showTitle = false }) {
  const { pdf } = paper;
  return (
    <div className={cx(styles.grid, !pdf && styles.withoutPdf)}>
      <article className={styles.meta}>
        <div className={styles.head}>
          {showTitle && (
            <h3 className={styles.title}>
              <RichText text={paper.title} />
            </h3>
          )}
          {(paper.authors || paper.venue || paper.reference) && (
            <p className={styles.byline}>
              {paper.authors && <span>{fill(paper.authors)}</span>}
              {(paper.reference || paper.venue) && (
                <span className={styles.venue}>
                  {[paper.reference, paper.venue]
                    .filter(Boolean)
                    .map((part) => fill(part))
                    .join(" · ")}
                </span>
              )}
            </p>
          )}
        </div>
        {paper.abstract && (
          <p className={styles.abstract}>
            <RichText text={paper.abstract} />
          </p>
        )}
        {paper.blocks?.length > 0 && (
          <dl className={styles.blocks}>
            {paper.blocks.map((block) => (
              <Block key={block.title} block={block} />
            ))}
          </dl>
        )}
        <ActionLinks links={paper.actions} className={styles.actions} />
      </article>
      {pdf && (
        <div className={styles.viewer}>
          <div className={styles.window}>
            <div className={styles.bar}>
              <span className={styles.file}>{fill(pdf.name)}</span>
              <SmartLink href={pdf.src} className={styles.open}>
                {fill(pdf.open ?? ui.pdfOpen)}
                <Icon name="arrowUpRight" size={13} />
              </SmartLink>
            </div>
            <div className={styles.document}>
              {open && (
                <iframe
                  title={plain(`${ui.pdfFallback}: ${paper.title}`)}
                  src={`${resolveHref(pdf.src)}#view=FitH`}
                  loading="lazy"
                />
              )}
            </div>
          </div>
          {pdf.note && (
            <p className={styles.note}>
              <RichText text={pdf.note} />
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function Paper({ id, title, text, papers, paper, align = "center" }) {
  return (
    <Section id={id}>
      <SectionHeader title={title} text={text} align={align} />
      {papers ? (
        <Tabs
          brand
          items={papers}
          label={plain(title)}
          renderContent={(item, open) => <PaperContent paper={item} open={open} showTitle />}
        />
      ) : (
        <PaperContent paper={paper} open showTitle />
      )}
    </Section>
  );
}
