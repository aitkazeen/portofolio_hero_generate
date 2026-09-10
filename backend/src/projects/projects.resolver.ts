import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { AdminGuard } from "../common/guards/admin.guard";
import { Project } from "./models/project.model";
import { ProjectsService } from "./projects.service";
import { CreateProjectInput } from "./dto/create-project.input";
import { UpdateProjectInput } from "./dto/update-project.input";

@Resolver(() => Project)
export class ProjectsResolver {
  constructor(private readonly projectsService: ProjectsService) {}

  @Query(() => [Project], { name: "projects" })
  findAll(
    @Args("featured", { type: () => Boolean, nullable: true })
    featured?: boolean,
  ) {
    return this.projectsService.findAll(featured);
  }

  @Mutation(() => Project)
  @UseGuards(AdminGuard)
  createProject(@Args("input") input: CreateProjectInput) {
    return this.projectsService.create(input);
  }

  @Mutation(() => Project)
  @UseGuards(AdminGuard)
  updateProject(@Args("input") input: UpdateProjectInput) {
    return this.projectsService.update(input);
  }

  @Mutation(() => Project)
  @UseGuards(AdminGuard)
  removeProject(@Args("id") id: string) {
    return this.projectsService.remove(id);
  }
}
