import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Profile, ProfileDocument } from "./schemas/profile.schema";
import {
  ProfileLink,
  ProfileLinkDocument,
} from "./schemas/profile-link.schema";
import { Skill, SkillDocument } from "../skills/schemas/skill.schema";
import { Project, ProjectDocument } from "../projects/schemas/project.schema";
import {
  Experience,
  ExperienceDocument,
} from "../experience/schemas/experience.schema";
import { UpdateProfileInput } from "./dto/update-profile.input";

const PROFILE_NOT_FOUND =
  "No profile has been seeded yet — run `npm run seed`.";

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name)
    private readonly profileModel: Model<ProfileDocument>,
    @InjectModel(ProfileLink.name)
    private readonly profileLinkModel: Model<ProfileLinkDocument>,
    @InjectModel(Skill.name) private readonly skillModel: Model<SkillDocument>,
    @InjectModel(Project.name)
    private readonly projectModel: Model<ProjectDocument>,
    @InjectModel(Experience.name)
    private readonly experienceModel: Model<ExperienceDocument>,
  ) {}

  /** The card only ever has one owner, so this returns the first (and only) Profile row. */
  async findTheProfile() {
    const profile = await this.profileModel.findOne();
    if (!profile) throw new NotFoundException(PROFILE_NOT_FOUND);
    return this.withRelations(profile);
  }

  async update({ id, ...data }: UpdateProfileInput) {
    const profile = await this.profileModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!profile) throw new NotFoundException(PROFILE_NOT_FOUND);
    return this.withRelations(profile);
  }

  /** Mirrors the old Prisma `include` — separate collections, so fetched in parallel. */
  private async withRelations(profile: ProfileDocument) {
    const [links, skills, projects, experience] = await Promise.all([
      this.profileLinkModel.find({ profileId: profile.id }),
      this.skillModel.find({ profileId: profile.id }).sort({ name: 1 }),
      this.projectModel.find({ profileId: profile.id }).sort({ createdAt: -1 }),
      this.experienceModel
        .find({ profileId: profile.id })
        .sort({ startDate: -1 }),
    ]);
    return Object.assign(profile, { links, skills, projects, experience });
  }
}
