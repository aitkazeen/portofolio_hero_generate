import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Experience, ExperienceDocument } from "./schemas/experience.schema";
import { CreateExperienceInput } from "./dto/create-experience.input";

@Injectable()
export class ExperienceService {
  constructor(
    @InjectModel(Experience.name)
    private readonly experienceModel: Model<ExperienceDocument>,
  ) {}

  findAll() {
    return this.experienceModel.find().sort({ startDate: -1 });
  }

  create(input: CreateExperienceInput) {
    return this.experienceModel.create(input);
  }

  async remove(id: string) {
    const experience = await this.experienceModel.findByIdAndDelete(id);
    if (!experience) throw new NotFoundException(`Experience ${id} not found`);
    return experience;
  }
}
