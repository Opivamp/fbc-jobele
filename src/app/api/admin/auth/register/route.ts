import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getUserByEmailOrUsername, addUser } from "@/lib/db";
import { signToken, getAuthCookieName } from "@/lib/auth";

const CHURCH_STAFF_PASSCODE =
  process.env.CHURCH_STAFF_PASSCODE || "FBC-JOBELE-COVENANT-2026";

export async function POST(request: NextRequest) {
  try {
    const { name, email, username, password, role, passcode } = await request.json();

    // 1. Validate required fields
    if (!name || !email || !password || !passcode) {
      return NextResponse.json(
        { error: "Please fill in all required fields, including the Church Staff Passcode." },
        { status: 400 }
      );
    }

    // 2. Validate Church Staff Security Passcode
    if (passcode.trim() !== CHURCH_STAFF_PASSCODE.trim()) {
      return NextResponse.json(
        {
          error:
            "Invalid Church Staff Security Passcode. Registration is strictly restricted to appointed church staff, pastors, and media ministry workers. Contact the Church Secretariat for your authorization key.",
        },
        { status: 403 }
      );
    }

    // 3. Password length check
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long for church data protection." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanUsername = (username || email.split("@")[0]).toLowerCase().trim().replace(/[^a-z0-9_-]/g, "");

    // 4. Check if user already exists
    const existing = getUserByEmailOrUsername(cleanEmail) || getUserByEmailOrUsername(cleanUsername);
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email or username already exists. Please sign in instead." },
        { status: 409 }
      );
    }

    // 5. Allowed roles: content_admin or staff (superadmin only via database)
    const assignedRole = role === "staff" ? "staff" : "content_admin";

    // 6. Hash password
    const passwordHash = bcrypt.hashSync(password, 10);

    // 7. Add user to database
    const newUser = addUser({
      name: name.trim(),
      email: cleanEmail,
      username: cleanUsername,
      passwordHash,
      role: assignedRole,
    });

    // 8. Sign JWT session token
    const token = signToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      name: newUser.name,
    });

    const response = NextResponse.json({
      success: true,
      message: "Church staff account registered successfully.",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });

    // 9. Set authentication cookie
    response.cookies.set(getAuthCookieName(), token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Staff registration error:", err);
    return NextResponse.json(
      { error: "Server error occurred while registering your staff account." },
      { status: 500 }
    );
  }
}
