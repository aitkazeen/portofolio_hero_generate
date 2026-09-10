import type { ResourceStat } from "../../types/content";
import styles from "./TopResourceBar.module.css";

interface TopResourceBarProps {
  resources: ResourceStat[];
}

export function TopResourceBar({ resources }: TopResourceBarProps) {
  return (
    <div className={styles.bar}>
      <div className={styles.resources}>
        {resources.map((res) => (
          <div className={styles.resource} key={res.label}>
            <div className={styles.diamond} />
            <div className={styles.label}>{res.label}</div>
            <div className={styles.value}>{res.value}</div>
          </div>
        ))}
      </div>
      <div className={styles.terminal}>
        <div className={styles.caption}>Lordaeron — Portfolio Terminal</div>
        <div className={styles.statusDot} />
      </div>
    </div>
  );
}
