import { CornerRivets } from '../../common/CornerRivets';
import type { ContactContent } from '../../../types/content';
import styles from './QuestLog.module.css';

interface QuestLogProps {
  contact: ContactContent;
}

export function QuestLog({ contact }: QuestLogProps) {
  return (
    <div className={styles.scroll}>
      <CornerRivets size={9} inset={8} variant="gold" />
      <div className={styles.eyebrow}>Quest log — active objective</div>
      <div className={styles.title}>{contact.title}</div>
      <div className={styles.body}>{contact.body}</div>
      <div className={styles.channels}>
        {contact.channels.map((channel) => (
          <a
            className={styles.channel}
            key={channel.label}
            href={channel.href}
            target={channel.kind === 'link' ? '_blank' : undefined}
            rel={channel.kind === 'link' ? 'noreferrer' : undefined}
          >
            <div className={styles.channelIcon} />
            <div className={styles.channelText}>
              <div className={styles.channelLabel}>{channel.label}</div>
              <div className={styles.channelValue}>{channel.value}</div>
            </div>
          </a>
        ))}
      </div>
      <div className={styles.flavor}>{contact.flavorLine}</div>
    </div>
  );
}
