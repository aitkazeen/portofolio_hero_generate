import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Experience {
  @Field(() => ID)
  id!: string;

  @Field()
  role!: string;

  @Field()
  company!: string;

  @Field()
  startDate!: Date;

  @Field({ nullable: true })
  endDate?: Date;

  @Field()
  description!: string;

  @Field()
  profileId!: string;
}
