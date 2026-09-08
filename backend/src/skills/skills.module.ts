import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SkillsResolver } from './skills.resolver';
import { SkillsService } from './skills.service';
import { Skill, SkillSchema } from './schemas/skill.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Skill.name, schema: SkillSchema }])],
  providers: [SkillsResolver, SkillsService],
  exports: [SkillsService, MongooseModule],
})
export class SkillsModule {}
