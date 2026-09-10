import { useEffect } from "react";
import { createPortal } from "react-dom";
import { CornerRivets } from "../../common/CornerRivets";
import type {
  ContactChannel,
  ContactChannelKind,
} from "../../../types/content";
import styles from "../HeroScreen/CampaignEntryModal.module.css";

const ACTION_LABEL: Record<ContactChannelKind, string> = {
  email: "Write",
  download: "Download",
  link: "Open",
  phone: "Open",
};

interface ContactModalProps {
  channel: ContactChannel;
  onClose: () => void;
}

/** Confirmation popup for a Quest Log — Contact channel: shows the link before following it. */
export function ContactModal({ channel, onClose }: ContactModalProps) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const opensNewTab = channel.kind === "link" || channel.kind === "download";

  return createPortal(
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-label={channel.label}
        onClick={(e) => e.stopPropagation()}
      >
        <CornerRivets size={9} inset={8} variant="gold" />
        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>
        <div className={styles.titleRow}>
          <div className={styles.jobTitle}>{channel.label}</div>
        </div>
        <div className={styles.stack}>{channel.value}</div>
        <div className={styles.detail}>You'll be redirected via this link.</div>
        <div className={styles.url}>{channel.href}</div>
        <div className={styles.actions}>
          <a
            className={`${styles.action} ${styles["action--primary"]}`}
            href={channel.href}
            target={opensNewTab ? "_blank" : undefined}
            rel={opensNewTab ? "noreferrer" : undefined}
            onClick={onClose}
          >
            {ACTION_LABEL[channel.kind]}
          </a>
          <button type="button" className={styles.action} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
