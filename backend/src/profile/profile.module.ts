import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfileResolver } from './profile.resolver';
import { ProfileService } from './profile.service';
import { Profile, ProfileSchema } from './schemas/profile.schema';
import { ProfileLink, ProfileLinkSchema } from './schemas/profile-link.schema';
import { SkillsModule } from '../skills/skills.module';
import { ProjectsModule } from '../projects/projects.module';
import { ExperienceModule } from '../experience/experience.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Profile.name, schema: ProfileSchema },
      { name: ProfileLink.name, schema: ProfileLinkSchema },
    ]),
    // Re-export MongooseModule from each of these so ProfileService can assemble
    // the aggregate Profile (links/skills/projects/experience) without duplicating
    // their schema registration here.
    SkillsModule,
    ProjectsModule,
    ExperienceModule,
  ],
  providers: [ProfileResolver, ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}
