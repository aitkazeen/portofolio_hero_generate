import type { SkillsContent } from '../../../types/content';
import { ArsenalGrid } from './ArsenalGrid';
import { AttributePanel } from './AttributePanel';
import styles from './SkillsScreen.module.css';

interface SkillsScreenProps {
  fullName: string;
  title: string;
  level: number;
  skills: SkillsContent;
}

export function SkillsScreen({ fullName, title, level, skills }: SkillsScreenProps) {
  return (
    <div className={styles.stack}>
      <AttributePanel fullName={fullName} title={title} level={level} skills={skills} />
      <ArsenalGrid sections={skills.arsenal} note={skills.arsenalNote} footnote={skills.footnote} />
    </div>
  );
}
