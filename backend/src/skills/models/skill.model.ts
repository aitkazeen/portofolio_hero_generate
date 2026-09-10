import { Field, ID, ObjectType } from "@nestjs/graphql";
import { SkillCategory, SkillLevel } from "../../common/enums/skill.enums";

@ObjectType()
export class Skill {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field(() => SkillCategory)
  category!: SkillCategory;

  @Field(() => SkillLevel)
  level!: SkillLevel;

  @Field()
  profileId!: string;
}
