import { ArchedPortrait } from "../common/ArchedPortrait";
import { StatBar } from "../common/StatBar";
import styles from "./Nameplate.module.css";

interface NameplateProps {
  fullName: string;
  level: number;
  screenLabel: string;
  healthPct: number;
  manaPct: number;
}

/** Bottom status bar's selected-unit nameplate: avatar, name, level, HP/MP bars. */
export function Nameplate({
  fullName,
  level,
  screenLabel,
  healthPct,
  manaPct,
}: NameplateProps) {
  return (
    <div className={styles.plate}>
      <ArchedPortrait
        width={64}
        borderWidth={2}
        padding={2}
        radius="50% 50% 3px 3px / 30% 30% 3px 3px"
        innerRadius="50% 50% 2px 2px / 30% 30% 2px 2px"
        innerGlowBlur={20}
        captionSize={8}
        caption="AVATAR"
      />
      <div className={styles.info}>
        <div className={styles.nameRow}>
          <div className={styles.name}>{fullName}</div>
          <div className={styles.level}>LVL {level}</div>
        </div>
        <div className={styles.subline}>{screenLabel}</div>
        <div className={styles.bars}>
          <StatBar pct={healthPct} variant="hp" height={9} outline="idle" />
          <StatBar pct={manaPct} variant="mana" height={9} outline="idle" />
        </div>
      </div>
    </div>
  );
}
