/** Shapes returned by the backend's GraphQL API — see backend/prisma/schema.prisma. */

export type SkillCategoryDto =
  "LANGUAGE" | "RUNTIME" | "FRAMEWORK" | "DATABASE" | "DEVOPS" | "TOOLING";
export type SkillLevelDto = "FAMILIAR" | "PROFICIENT" | "EXPERT";
export type ProjectStatusDto = "ONGOING" | "COMPLETED" | "ARCHIVED";

export interface ProfileLinkDto {
  label: string;
  url: string;
}

export interface SkillDto {
  name: string;
  category: SkillCategoryDto;
  level: SkillLevelDto;
}

export interface ProjectDto {
  title: string;
  description: string;
  techStack: string[];
  imageUrl?: string | null;
  repoUrl?: string | null;
  liveUrl?: string | null;
  featured: boolean;
  status?: ProjectStatusDto | null;
}

export interface ExperienceDto {
  role: string;
  company: string;
  /** ISO date string. */
  startDate: string;
  /** ISO date string, or null while the role is ongoing. */
  endDate?: string | null;
  description: string;
}

export interface ProfileDto {
  fullName: string;
  title: string;
  bio: string;
  email: string;
  location?: string | null;
  avatarUrl?: string | null;
  resumeUrl?: string | null;
  links: ProfileLinkDto[];
  skills: SkillDto[];
  projects: ProjectDto[];
  experience: ExperienceDto[];
}
