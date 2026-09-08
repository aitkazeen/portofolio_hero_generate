import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';
import { ProjectStatus } from '../../common/enums/project.enums';

@InputType()
export class CreateProjectInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  title!: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  description!: string;

  @Field(() => [String])
  @IsArray()
  @IsString({ each: true })
  techStack!: string[];

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl()
  repoUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl()
  liveUrl?: string;

  @Field({ nullable: true, defaultValue: false })
  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @Field(() => ProjectStatus, { nullable: true })
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @Field()
  @IsString()
  @IsNotEmpty()
  profileId!: string;
}
