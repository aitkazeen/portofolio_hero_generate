import { useEffect } from "react";
import { createPortal } from "react-dom";
import { CornerRivets } from "../../common/CornerRivets";
import type { LogEntry } from "../../../types/content";
import styles from "./CampaignEntryModal.module.css";

interface ProjectModalProps {
  entry: LogEntry;
  onClose: () => void;
}

/** Confirmation popup for a Campaign Log — Projects row: shows the link before opening it. */
export function ProjectModal({ entry, onClose }: ProjectModalProps) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return createPortal(
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-label={entry.title}
        onClick={(e) => e.stopPropagation()}
      >
        <CornerRivets size={9} inset={8} variant="gold" />
        <div className={styles.numeral}>{entry.numeral}</div>
        <div className={styles.titleRow}>
          <div className={styles.jobTitle}>{entry.title}</div>
          <div className={styles.period}>{entry.period}</div>
        </div>
        <div className={styles.stack}>{entry.stack}</div>
        {entry.href && <div className={styles.url}>{entry.href}</div>}
        <div className={styles.actions}>
          <a
            className={`${styles.action} ${styles["action--primary"]}`}
            href={entry.href}
            target="_blank"
            rel="noreferrer"
            onClick={onClose}
          >
            Open
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
