import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

/// Messages submitted through the card's "contact me" mutation. Write-only from the
/// API's perspective — no public query exposes these.
@Schema({ collection: 'contact_messages' })
export class ContactMessage {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  email!: string;

  @Prop({ required: true })
  message!: string;

  @Prop({ default: () => new Date() })
  createdAt!: Date;
}

export type ContactMessageDocument = HydratedDocument<ContactMessage>;
export const ContactMessageSchema = SchemaFactory.createForClass(ContactMessage);
