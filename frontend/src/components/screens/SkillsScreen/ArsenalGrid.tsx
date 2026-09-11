import type { ArsenalSection, Faction } from "../../../types/content";
import styles from "./ArsenalGrid.module.css";

const FACTION_CLASS: Record<Faction, string> = {
  nightelf: styles["marker--nightelf"],
  alliance: styles["marker--alliance"],
  horde: styles["marker--horde"],
};

interface ArsenalGridProps {
  sections: ArsenalSection[];
  note: string;
  footnote: string;
  selectedCategory: string | null;
}

export function ArsenalGrid({
  sections,
  note,
  footnote,
  selectedCategory,
}: ArsenalGridProps) {
  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.title}>Arsenal</div>
        <div className={styles.note}>{note}</div>
      </div>

      <div className={styles.sections}>
        {sections.map((section) => (
          <div className={styles.section} key={section.faction}>
            <div className={styles.sectionHeader}>
              <div
                className={`${styles.marker} ${FACTION_CLASS[section.faction]}`}
              />
              <div className={styles.sectionTitle}>{section.title}</div>
              <div className={styles.sectionNote}>{section.note}</div>
            </div>
            <div className={styles.grid}>
              {section.tiles.map((tile) => {
                const Icon = tile.icon;
                const isHighlighted = tile.category === selectedCategory;
                return (
                  <div
                    className={`${styles.tile} ${isHighlighted ? styles["tile--highlighted"] : ""}`}
                    key={tile.label}
                  >
                    <div
                      className={`${styles.iconSlot} ${FACTION_CLASS[section.faction]}`}
                    >
                      <Icon
                        className={styles.iconGlyph}
                        {...(tile.iconBold
                          ? { stroke: "currentColor", strokeWidth: 1.1 }
                          : {})}
                      />
                    </div>
                    <div className={styles.tileLabel}>{tile.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.footnote}>{footnote}</div>
    </div>
  );
}
