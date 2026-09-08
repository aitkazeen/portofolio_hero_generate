import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ProfileLink } from './profile-link.model';
import { Skill } from '../../skills/models/skill.model';
import { Project } from '../../projects/models/project.model';
import { Experience } from '../../experience/models/experience.model';

@ObjectType()
export class Profile {
  @Field(() => ID)
  id!: string;

  @Field()
  fullName!: string;

  @Field()
  title!: string;

  @Field()
  bio!: string;

  @Field()
  email!: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  location?: string;

  @Field({ nullable: true })
  avatarUrl?: string;

  @Field({ nullable: true })
  resumeUrl?: string;

  @Field(() => [String])
  languages!: string[];

  @Field(() => [String])
  certifications!: string[];

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;

  @Field(() => [ProfileLink])
  links!: ProfileLink[];

  @Field(() => [Skill])
  skills!: Skill[];

  @Field(() => [Project])
  projects!: Project[];

  @Field(() => [Experience])
  experience!: Experience[];
}
