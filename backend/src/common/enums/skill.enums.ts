import { registerEnumType } from "@nestjs/graphql";

export enum SkillCategory {
  LANGUAGE = "LANGUAGE",
  RUNTIME = "RUNTIME",
  FRAMEWORK = "FRAMEWORK",
  DATABASE = "DATABASE",
  DEVOPS = "DEVOPS",
  TOOLING = "TOOLING",
}

export enum SkillLevel {
  FAMILIAR = "FAMILIAR",
  PROFICIENT = "PROFICIENT",
  EXPERT = "EXPERT",
}

registerEnumType(SkillCategory, { name: "SkillCategory" });
registerEnumType(SkillLevel, { name: "SkillLevel" });
