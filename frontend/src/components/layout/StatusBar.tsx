import type { Screen } from "../../types/content";
import { CommandCard } from "./CommandCard";
import { Minimap } from "./Minimap";
import { Nameplate } from "./Nameplate";
import styles from "./StatusBar.module.css";

interface StatusBarProps {
  activeScreen: Screen;
  screenLabel: string;
  fullName: string;
  level: number;
  healthPct: number;
  manaPct: number;
  onSelect: (screen: Screen) => void;
}

export function StatusBar({
  activeScreen,
  screenLabel,
  fullName,
  level,
  healthPct,
  manaPct,
  onSelect,
}: StatusBarProps) {
  return (
    <div className={styles.bar}>
      <Minimap />
      <Nameplate
        fullName={fullName}
        level={level}
        screenLabel={screenLabel}
        healthPct={healthPct}
        manaPct={manaPct}
      />
      <CommandCard activeScreen={activeScreen} onSelect={onSelect} />
    </div>
  );
}
