import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ collection: 'experience' })
export class Experience {
  @Prop({ required: true })
  role!: string;

  @Prop({ required: true })
  company!: string;

  @Prop({ required: true })
  startDate!: Date;

  @Prop()
  endDate?: Date;

  @Prop({ required: true })
  description!: string;

  @Prop({ required: true, index: true })
  profileId!: string;
}

export type ExperienceDocument = HydratedDocument<Experience>;
export const ExperienceSchema = SchemaFactory.createForClass(Experience);
