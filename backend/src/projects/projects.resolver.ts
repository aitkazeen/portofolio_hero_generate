import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Project } from './models/project.model';
import { ProjectsService } from './projects.service';
import { CreateProjectInput } from './dto/create-project.input';
import { UpdateProjectInput } from './dto/update-project.input';

@Resolver(() => Project)
export class ProjectsResolver {
  constructor(private readonly projectsService: ProjectsService) {}

  @Query(() => [Project], { name: 'projects' })
  findAll(@Args('featured', { type: () => Boolean, nullable: true }) featured?: boolean) {
    return this.projectsService.findAll(featured);
  }

  @Mutation(() => Project)
  createProject(@Args('input') input: CreateProjectInput) {
    return this.projectsService.create(input);
  }

  @Mutation(() => Project)
  updateProject(@Args('input') input: UpdateProjectInput) {
    return this.projectsService.update(input);
  }

  @Mutation(() => Project)
  removeProject(@Args('id') id: string) {
    return this.projectsService.remove(id);
  }
}
