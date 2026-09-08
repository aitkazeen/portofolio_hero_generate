import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactResolver } from './contact.resolver';
import { ContactService } from './contact.service';
import { ContactMessage, ContactMessageSchema } from './schemas/contact-message.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: ContactMessage.name, schema: ContactMessageSchema }])],
  providers: [ContactResolver, ContactService],
})
export class ContactModule {}
