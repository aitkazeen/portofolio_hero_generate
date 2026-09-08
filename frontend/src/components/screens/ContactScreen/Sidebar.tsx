import { StatBar } from '../../common/StatBar';
import type { ContactContent } from '../../../types/content';
import styles from './Sidebar.module.css';

interface SidebarProps {
  contact: ContactContent;
}

export function Sidebar({ contact }: SidebarProps) {
  return (
    <div className={styles.column}>
      <div className={styles.buildQueue}>
        <div className={styles.label}>Build queue — availability</div>
        <div className={styles.rows}>
          {contact.buildQueue.map((item) => (
            <div className={styles.row} key={item.label}>
              <div className={styles.icon} />
              <div className={styles.rowBody}>
                <div className={styles.rowLabel}>{item.label}</div>
                <div className={styles.rowBar}>
                  <StatBar pct={item.pct} variant="stat" height={8} outline="idle" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.standingOrders}>
        <div className={styles.ordersLabel}>Standing orders</div>
        <div className={styles.ordersBody}>{contact.standingOrders}</div>
      </div>
    </div>
  );
}
