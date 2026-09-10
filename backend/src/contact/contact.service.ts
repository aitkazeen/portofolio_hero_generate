import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  ContactMessage,
  ContactMessageDocument,
} from "./schemas/contact-message.schema";
import { SubmitContactMessageInput } from "./dto/submit-contact-message.input";

@Injectable()
export class ContactService {
  constructor(
    @InjectModel(ContactMessage.name)
    private readonly contactMessageModel: Model<ContactMessageDocument>,
  ) {}

  submit(input: SubmitContactMessageInput) {
    return this.contactMessageModel.create(input);
  }
}
