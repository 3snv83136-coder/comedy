import { randomUUID } from "crypto";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v2 as cloudinary } from "cloudinary";

type UploadedFile = {
  url: string;
};

const uploadProvider = process.env.UPLOAD_PROVIDER || "local";

async function ensureUploadsDir() {
  const uploadPath = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadPath, { recursive: true });
  return uploadPath;
}

export async function uploadFile(
  file: File,
  folder: "submissions" | "artists" | "events"
): Promise<UploadedFile> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const ext =
    (file.type === "application/pdf"
      ? ".pdf"
      : file.name.split(".").pop()
        ? `.${file.name.split(".").pop()}`
        : "") || "";
  const key = `${folder}/${randomUUID()}${ext}`;

  if (uploadProvider === "s3") {
    const bucket = process.env.S3_BUCKET!;
    const region = process.env.S3_REGION!;
    const endpoint = process.env.S3_ENDPOINT;
    const client = new S3Client({
      region,
      endpoint,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!
      },
      forcePathStyle: !!endpoint
    });

    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: buffer,
        ContentType: file.type
      })
    );

    const publicBase =
      process.env.S3_PUBLIC_URL_BASE ||
      `https://${bucket}.s3.${region}.amazonaws.com`;

    return { url: `${publicBase}/${key}` };
  }

  if (uploadProvider === "cloudinary") {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });

    const upload = await new Promise<UploadedFile>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder:
            process.env.CLOUDINARY_FOLDER ||
            `biiip-comedy-club/${folder}`,
          resource_type: "auto"
        },
        (error, result) => {
          if (error || !result) return reject(error);
          resolve({ url: result.secure_url });
        }
      );
      uploadStream.end(buffer);
    });

    return upload;
  }

  // Local dev storage
  const uploadsDir = await ensureUploadsDir();
  const fullPath = path.join(uploadsDir, key.replace(/\//g, "_"));
  await writeFile(fullPath, buffer);
  return { url: `/uploads/${key.replace(/\//g, "_")}` };
}

