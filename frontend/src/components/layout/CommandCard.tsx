import type { Screen } from "../../types/content";
import styles from "./CommandCard.module.css";

const SLOTS: { id: Screen; label: string; hotkey: string }[] = [
  { id: "hero", label: "HERO", hotkey: "Z" },
  { id: "skills", label: "SKILLS", hotkey: "X" },
  { id: "contact", label: "CONTACT", hotkey: "C" },
];

interface CommandCardProps {
  activeScreen: Screen;
  onSelect: (screen: Screen) => void;
}

/** Bottom status bar's command card: the same three destinations as the tab bar. */
export function CommandCard({ activeScreen, onSelect }: CommandCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.heading}>Command card</div>
      <div className={styles.slots}>
        {SLOTS.map((slot) => {
          const isActive = slot.id === activeScreen;
          return (
            <button
              type="button"
              key={slot.id}
              className={`${styles.slot} ${isActive ? styles["slot--active"] : styles["slot--idle"]}`}
              onClick={() => onSelect(slot.id)}
            >
              <div className={styles.hotkey}>{slot.hotkey}</div>
              <div
                className={`${styles.icon} ${isActive ? styles["icon--active"] : ""}`}
              />
              <div
                className={`${styles.label} ${isActive ? styles["label--active"] : styles["label--idle"]}`}
              >
                {slot.label}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
