import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Skill, SkillDocument } from './schemas/skill.schema';
import { CreateSkillInput } from './dto/create-skill.input';

@Injectable()
export class SkillsService {
  constructor(@InjectModel(Skill.name) private readonly skillModel: Model<SkillDocument>) {}

  findAll() {
    return this.skillModel.find().sort({ name: 1 });
  }

  create(input: CreateSkillInput) {
    return this.skillModel.create(input);
  }

  async remove(id: string) {
    const skill = await this.skillModel.findByIdAndDelete(id);
    if (!skill) throw new NotFoundException(`Skill ${id} not found`);
    return skill;
  }
}
