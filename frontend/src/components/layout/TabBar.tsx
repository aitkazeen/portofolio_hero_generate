import type { Screen } from "../../types/content";
import styles from "./TabBar.module.css";

const TABS: { id: Screen; label: string; hotkey: string }[] = [
  { id: "hero", label: "Hero", hotkey: "H" },
  { id: "skills", label: "Skills & Stack", hotkey: "S" },
  { id: "contact", label: "Contact", hotkey: "C" },
];

interface TabBarProps {
  activeScreen: Screen;
  onSelect: (screen: Screen) => void;
}

export function TabBar({ activeScreen, onSelect }: TabBarProps) {
  return (
    <div className={styles.bar} role="tablist" aria-label="Portfolio screens">
      {TABS.map((tab) => {
        const isActive = tab.id === activeScreen;
        return (
          <div className={styles.tabWrap} key={tab.id}>
            <button
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`${styles.tab} ${isActive ? styles["tab--active"] : styles["tab--idle"]}`}
              onClick={() => onSelect(tab.id)}
            >
              <span
                className={`${styles.label} ${isActive ? styles["label--active"] : styles["label--idle"]}`}
              >
                {tab.label}
              </span>
            </button>
            <div className={styles.hotkey}>{tab.hotkey}</div>
          </div>
        );
      })}
    </div>
  );
}
