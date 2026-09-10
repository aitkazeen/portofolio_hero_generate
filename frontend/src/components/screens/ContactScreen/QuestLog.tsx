import { useState } from "react";
import { CornerRivets } from "../../common/CornerRivets";
import type { ContactChannel, ContactContent } from "../../../types/content";
import { ContactModal } from "./ContactModal";
import styles from "./QuestLog.module.css";

interface QuestLogProps {
  contact: ContactContent;
}

export function QuestLog({ contact }: QuestLogProps) {
  const [openChannel, setOpenChannel] = useState<ContactChannel | null>(null);

  return (
    <div className={styles.scroll}>
      <CornerRivets size={9} inset={8} variant="gold" />
      <div className={styles.eyebrow}>Quest log — active objective</div>
      <div className={styles.title}>{contact.title}</div>
      <div className={styles.body}>{contact.body}</div>
      <div className={styles.channels}>
        {contact.channels.map((channel) => (
          <div
            className={styles.channel}
            key={channel.label}
            role="button"
            tabIndex={0}
            onClick={() => setOpenChannel(channel)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setOpenChannel(channel);
              }
            }}
          >
            <div className={styles.channelIcon} />
            <div className={styles.channelText}>
              <div className={styles.channelLabel}>{channel.label}</div>
              <div className={styles.channelValue}>{channel.value}</div>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.flavor}>{contact.flavorLine}</div>
      {openChannel && (
        <ContactModal
          channel={openChannel}
          onClose={() => setOpenChannel(null)}
        />
      )}
    </div>
  );
}
