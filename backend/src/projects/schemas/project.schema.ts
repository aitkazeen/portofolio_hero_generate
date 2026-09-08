import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ProjectStatus } from '../../common/enums/project.enums';

@Schema({ collection: 'projects' })
export class Project {
  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  description!: string;

  @Prop({ type: [String], default: [] })
  techStack!: string[];

  @Prop()
  imageUrl?: string;

  @Prop()
  repoUrl?: string;

  @Prop()
  liveUrl?: string;

  @Prop({ default: false })
  featured!: boolean;

  /// Null means unspecified/unknown — not every imported project has a tracked
  /// lifecycle state, so this stays optional rather than adding a fake enum member.
  @Prop({ enum: ProjectStatus })
  status?: ProjectStatus;

  @Prop({ default: () => new Date() })
  createdAt!: Date;

  @Prop({ required: true, index: true })
  profileId!: string;
}

export type ProjectDocument = HydratedDocument<Project>;
export const ProjectSchema = SchemaFactory.createForClass(Project);
