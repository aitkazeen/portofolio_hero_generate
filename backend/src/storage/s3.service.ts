import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

@Injectable()
export class S3Service {
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly publicUrl: string;

  constructor(private readonly config: ConfigService) {
    this.bucket = this.config.getOrThrow<string>("S3_BUCKET");
    this.publicUrl = this.config
      .getOrThrow<string>("S3_PUBLIC_URL")
      .replace(/\/$/, "");
    this.client = new S3Client({
      region: this.config.getOrThrow<string>("S3_REGION"),
      endpoint: this.config.getOrThrow<string>("S3_ENDPOINT"),
      forcePathStyle: this.config.get<string>("S3_FORCE_PATH_STYLE") === "true",
      credentials: {
        accessKeyId: this.config.getOrThrow<string>("S3_ACCESS_KEY_ID"),
        secretAccessKey: this.config.getOrThrow<string>("S3_SECRET_ACCESS_KEY"),
      },
    });
  }

  /** Uploads a buffer under `folder/` with a random filename, returns its public URL. */
  async upload(
    folder: string,
    buffer: Buffer,
    contentType: string,
    extension: string,
  ): Promise<string> {
    const key = `${folder}/${randomUUID()}${extension}`;
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      }),
    );
    return `${this.publicUrl}/${key}`;
  }
}
