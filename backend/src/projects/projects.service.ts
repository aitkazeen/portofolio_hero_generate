import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from './schemas/project.schema';
import { CreateProjectInput } from './dto/create-project.input';
import { UpdateProjectInput } from './dto/update-project.input';

@Injectable()
export class ProjectsService {
  constructor(@InjectModel(Project.name) private readonly projectModel: Model<ProjectDocument>) {}

  findAll(featured?: boolean) {
    const filter = featured === undefined ? {} : { featured };
    return this.projectModel.find(filter).sort({ createdAt: -1 });
  }

  create(input: CreateProjectInput) {
    return this.projectModel.create(input);
  }

  async update({ id, ...data }: UpdateProjectInput) {
    const project = await this.projectModel.findByIdAndUpdate(id, data, { new: true });
    if (!project) throw new NotFoundException(`Project ${id} not found`);
    return project;
  }

  async remove(id: string) {
    const project = await this.projectModel.findByIdAndDelete(id);
    if (!project) throw new NotFoundException(`Project ${id} not found`);
    return project;
  }
}
