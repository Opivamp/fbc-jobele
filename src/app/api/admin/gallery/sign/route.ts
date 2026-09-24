import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { v2 as cloudinary } from "cloudinary";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json({
      direct: false,
      reason: "Cloudinary credentials not configured on server",
    });
  }

  try {
    const timestamp = Math.round(Date.now() / 1000);
    const folder = "fbc-jobele/gallery";

    // Parameters to sign for Cloudinary upload verification
    const paramsToSign = {
      folder,
      timestamp,
    };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      apiSecret.trim()
    );

    return NextResponse.json({
      direct: true,
      cloudName: cloudName.trim(),
      apiKey: apiKey.trim(),
      timestamp,
      signature,
      folder,
    });
  } catch (err: any) {
    console.error("Cloudinary signing error:", err);
    return NextResponse.json(
      { direct: false, error: err.message || "Signing failed" },
      { status: 500 }
    );
  }
}
