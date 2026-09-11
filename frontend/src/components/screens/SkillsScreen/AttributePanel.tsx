import { ArchedPortrait } from "../../common/ArchedPortrait";
import { CornerRivets } from "../../common/CornerRivets";
import { StatBar } from "../../common/StatBar";
import footieAvatar from "../../../assets/avatar/footie.jpg";
import type { SkillsContent } from "../../../types/content";
import styles from "./AttributePanel.module.css";

interface AttributePanelProps {
  fullName: string;
  title: string;
  avatarUrl?: string;
  level: number;
  skills: SkillsContent;
  selectedCategory: string | null;
  onSelectCategory: (category: string) => void;
}

export function AttributePanel({
  fullName,
  title,
  avatarUrl,
  level,
  skills,
  selectedCategory,
  onSelectCategory,
}: AttributePanelProps) {
  return (
    <div className={styles.panel}>
      <CornerRivets size={7} inset={5} variant="bronze" />

      <div className={styles.tracks}>
        <div className={styles.trackA}>
          <div className={styles.header}>
            <div className={styles.portraitWrap}>
              <ArchedPortrait
                width="100%"
                borderWidth={2}
                padding={3}
                radius="50% 50% 4px 4px / 30% 30% 4px 4px"
                innerRadius="50% 50% 2px 2px / 30% 30% 2px 2px"
                captionSize={9}
                caption="PORTRAIT"
                imageUrl={avatarUrl ?? footieAvatar}
              />
            </div>
            <div className={styles.identity}>
              <div className={styles.name}>{fullName}</div>
              <div className={styles.title}>{title}</div>
              <div className={styles.levelLine}>
                Level {level} — {skills.years} yrs
              </div>
              <div className={styles.xpBar}>
                <StatBar
                  pct={skills.xpPct}
                  variant="xp"
                  height={12}
                  outline="idle"
                />
              </div>
              <div className={styles.xpCaption}>
                EXPERIENCE — {skills.xpPct}% TO NEXT TIER
              </div>
            </div>
          </div>

          <div className={styles.facts}>
            {skills.heroFacts.map((fact) => (
              <div className={styles.factRow} key={fact.key}>
                <div className={styles.factKey}>{fact.key}</div>
                <div className={styles.factValue}>{fact.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.trackB}>
          <div className={styles.sectionLabel}>
            Attributes — skill categories
          </div>
          {skills.stats.map((stat) => (
            <button
              type="button"
              className={`${styles.statRow} ${selectedCategory === stat.label ? styles["statRow--active"] : ""}`}
              key={stat.label}
              onClick={() => onSelectCategory(stat.label)}
            >
              <div className={styles.statHeader}>
                <div className={styles.statLabel}>{stat.label}</div>
                <div className={styles.statScore}>{stat.score}</div>
              </div>
              <div className={styles.statAttr}>{stat.attribute}</div>
              <div className={styles.statBar}>
                <StatBar
                  pct={stat.pct}
                  variant="stat"
                  height={14}
                  outline="idle"
                />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
