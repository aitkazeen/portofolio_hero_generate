import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { SkillCategory, SkillLevel } from '../../common/enums/skill.enums';

@Schema({ collection: 'skills' })
export class Skill {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true, enum: SkillCategory })
  category!: SkillCategory;

  @Prop({ required: true, enum: SkillLevel, default: SkillLevel.PROFICIENT })
  level!: SkillLevel;

  @Prop({ required: true, index: true })
  profileId!: string;
}

export type SkillDocument = HydratedDocument<Skill>;
export const SkillSchema = SchemaFactory.createForClass(Skill);
// Mirrors the Prisma @@unique([profileId, name]) constraint.
SkillSchema.index({ profileId: 1, name: 1 }, { unique: true });
