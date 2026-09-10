import { extname } from "path";
import {
  BadRequestException,
  Controller,
  Param,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { AdminGuard } from "../common/guards/admin.guard";
import { S3Service } from "./s3.service";

/** Folders GraphQL mutations know how to point at (Profile.avatarUrl, Project.imageUrl, Profile.resumeUrl). */
const UPLOAD_FOLDERS = ["avatars", "project-images", "resumes"] as const;
type UploadFolder = (typeof UPLOAD_FOLDERS)[number];

/** Allowed MIME types + extensions per folder — rejects anything else (e.g. an
 * .svg/.html upload that would otherwise execute as a stored-XSS payload once
 * served back from the public bucket). */
const FOLDER_RULES: Record<
  UploadFolder,
  { mimeTypes: string[]; extensions: string[] }
> = {
  avatars: {
    mimeTypes: ["image/jpeg", "image/png", "image/webp"],
    extensions: [".jpg", ".jpeg", ".png", ".webp"],
  },
  "project-images": {
    mimeTypes: ["image/jpeg", "image/png", "image/webp"],
    extensions: [".jpg", ".jpeg", ".png", ".webp"],
  },
  resumes: {
    mimeTypes: ["application/pdf"],
    extensions: [".pdf"],
  },
};

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10MB

/**
 * Plain REST endpoint for binary file uploads — GraphQL has no first-class way to
 * carry multipart bodies. Clients POST here first, then pass the returned `url` into
 * a GraphQL mutation (updateProfile.avatarUrl/resumeUrl, createProject.imageUrl).
 */
@Controller("uploads")
@UseGuards(AdminGuard)
export class StorageController {
  constructor(private readonly s3: S3Service) {}

  @Post(":folder")
  @UseInterceptors(FileInterceptor("file"))
  async upload(
    @Param("folder") folder: string,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: MAX_UPLOAD_BYTES })
        .build({ fileIsRequired: true }),
    )
    file: Express.Multer.File,
  ) {
    if (!UPLOAD_FOLDERS.includes(folder as UploadFolder)) {
      throw new BadRequestException(
        `folder must be one of: ${UPLOAD_FOLDERS.join(", ")}`,
      );
    }

    const rules = FOLDER_RULES[folder as UploadFolder];
    const extension = extname(file.originalname).toLowerCase();
    if (
      !rules.mimeTypes.includes(file.mimetype) ||
      !rules.extensions.includes(extension)
    ) {
      throw new BadRequestException(
        `${folder} accepts only: ${rules.extensions.join(", ")}`,
      );
    }

    const url = await this.s3.upload(
      folder,
      file.buffer,
      file.mimetype,
      extension,
    );
    return { url };
  }
}
