import { site, ui } from "../../../lib/content.js";
import { keys, write } from "../../../lib/storage.js";
import { fill } from "../../../lib/tokens.js";
import RichText from "../../ui/RichText/RichText.jsx";
import Icon from "../../ui/Icon/Icon.jsx";
import SmartLink from "../../ui/SmartLink/SmartLink.jsx";
import styles from "./Notice.module.css";

export default function Notice() {
  const { banner } = site;
  if (!banner?.enabled) return null;

  const dismiss = () => {
    document.documentElement.dataset.notice = "off";
    write(keys.banner, banner.id ?? "");
  };

  return (
    <div className={styles.notice}>
      <p className={styles.text}>
        <span className={styles.dot} aria-hidden="true" />
        <span>
          <RichText text={banner.text} />
        </span>
        {banner.link && (
          <SmartLink link={banner.link} className={styles.link}>
            {fill(banner.link.label)}
            <Icon name={banner.link.to ? "arrowRight" : "arrowUpRight"} size={13} />
          </SmartLink>
        )}
      </p>
      {banner.dismissible && (
        <button
          type="button"
          className={styles.dismiss}
          onClick={dismiss}
          aria-label={ui.a11y.dismissBanner}
        >
          <Icon name="close" size={14} />
        </button>
      )}
    </div>
  );
}
