import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

@Schema({ collection: "profile_links" })
export class ProfileLink {
  @Prop({ required: true })
  label!: string;

  @Prop({ required: true })
  url!: string;

  @Prop({ required: true, index: true })
  profileId!: string;
}

export type ProfileLinkDocument = HydratedDocument<ProfileLink>;
export const ProfileLinkSchema = SchemaFactory.createForClass(ProfileLink);
