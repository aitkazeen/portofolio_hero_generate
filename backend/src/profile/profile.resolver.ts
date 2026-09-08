import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Profile } from './models/profile.model';
import { ProfileService } from './profile.service';
import { UpdateProfileInput } from './dto/update-profile.input';

@Resolver(() => Profile)
export class ProfileResolver {
  constructor(private readonly profileService: ProfileService) {}

  @Query(() => Profile, { name: 'profile' })
  findTheProfile() {
    return this.profileService.findTheProfile();
  }

  @Mutation(() => Profile)
  updateProfile(@Args('input') input: UpdateProfileInput) {
    return this.profileService.update(input);
  }
}
