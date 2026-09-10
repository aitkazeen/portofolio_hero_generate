import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

/// The single "business card" owner. The API is a monolith serving one profile.
@Schema({ timestamps: true, collection: "profiles" })
export class Profile {
  @Prop({ required: true })
  fullName!: string;

  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  bio!: string;

  @Prop({ required: true })
  email!: string;

  @Prop()
  phone?: string;

  @Prop()
  location?: string;

  @Prop()
  avatarUrl?: string;

  /// S3/MinIO URL of the durable CV copy, set by the seed/import scripts.
  @Prop()
  resumeUrl?: string;

  /// Freeform "Language (proficiency)" strings, e.g. "English (full professional)".
  @Prop({ type: [String], default: [] })
  languages!: string[];

  /// Freeform "Name – Issuer (Year)" strings, e.g. "Design Patterns – University of Alberta (2021)".
  @Prop({ type: [String], default: [] })
  certifications!: string[];

  createdAt!: Date;
  updatedAt!: Date;
}

export type ProfileDocument = HydratedDocument<Profile>;
export const ProfileSchema = SchemaFactory.createForClass(Profile);
