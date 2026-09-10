import { registerEnumType } from "@nestjs/graphql";

export enum ProjectStatus {
  ONGOING = "ONGOING",
  COMPLETED = "COMPLETED",
  ARCHIVED = "ARCHIVED",
}

registerEnumType(ProjectStatus, { name: "ProjectStatus" });
