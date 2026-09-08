import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ContactMessage } from './models/contact-message.model';
import { ContactService } from './contact.service';
import { SubmitContactMessageInput } from './dto/submit-contact-message.input';

@Resolver(() => ContactMessage)
export class ContactResolver {
  constructor(private readonly contactService: ContactService) {}

  @Mutation(() => ContactMessage)
  submitContactMessage(@Args('input') input: SubmitContactMessageInput) {
    return this.contactService.submit(input);
  }
}
