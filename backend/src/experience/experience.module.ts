import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExperienceResolver } from './experience.resolver';
import { ExperienceService } from './experience.service';
import { Experience, ExperienceSchema } from './schemas/experience.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Experience.name, schema: ExperienceSchema }])],
  providers: [ExperienceResolver, ExperienceService],
  exports: [ExperienceService, MongooseModule],
})
export class ExperienceModule {}
