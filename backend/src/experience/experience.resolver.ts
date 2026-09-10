import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Experience } from "./models/experience.model";
import { ExperienceService } from "./experience.service";
import { CreateExperienceInput } from "./dto/create-experience.input";

@Resolver(() => Experience)
export class ExperienceResolver {
  constructor(private readonly experienceService: ExperienceService) {}

  @Query(() => [Experience], { name: "experience" })
  findAll() {
    return this.experienceService.findAll();
  }

  @Mutation(() => Experience)
  createExperience(@Args("input") input: CreateExperienceInput) {
    return this.experienceService.create(input);
  }

  @Mutation(() => Experience)
  removeExperience(@Args("id") id: string) {
    return this.experienceService.remove(id);
  }
}
