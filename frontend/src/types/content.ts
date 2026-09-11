import type { IconType } from "react-icons";

export type Screen = "hero" | "skills" | "contact";

/** The Arsenal's three tech-stack groupings, per the Lordaeron HUD design handoff. */
export type Faction = "nightelf" | "alliance" | "horde";

export interface ResourceStat {
  label: string;
  value: string;
}

export interface HeroTag {
  label: string;
}

/** One row of the Hero screen's Campaign Log — shared shape for both the Experience
 * view (dates, company, seniority) and the Projects view (status, tech stack, repo). */
export interface LogEntry {
  numeral: string;
  title: string;
  period: string;
  result: string;
  stack: string;
  progressPct: number;
  scope: string;
  /** If set, the row links out (e.g. a project's repo/live URL). */
  href?: string;
  /** Full CV description for this entry — `result` above is just its first sentence. */
  detail?: string;
}

export interface SkillStat {
  label: string;
  attribute: string;
  score: string;
  pct: number;
}

export interface ArsenalTile {
  label: string;
  icon: IconType;
  faction: Faction;
  /** Adds a matching stroke on top of the fill for glyphs that read faint/thin at tile size. */
  iconBold: boolean;
  /** Matches a SkillStat's `label` (e.g. "LANGUAGES") — lets the Attributes list
   * highlight this tile when its category is selected. */
  category: string;
}

export interface ArsenalSection {
  faction: Faction;
  title: string;
  note: string;
  tiles: ArsenalTile[];
}

export interface HeroFact {
  key: string;
  value: string;
}

export type ContactChannelKind = "email" | "link" | "phone" | "download";

export interface ContactChannel {
  label: string;
  value: string;
  kind: ContactChannelKind;
  href: string;
}

export interface BuildQueueItem {
  label: string;
  pct: number;
}

export interface HeroContent {
  fullName: string;
  title: string;
  avatarUrl?: string;
  level: number;
  healthPct: number;
  maxHealth: number;
  maxMana: number;
  manaPct: number;
  headline: string;
  intro: string;
  tags: HeroTag[];
  experience: LogEntry[];
  projects: LogEntry[];
}

export interface SkillsContent {
  years: number;
  xpPct: number;
  stats: SkillStat[];
  heroFacts: HeroFact[];
  arsenal: ArsenalSection[];
  arsenalNote: string;
  footnote: string;
}

export interface ContactContent {
  title: string;
  body: string;
  channels: ContactChannel[];
  flavorLine: string;
  buildQueue: BuildQueueItem[];
  standingOrders: string;
}

export interface CardContent {
  resources: ResourceStat[];
  hero: HeroContent;
  skills: SkillsContent;
  contact: ContactContent;
}
