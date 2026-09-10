import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsString, MaxLength } from "class-validator";

@InputType()
export class SubmitContactMessageInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name!: string;

  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  message!: string;
}
