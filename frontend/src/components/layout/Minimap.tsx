import styles from './Minimap.module.css';

export function Minimap() {
  return (
    <div className={styles.outer}>
      <div className={styles.inner}>
        <div className={styles.caption}>
          MINIMAP
          <br />
          site map
        </div>
      </div>
    </div>
  );
}
