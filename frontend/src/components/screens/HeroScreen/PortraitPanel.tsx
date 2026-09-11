import { ArchedPortrait } from "../../common/ArchedPortrait";
import { CornerRivets } from "../../common/CornerRivets";
import { StatBar } from "../../common/StatBar";
import footieAvatar from "../../../assets/avatar/footie.jpg";
import type { HeroContent } from "../../../types/content";
import styles from "./PortraitPanel.module.css";

interface PortraitPanelProps {
  hero: HeroContent;
}

/** Hero screen's left column: nameplate header, big arched portrait, HP/MP bars. */
export function PortraitPanel({ hero }: PortraitPanelProps) {
  return (
    <div className={styles.panel}>
      <CornerRivets size={7} inset={5} variant="bronze" />

      <div className={styles.nameplateHeader}>
        <div className={styles.nameRow}>
          <div className={styles.name}>{hero.fullName}</div>
          <div className={styles.level}>LVL {hero.level}</div>
        </div>
        <div className={styles.title}>{hero.title}</div>
      </div>

      <ArchedPortrait
        width="100%"
        borderWidth={3}
        padding={4}
        radius="50% 50% 6px 6px / 34% 34% 6px 6px"
        innerRadius="50% 50% 3px 3px / 34% 34% 3px 3px"
        innerGlowBlur={40}
        glow
        captionSize={11}
        imageUrl={hero.avatarUrl ?? footieAvatar}
        caption={
          <>
            hero portrait
            <br />
            512 × 680
          </>
        }
      />

      <div className={styles.bars}>
        <StatBar
          pct={hero.healthPct}
          variant="hp"
          height={20}
          label={
            <span style={{ fontSize: 11, color: "#eafbe8" }}>
              {hero.maxHealth} / {hero.maxHealth}
            </span>
          }
        />
        <StatBar
          pct={hero.manaPct}
          variant="mana"
          height={20}
          label={
            <span style={{ fontSize: 11, color: "#e6f0ff" }}>
              {hero.maxMana} / {hero.maxMana}
            </span>
          }
        />
      </div>
    </div>
  );
}
