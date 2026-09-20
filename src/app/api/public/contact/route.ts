import { NextRequest, NextResponse } from "next/server";
import { addContactMessage } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Please fill in all required fields (Name, Email, Message)." },
        { status: 400 }
      );
    }

    const saved = addContactMessage({
      name: name.trim(),
      email: email.trim(),
      phone: phone?.trim() || "",
      subject: subject?.trim() || "General Inquiry",
      message: message.trim(),
    });

    return NextResponse.json({
      success: true,
      message: "Thank you for reaching out to First Baptist Church Jobele. Our pastoral administrative team will respond shortly.",
      id: saved.id,
    });
  } catch (err) {
    console.error("Error submitting contact form:", err);
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}
