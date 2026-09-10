import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { Throttle } from "@nestjs/throttler";
import { GqlThrottlerGuard } from "../common/guards/gql-throttler.guard";
import { ContactMessage } from "./models/contact-message.model";
import { ContactService } from "./contact.service";
import { SubmitContactMessageInput } from "./dto/submit-contact-message.input";

@Resolver(() => ContactMessage)
export class ContactResolver {
  constructor(private readonly contactService: ContactService) {}

  /** Stays public (this is the site's "contact me" form) but rate-limited to
   * curb spam — 3 submissions per minute per caller. */
  @Mutation(() => ContactMessage)
  @UseGuards(GqlThrottlerGuard)
  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  submitContactMessage(@Args("input") input: SubmitContactMessageInput) {
    return this.contactService.submit(input);
  }
}
