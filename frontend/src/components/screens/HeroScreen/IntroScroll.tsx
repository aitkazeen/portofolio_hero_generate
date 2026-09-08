import { CornerRivets } from '../../common/CornerRivets';
import type { HeroContent } from '../../../types/content';
import styles from './IntroScroll.module.css';

interface IntroScrollProps {
  hero: HeroContent;
}

/** Hero screen's right column: the parchment "campaign log" intro scroll. */
export function IntroScroll({ hero }: IntroScrollProps) {
  return (
    <div className={styles.scroll}>
      <CornerRivets size={9} inset={8} variant="gold" />
      <div className={styles.eyebrow}>Chapter one — the candidate</div>
      <div className={styles.headline}>{hero.headline}</div>
      <div className={styles.body}>{hero.intro}</div>
      <div className={styles.tags}>
        {hero.tags.map((tag) => (
          <div className={styles.tag} key={tag.label}>
            {tag.label}
          </div>
        ))}
      </div>
    </div>
  );
}
