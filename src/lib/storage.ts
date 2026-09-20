import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

// Initialize Cloudinary if environment variables are provided
const hasCloudinaryCredentials = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (hasCloudinaryCredentials) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export function isCloudStorageEnabled(): boolean {
  return hasCloudinaryCredentials;
}

export interface UploadResult {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
}

/**
 * Upload an image or file buffer to Cloudinary (or fallback to local disk in dev)
 */
export async function uploadMedia(
  buffer: Buffer,
  originalFilename: string,
  folder: string = "gallery"
): Promise<UploadResult> {
  // 1. If Cloudinary credentials are set (e.g. on Vercel), upload to Cloudinary CDN
  if (hasCloudinaryCredentials) {
    return new Promise<UploadResult>((resolve, reject) => {
      const cleanName = path
        .parse(originalFilename)
        .name.replace(/[^a-zA-Z0-9_-]/g, "_");
      const publicId = `${cleanName}_${Date.now()}`;

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `fbc-jobele/${folder}`,
          public_id: publicId,
          resource_type: "auto",
        },
        (error, result) => {
          if (error || !result) {
            console.error("Cloudinary upload error:", error);
            return reject(error || new Error("Cloudinary upload failed"));
          }

          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
          });
        }
      );

      uploadStream.end(buffer);
    });
  }

  // 2. Fallback to local storage (for local development)
  const uploadsDir = path.join(process.cwd(), "public", "uploads", folder);
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const ext = path.extname(originalFilename) || ".jpg";
  const cleanBase = path
    .basename(originalFilename, ext)
    .replace(/[^a-zA-Z0-9_-]/g, "_");
  const uniqueName = `${cleanBase}_${Date.now()}${ext}`;
  const filePath = path.join(uploadsDir, uniqueName);

  fs.writeFileSync(filePath, buffer);

  const localUrl = `/uploads/${folder}/${uniqueName}`;
  return {
    url: localUrl,
    publicId: uniqueName,
  };
}

/**
 * Delete a media file from Cloudinary (or local disk in dev)
 */
export async function deleteMedia(
  urlOrPublicId: string,
  folder: string = "gallery"
): Promise<boolean> {
  // If it's a Cloudinary asset
  if (hasCloudinaryCredentials && (urlOrPublicId.includes("cloudinary.com") || !urlOrPublicId.startsWith("/"))) {
    try {
      // Extract public_id if full URL provided
      let publicId = urlOrPublicId;
      if (urlOrPublicId.includes("res.cloudinary.com")) {
        const parts = urlOrPublicId.split("/");
        const uploadIndex = parts.indexOf("upload");
        if (uploadIndex !== -1) {
          // Slice everything after 'upload/vXXXX/' or 'upload/'
          const subParts = parts.slice(uploadIndex + 1);
          if (subParts[0]?.startsWith("v") && /^\d+$/.test(subParts[0].slice(1))) {
            subParts.shift();
          }
          const fullPathWithExt = subParts.join("/");
          publicId = fullPathWithExt.replace(/\.[^/.]+$/, "");
        }
      }

      const result = await cloudinary.uploader.destroy(publicId);
      return result.result === "ok" || result.result === "not found";
    } catch (err) {
      console.error("Error deleting from Cloudinary:", err);
      return false;
    }
  }

  // Local file fallback
  try {
    const filename = path.basename(urlOrPublicId);
    const localPath = path.join(process.cwd(), "public", "uploads", folder, filename);
    if (fs.existsSync(localPath)) {
      fs.unlinkSync(localPath);
      return true;
    }
    return false;
  } catch (err) {
    console.error("Error deleting local file:", err);
    return false;
  }
}
