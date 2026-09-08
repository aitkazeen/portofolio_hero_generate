import type { ExperienceDto, ProfileDto, ProjectDto, ProjectStatusDto, SkillCategoryDto, SkillDto } from '../api/types';
import type { ArsenalSection, CardContent, ContactChannel, Faction, HeroFact, LogEntry, SkillStat } from '../types/content';
import { resolveSkillVisual } from './skillIcons';

const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const LEVEL_WEIGHT: Record<string, number> = { FAMILIAR: 0.33, PROFICIENT: 0.66, EXPERT: 1 };

const FACTION_META: Record<Faction, { title: string; note: string }> = {
  nightelf: { title: 'Frontend', note: 'craft & interface' },
  alliance: { title: 'Backend', note: 'services & data' },
  horde: { title: 'DevOps', note: 'pipelines' },
};
const FACTION_ORDER: Faction[] = ['nightelf', 'alliance', 'horde'];

const CATEGORY_META: Record<SkillCategoryDto, { label: string; attribute: string }> = {
  LANGUAGE: { label: 'LANGUAGES', attribute: 'Mind — syntax & semantics' },
  RUNTIME: { label: 'RUNTIMES', attribute: 'Vigor — where the code runs' },
  FRAMEWORK: { label: 'FRAMEWORKS', attribute: 'Agility — the application layer' },
  DATABASE: { label: 'DATABASES', attribute: 'Memory — where the data lives' },
  DEVOPS: { label: 'DEVOPS', attribute: 'Endurance — shipping & operating' },
  TOOLING: { label: 'TOOLING', attribute: 'Craft — everyday instruments' },
};

function formatMonthYear(iso: string): string {
  const date = new Date(iso);
  return `${MONTH_NAMES[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

function monthsBetween(startIso: string, endIso?: string | null): number {
  const start = new Date(startIso);
  const end = endIso ? new Date(endIso) : new Date();
  return Math.max(1, (end.getUTCFullYear() - start.getUTCFullYear()) * 12 + (end.getUTCMonth() - start.getUTCMonth()));
}

function splitFirstSentence(text: string): { first: string; rest: string } {
  const match = /^(.*?[.!?])\s*([\s\S]*)$/.exec(text);
  return match ? { first: match[1], rest: match[2] } : { first: text, rest: '' };
}

function deriveSeniority(role: string): string {
  const lower = role.toLowerCase();
  if (lower.includes('intern')) return 'INTERN';
  if (lower.includes('junior')) return 'JUNIOR';
  if (lower.includes('middle+')) return 'MIDDLE+';
  if (lower.includes('middle')) return 'MIDDLE';
  if (lower.includes('senior')) return 'SENIOR';
  if (lower.includes('lead')) return 'LEAD';
  return '';
}

function mapExperience(entries: ExperienceDto[]): LogEntry[] {
  const durations = entries.map((entry) => monthsBetween(entry.startDate, entry.endDate));
  const maxDuration = Math.max(...durations, 1);
  return entries.map((entry, index) => ({
    numeral: ROMAN_NUMERALS[index] ?? String(index + 1),
    title: entry.role,
    period: `${formatMonthYear(entry.startDate)} — ${entry.endDate ? formatMonthYear(entry.endDate) : 'now'}`,
    result: splitFirstSentence(entry.description).first,
    stack: entry.company.toUpperCase(),
    progressPct: Math.round((durations[index] / maxDuration) * 100),
    scope: deriveSeniority(entry.role),
  }));
}

const PROJECT_STATUS_META: Record<ProjectStatusDto, { label: string; pct: number }> = {
  ONGOING: { label: 'Ongoing', pct: 55 },
  COMPLETED: { label: 'Completed', pct: 100 },
  ARCHIVED: { label: 'Archived', pct: 100 },
};

/** Maps Project rows into the same row shape the Campaign Log uses for Experience —
 * status stands in for the date range, tech stack stands in for the company, and the
 * row links out to the repo/live URL when one is set. */
function mapProjects(projects: ProjectDto[]): LogEntry[] {
  return projects.map((project, index) => {
    const statusMeta = project.status ? PROJECT_STATUS_META[project.status] : undefined;
    return {
      numeral: ROMAN_NUMERALS[index] ?? String(index + 1),
      title: project.title,
      period: statusMeta?.label ?? '—',
      result: project.description,
      stack: project.techStack.join(' · ').toUpperCase(),
      progressPct: statusMeta?.pct ?? 0,
      scope: project.liveUrl ? 'LIVE' : project.repoUrl ? 'SOURCE' : '',
      href: project.liveUrl ?? project.repoUrl ?? undefined,
    };
  });
}

/** Tenure in years, counted from the earliest non-internship role (falling back to the earliest role of any kind). */
function tenureYears(experience: ExperienceDto[]): number {
  if (experience.length === 0) return 0;
  const nonIntern = experience.filter((entry) => !entry.role.toLowerCase().includes('intern'));
  const source = nonIntern.length > 0 ? nonIntern : experience;
  const earliest = source.reduce((min, entry) => (entry.startDate < min ? entry.startDate : min), source[0].startDate);
  return Math.max(1, Math.floor(monthsBetween(earliest) / 12));
}

function mapSkillStats(skills: SkillDto[]): SkillStat[] {
  const byCategory = new Map<SkillCategoryDto, SkillDto[]>();
  for (const skill of skills) {
    const list = byCategory.get(skill.category) ?? [];
    list.push(skill);
    byCategory.set(skill.category, list);
  }
  return Array.from(byCategory.entries())
    .sort((a, b) => b[1].length - a[1].length)
    .map(([category, list]) => {
      const avgWeight = list.reduce((sum, skill) => sum + (LEVEL_WEIGHT[skill.level] ?? 0.5), 0) / list.length;
      return {
        label: CATEGORY_META[category].label,
        attribute: CATEGORY_META[category].attribute,
        score: `${list.length} skill${list.length === 1 ? '' : 's'}`,
        pct: Math.round(avgWeight * 100),
      };
    });
}

/** Groups skills into the Arsenal's three faction sections (design handoff CHANGELOG §2),
 * resolving each one's icon via the skillIcons parser rather than a fixed per-tech list —
 * any skill added to prisma/seed.ts lands in a section automatically. */
function mapArsenal(skills: SkillDto[]): ArsenalSection[] {
  const byFaction = new Map<Faction, SkillDto[]>();
  for (const skill of skills) {
    const { faction } = resolveSkillVisual(skill.name, skill.category);
    const list = byFaction.get(faction) ?? [];
    list.push(skill);
    byFaction.set(faction, list);
  }

  return FACTION_ORDER.filter((faction) => byFaction.has(faction)).map((faction) => {
    const list = byFaction.get(faction) ?? [];
    return {
      faction,
      title: FACTION_META[faction].title,
      note: FACTION_META[faction].note,
      tiles: list.map((skill) => {
        const { icon, bold } = resolveSkillVisual(skill.name, skill.category);
        return { label: skill.name, icon, faction, iconBold: bold };
      }),
    };
  });
}

/** Hero facts list added below the identity block to balance the two-track grid's
 * heights (design handoff CHANGELOG §1) — real where the schema has the data, static
 * flavor ("Remote-first") where it doesn't, matching the rest of buildCardContent. */
function buildHeroFacts(profile: ProfileDto, years: number): HeroFact[] {
  return [
    { key: 'Class', value: profile.title },
    { key: 'Garrison', value: profile.location ?? 'Location on request' },
    { key: 'Campaigns', value: `${years} yr${years === 1 ? '' : 's'} production` },
    { key: 'Allegiance', value: 'Remote-first' },
  ];
}

function mapContactChannels(profile: ProfileDto): ContactChannel[] {
  const channels: ContactChannel[] = [
    { label: 'Email', value: profile.email, kind: 'email', href: `mailto:${profile.email}` },
  ];
  for (const link of profile.links) {
    channels.push({
      label: link.label,
      value: link.url.replace(/^https?:\/\//, ''),
      kind: 'link',
      href: link.url,
    });
  }
  if (profile.resumeUrl) {
    channels.push({ label: 'Résumé', value: 'Download PDF', kind: 'link', href: profile.resumeUrl });
  }
  return channels;
}

/** Turns the backend's Profile payload into the HUD's display content. Where the design
 * calls for flavor the schema doesn't model (HP/MP bars, build queue, standing orders),
 * that flavor stays static — see the design handoff in claude_design/. */
export function buildCardContent(profile: ProfileDto): CardContent {
  const years = tenureYears(profile.experience);
  const arsenal = mapArsenal(profile.skills);
  const expertShare = profile.skills.length
    ? Math.round((profile.skills.filter((skill) => skill.level === 'EXPERT').length / profile.skills.length) * 100)
    : 0;
  const topTags = profile.skills.filter((skill) => skill.level === 'EXPERT').slice(0, 4);
  const { first: headline, rest: introRest } = splitFirstSentence(profile.bio);

  return {
    resources: [
      { label: 'Years', value: `${years} yr` },
      { label: 'Shipped', value: `${profile.projects.length} project${profile.projects.length === 1 ? '' : 's'}` },
      { label: 'Skills', value: `${profile.skills.length} tracked` },
    ],
    hero: {
      fullName: profile.fullName,
      title: profile.title,
      level: years,
      healthPct: 100,
      maxHealth: 650,
      manaPct: 100,
      maxMana: 255,
      headline,
      intro: introRest || profile.bio,
      tags: (topTags.length > 0 ? topTags : profile.skills.slice(0, 4)).map((skill) => ({ label: skill.name })),
      experience: mapExperience(profile.experience),
      projects: mapProjects(profile.projects),
    },
    skills: {
      years,
      xpPct: expertShare,
      stats: mapSkillStats(profile.skills),
      heroFacts: buildHeroFacts(profile, years),
      arsenal,
      arsenalNote: `production stack — ${years} year${years === 1 ? '' : 's'}`,
      footnote: `Core production stack: ${profile.skills
        .filter((skill) => skill.level === 'EXPERT')
        .slice(0, 5)
        .map((skill) => skill.name)
        .join(' · ')}.`,
    },
    contact: {
      title: 'Send word to the keep',
      body: `Open to new opportunities${profile.location ? ` — based in ${profile.location}` : ''}. Replies within five business days.`,
      channels: mapContactChannels(profile),
      flavorLine: 'Reward on completion: one very available engineer.',
      buildQueue: [
        { label: 'Current engagement', pct: 80 },
        { label: 'Next opening', pct: 45 },
      ],
      standingOrders: `${profile.location ?? 'Location on request'} · Remote-first/Relocation · Contract or full-time`,
    },
  };
}
