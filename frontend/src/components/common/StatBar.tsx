import type { CSSProperties, ReactNode } from "react";
import styles from "./StatBar.module.css";

export type StatBarVariant = "hp" | "mana" | "xp" | "stat";

interface StatBarProps {
  pct: number;
  variant: StatBarVariant;
  height: number;
  outline?: "gold" | "idle";
  label?: ReactNode;
  style?: CSSProperties;
}

const FILL_CLASS: Record<StatBarVariant, string> = {
  hp: styles["fill--hp"],
  mana: styles["fill--mana"],
  xp: styles["fill--xp"],
  stat: styles["fill--stat"],
};

/** Generic HP/MP/XP/attribute progress bar used across every screen. */
export function StatBar({
  pct,
  variant,
  height,
  outline = "gold",
  label,
  style,
}: StatBarProps) {
  const trackClass =
    outline === "idle"
      ? `${styles.track} ${styles["track--idle"]}`
      : `${styles.track} ${styles["track--outlined"]}`;

  return (
    <div className={trackClass} style={{ height, ...style }}>
      <div
        className={`${styles.fill} ${FILL_CLASS[variant]}`}
        style={{ width: `${pct}%` }}
      />
      {label !== undefined && <div className={styles.label}>{label}</div>}
    </div>
  );
}
