import { useState } from "react";
import type { SkillsContent } from "../../../types/content";
import { ArsenalGrid } from "./ArsenalGrid";
import { AttributePanel } from "./AttributePanel";
import styles from "./SkillsScreen.module.css";

interface SkillsScreenProps {
  fullName: string;
  title: string;
  avatarUrl?: string;
  level: number;
  skills: SkillsContent;
}

export function SkillsScreen({
  fullName,
  title,
  avatarUrl,
  level,
  skills,
}: SkillsScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className={styles.stack}>
      <AttributePanel
        fullName={fullName}
        title={title}
        avatarUrl={avatarUrl}
        level={level}
        skills={skills}
        selectedCategory={selectedCategory}
        onSelectCategory={(category) =>
          setSelectedCategory((current) =>
            current === category ? null : category,
          )
        }
      />
      <ArsenalGrid
        sections={skills.arsenal}
        note={skills.arsenalNote}
        footnote={skills.footnote}
        selectedCategory={selectedCategory}
      />
    </div>
  );
}
