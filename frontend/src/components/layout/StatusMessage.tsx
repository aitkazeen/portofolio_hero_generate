import styles from './StatusMessage.module.css';

interface StatusMessageProps {
  eyebrow: string;
  title: string;
  detail?: string;
  onRetry?: () => void;
}

/** Centered loading/error message shown in the content region while the API request is in flight or has failed. */
export function StatusMessage({ eyebrow, title, detail, onRetry }: StatusMessageProps) {
  return (
    <div className={styles.wrap}>
      <div className={styles.eyebrow}>{eyebrow}</div>
      <div className={styles.title}>{title}</div>
      {detail && <div className={styles.detail}>{detail}</div>}
      {onRetry && (
        <button type="button" className={styles.retry} onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}
