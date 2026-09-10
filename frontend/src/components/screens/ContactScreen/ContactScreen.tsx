import type { ContactContent } from "../../../types/content";
import styles from "./ContactScreen.module.css";
import { QuestLog } from "./QuestLog";
import { Sidebar } from "./Sidebar";

interface ContactScreenProps {
  contact: ContactContent;
}

export function ContactScreen({ contact }: ContactScreenProps) {
  return (
    <div className={styles.grid}>
      <QuestLog contact={contact} />
      <Sidebar contact={contact} />
    </div>
  );
}
