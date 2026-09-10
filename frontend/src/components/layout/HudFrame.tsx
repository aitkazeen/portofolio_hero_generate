import type { ReactNode } from "react";
import styles from "./HudFrame.module.css";

interface HudFrameProps {
  children: ReactNode;
  footerLeft: ReactNode;
  footerRight: ReactNode;
}

/**
 * The persistent game-interface chrome: page background, riveted frame rails,
 * stone texture, and vignette. Everything screen-specific renders inside
 * `children`, layered above the background stack.
 */
export function HudFrame({ children, footerLeft, footerRight }: HudFrameProps) {
  return (
    <div className={styles.page}>
      <div className={styles.panel}>
        <div className={styles.stoneField} />
        <div className={styles.stoneTexture} />
        <div className={styles.topGlow} />
        <div className={styles.bottomFade} />
        <div className={styles.vignette} />
        <div className={styles.railTop} />
        <div className={styles.railBottom} />
        <div className={styles.railLeft} />
        <div className={styles.railRight} />
        <div className={styles.goldHairline} />

        <div className={styles.foreground}>{children}</div>
      </div>

      <div className={styles.footer}>
        <div>{footerLeft}</div>
        <div>{footerRight}</div>
      </div>
    </div>
  );
}
