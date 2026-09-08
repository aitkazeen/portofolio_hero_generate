import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ProjectStatus } from '../../common/enums/project.enums';

@ObjectType()
export class Project {
  @Field(() => ID)
  id!: string;

  @Field()
  title!: string;

  @Field()
  description!: string;

  @Field(() => [String])
  techStack!: string[];

  @Field({ nullable: true })
  imageUrl?: string;

  @Field({ nullable: true })
  repoUrl?: string;

  @Field({ nullable: true })
  liveUrl?: string;

  @Field()
  featured!: boolean;

  @Field(() => ProjectStatus, { nullable: true })
  status?: ProjectStatus;

  @Field()
  createdAt!: Date;

  @Field()
  profileId!: string;
}
