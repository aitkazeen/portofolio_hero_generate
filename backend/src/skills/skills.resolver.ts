import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { AdminGuard } from "../common/guards/admin.guard";
import { Skill } from "./models/skill.model";
import { SkillsService } from "./skills.service";
import { CreateSkillInput } from "./dto/create-skill.input";

@Resolver(() => Skill)
export class SkillsResolver {
  constructor(private readonly skillsService: SkillsService) {}

  @Query(() => [Skill], { name: "skills" })
  findAll() {
    return this.skillsService.findAll();
  }

  @Mutation(() => Skill)
  @UseGuards(AdminGuard)
  createSkill(@Args("input") input: CreateSkillInput) {
    return this.skillsService.create(input);
  }

  @Mutation(() => Skill)
  @UseGuards(AdminGuard)
  removeSkill(@Args("id") id: string) {
    return this.skillsService.remove(id);
  }
}
