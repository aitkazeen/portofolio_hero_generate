import { extname } from "path";
import {
  BadRequestException,
  Controller,
  Param,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { S3Service } from "./s3.service";

/** Folders GraphQL mutations know how to point at (Profile.avatarUrl, Project.imageUrl, Profile.resumeUrl). */
const UPLOAD_FOLDERS = ["avatars", "project-images", "resumes"] as const;
type UploadFolder = (typeof UPLOAD_FOLDERS)[number];

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10MB

/**
 * Plain REST endpoint for binary file uploads — GraphQL has no first-class way to
 * carry multipart bodies. Clients POST here first, then pass the returned `url` into
 * a GraphQL mutation (updateProfile.avatarUrl/resumeUrl, createProject.imageUrl).
 */
@Controller("uploads")
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

    const url = await this.s3.upload(
      folder,
      file.buffer,
      file.mimetype,
      extname(file.originalname),
    );
    return { url };
  }
}
