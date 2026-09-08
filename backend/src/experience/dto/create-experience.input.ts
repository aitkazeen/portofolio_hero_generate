import { Field, InputType } from '@nestjs/graphql';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class CreateExperienceInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  role!: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  company!: string;

  @Field()
  @Type(() => Date)
  @IsDate()
  startDate!: Date;

  @Field({ nullable: true })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;

  @Field()
  @IsString()
  @IsNotEmpty()
  description!: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  profileId!: string;
}
