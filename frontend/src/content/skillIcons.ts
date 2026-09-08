import type { IconType } from 'react-icons';
import {
  SiApacheairflow,
  SiApachekafka,
  SiBudibase,
  SiCamunda,
  SiClaudecode,
  SiCockroachlabs,
  SiCss,
  SiDocker,
  SiGit,
  SiGraphql,
  SiHtml5,
  SiJavascript,
  SiMongodb,
  SiNestjs,
  SiNodedotjs,
  SiPostgresql,
  SiPrisma,
  SiReact,
  SiSvelte,
  SiTypescript,
} from 'react-icons/si';
import { TbApi, TbBrandReactNative, TbCode, TbInfinity } from 'react-icons/tb';
import type { SkillCategoryDto } from '../api/types';
import type { Faction } from '../types/content';

/** Skill-name → { icon, faction, bold } parsed against the tech list in the Arsenal
 * design (claude_design/.../CHANGELOG.md §2/§6). Real technology logos from react-icons
 * stand in for the handoff's hand-drawn faction-recolored SVGs. Keyed by a normalized
 * name so lookups survive punctuation/casing drift ("Node.js" vs "NodeJS"). `bold` adds
 * a matching stroke on top of the fill for glyphs that are naturally thin/low-contrast
 * at tile size — e.g. Apache Airflow's pinwheel is mostly negative space. */
const SKILL_VISUALS: Record<string, { icon: IconType; faction: Faction; bold?: boolean }> = {
  javascript: { icon: SiJavascript, faction: 'nightelf' },
  typescript: { icon: SiTypescript, faction: 'nightelf' },
  react: { icon: SiReact, faction: 'nightelf' },
  reactnative: { icon: TbBrandReactNative, faction: 'nightelf' },
  svelte: { icon: SiSvelte, faction: 'nightelf' },
  html5: { icon: SiHtml5, faction: 'nightelf' },
  css3: { icon: SiCss, faction: 'nightelf' },
  nodejs: { icon: SiNodedotjs, faction: 'alliance' },
  graphql: { icon: SiGraphql, faction: 'alliance' },
  mongodb: { icon: SiMongodb, faction: 'alliance' },
  postgresql: { icon: SiPostgresql, faction: 'alliance' },
  prisma: { icon: SiPrisma, faction: 'alliance' },
  cockroachdb: { icon: SiCockroachlabs, faction: 'alliance' },
  nestjs: { icon: SiNestjs, faction: 'alliance' },
  restapis: { icon: TbApi, faction: 'alliance' },
  apacheairflow: { icon: SiApacheairflow, faction: 'horde', bold: true },
  apachekafka: { icon: SiApachekafka, faction: 'horde' },
  camundabpmn: { icon: SiCamunda, faction: 'horde' },
  docker: { icon: SiDocker, faction: 'horde' },
  cicd: { icon: TbInfinity, faction: 'horde' },
  git: { icon: SiGit, faction: 'horde' },
  budibase: { icon: SiBudibase, faction: 'horde' },
  claudecode: { icon: SiClaudecode, faction: 'horde' },
};

/** Fallback faction by Prisma SkillCategory, for any skill name not in the table above
 * (e.g. a new one added to prisma/seed.ts later) so the Arsenal never drops a skill. */
const CATEGORY_FALLBACK_FACTION: Record<SkillCategoryDto, Faction> = {
  LANGUAGE: 'nightelf',
  FRAMEWORK: 'nightelf',
  RUNTIME: 'alliance',
  DATABASE: 'alliance',
  DEVOPS: 'horde',
  TOOLING: 'horde',
};

function normalize(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/** Resolves a skill's Arsenal glyph, faction group, and stroke weight. Unknown names
 * fall back to a generic icon and a category-derived faction, so the grid stays
 * populated as skills are added or renamed in prisma/seed.ts without touching this file. */
export function resolveSkillVisual(name: string, category: SkillCategoryDto): { icon: IconType; faction: Faction; bold: boolean } {
  const known = SKILL_VISUALS[normalize(name)];
  if (known) return { bold: false, ...known };
  return { icon: TbCode, faction: CATEGORY_FALLBACK_FACTION[category], bold: false };
}
