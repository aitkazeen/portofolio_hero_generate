import { Field, InputType } from "@nestjs/graphql";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { SkillCategory, SkillLevel } from "../../common/enums/skill.enums";

@InputType()
export class CreateSkillInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name!: string;

  @Field(() => SkillCategory)
  @IsEnum(SkillCategory)
  category!: SkillCategory;

  @Field(() => SkillLevel, { nullable: true })
  @IsEnum(SkillLevel)
  level?: SkillLevel;

  @Field()
  @IsString()
  @IsNotEmpty()
  profileId!: string;
}
