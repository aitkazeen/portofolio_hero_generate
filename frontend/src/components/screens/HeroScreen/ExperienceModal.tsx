import { useEffect } from "react";
import { createPortal } from "react-dom";
import type { LogEntry } from "../../../types/content";
import styles from "./ExperienceModal.module.css";

interface ExperienceModalProps {
  entry: LogEntry;
  onClose: () => void;
}

/** Full-detail popup for a Campaign Log — Experience row, showing the CV entry in full. */
export function ExperienceModal({ entry, onClose }: ExperienceModalProps) {
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
        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>
        <div className={styles.numeral}>{entry.numeral}</div>
        <div className={styles.titleRow}>
          <div className={styles.jobTitle}>{entry.title}</div>
          <div className={styles.period}>{entry.period}</div>
        </div>
        <div className={styles.stack}>
          {entry.stack}
          {entry.scope && ` · ${entry.scope}`}
        </div>
        <div className={styles.detail}>{entry.detail || entry.result}</div>
      </div>
    </div>,
    document.body,
  );
}
