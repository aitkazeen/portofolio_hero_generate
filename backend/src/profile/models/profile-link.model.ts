import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class ProfileLink {
  @Field(() => ID)
  id!: string;

  @Field()
  label!: string;

  @Field()
  url!: string;

  @Field()
  profileId!: string;
}
