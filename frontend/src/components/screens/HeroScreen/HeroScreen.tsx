import type { HeroContent } from '../../../types/content';
import { CampaignLog } from './CampaignLog';
import styles from './HeroScreen.module.css';
import { IntroScroll } from './IntroScroll';
import { PortraitPanel } from './PortraitPanel';

interface HeroScreenProps {
  hero: HeroContent;
}

export function HeroScreen({ hero }: HeroScreenProps) {
  return (
    <>
      <div className={styles.grid}>
        <PortraitPanel hero={hero} />
        <IntroScroll hero={hero} />
      </div>
      <CampaignLog experience={hero.experience} projects={hero.projects} />
    </>
  );
}
