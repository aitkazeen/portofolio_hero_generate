import type { ReactNode } from 'react';
import styles from './ArchedPortrait.module.css';

interface ArchedPortraitProps {
  /** Outer frame width (px number, or a CSS width string like "100%"); height follows the 3:4 slot aspect ratio. */
  width: number | string;
  borderWidth: number;
  padding: number;
  /** Outer border-radius shorthand, e.g. "50% 50% 6px 6px / 34% 34% 6px 6px". */
  radius: string;
  innerRadius: string;
  /** Inset shadow blur radius (px) for the sunken slot, e.g. 40 for the big hero portrait. */
  innerGlowBlur?: number;
  glow?: boolean;
  captionSize?: number;
  caption?: ReactNode;
  imageUrl?: string | null;
}

/**
 * The arched "hero portrait" frame reused for the hero screen's big portrait,
 * the skills header's small portrait, and the status bar's avatar. Renders a
 * diagonal-hatch placeholder until an image URL is supplied.
 */
export function ArchedPortrait({
  width,
  borderWidth,
  padding,
  radius,
  innerRadius,
  innerGlowBlur = 24,
  glow = false,
  captionSize = 11,
  caption,
  imageUrl,
}: ArchedPortraitProps) {
  return (
    <div
      className={styles.frame}
      style={{
        width,
        borderWidth,
        padding,
        borderRadius: radius,
        boxShadow: glow ? '0 0 16px rgba(198, 154, 52, 0.35)' : undefined,
      }}
    >
      <div
        className={styles.slot}
        style={{
          borderRadius: innerRadius,
          boxShadow: `inset 0 0 ${innerGlowBlur}px rgba(0, 0, 0, 0.85)`,
          backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
          backgroundSize: imageUrl ? 'cover' : undefined,
          backgroundPosition: imageUrl ? 'center' : undefined,
        }}
      >
        {!imageUrl && caption && (
          <div className={styles.caption} style={{ fontSize: captionSize, letterSpacing: '.12em' }}>
            {caption}
          </div>
        )}
      </div>
    </div>
  );
}
