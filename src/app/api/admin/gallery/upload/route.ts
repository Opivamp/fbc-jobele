import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { addGalleryImage } from "@/lib/db";
import { uploadMedia } from "@/lib/storage";

export async function POST(request: NextRequest) {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    const singleFile = formData.get("file") as File | null;
    const allFiles = files.length > 0 ? files : singleFile ? [singleFile] : [];

    if (allFiles.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const defaultCategory = (formData.get("category") as string) || "Worship & Services";
    const defaultTitle = (formData.get("title") as string) || "";
    const defaultCaption = (formData.get("caption") as string) || "";
    const photographer = (formData.get("photographer") as string) || "Church Media Unit";

    const savedRecords = [];

    for (let i = 0; i < allFiles.length; i++) {
      const file = allFiles[i];
      const buffer = Buffer.from(await file.arrayBuffer());

      // Upload via unified storage adapter (Cloudinary if configured, else local disk)
      const { url } = await uploadMedia(buffer, file.name, "gallery");

      // Automatically register the image in database
      const title = defaultTitle || file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      const saved = addGalleryImage({
        title,
        caption: defaultCaption || `Moments of worship at First Baptist Church Jobele.`,
        category: defaultCategory,
        imageUrl: url,
        date: new Date().toISOString().split("T")[0],
        photographer,
        isFeatured: i === 0,
        order: 0,
      });

      savedRecords.push(saved);
    }

    return NextResponse.json({
      success: true,
      message: `Successfully uploaded ${savedRecords.length} photograph(s)`,
      images: savedRecords,
    });
  } catch (err) {
    console.error("Gallery upload error:", err);
    return NextResponse.json(
      { error: "Failed to upload image(s). Please check file size and format." },
      { status: 500 }
    );
  }
}
