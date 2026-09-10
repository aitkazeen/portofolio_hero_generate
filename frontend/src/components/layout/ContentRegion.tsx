import type { ReactNode } from "react";
import styles from "./ContentRegion.module.css";

export function ContentRegion({ children }: { children: ReactNode }) {
  return <div className={styles.region}>{children}</div>;
}
