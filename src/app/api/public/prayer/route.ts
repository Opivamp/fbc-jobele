import { NextRequest, NextResponse } from "next/server";
import { ensureDbLoadedAsync, addPrayerRequestAsync } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, request: prayerText, isAnonymous, preferredContact, category } = body;

    if (!prayerText || prayerText.trim().length === 0) {
      return NextResponse.json(
        { error: "Please enter your prayer request." },
        { status: 400 }
      );
    }

    await ensureDbLoadedAsync();

    const saved = await addPrayerRequestAsync({
      name: isAnonymous ? "Anonymous Believer" : name?.trim() || "Anonymous Believer",
      email: email?.trim() || "",
      phone: phone?.trim() || "",
      request: prayerText.trim(),
      isAnonymous: Boolean(isAnonymous),
      preferredContact: preferredContact || "none",
      category: category || "General",
    });

    return NextResponse.json({
      success: true,
      message: "Thank you. Your prayer request has been received.",
      id: saved.id,
    });
  } catch (err) {
    console.error("Error submitting prayer request:", err);
    return NextResponse.json(
      { error: "Failed to submit prayer request. Please try again." },
      { status: 500 }
    );
  }
}
