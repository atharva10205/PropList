import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../../../lib/prisma";
import {
  checkLoginAttempts,
  recordFailedAttempt,
  clearLoginAttempts,
} from "../../../../lib/rateLimiter";

export async function POST(req) {
  const { email, password } = await req.json();

  const limitStatus = checkLoginAttempts(email);
  if (!limitStatus.allowed) {
    return NextResponse.json({ error: limitStatus.message }, { status: 429 });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    // still record a failed attempt to prevent enumeration
    recordFailedAttempt(email);
    return NextResponse.json({ error: "Invalid credentials" }, { status: 404 });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    recordFailedAttempt(email);
    return NextResponse.json(
      {
        error: `Invalid credentials. ${
          limitStatus.attemptsLeft - 1
        } attempts left.`,
      },
      { status: 401 }
    );
  }

  // If we reach here, password matched and user not blocked
  clearLoginAttempts(email); // ✅ Reset on successful login

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  const response = NextResponse.json({ success: true, user });

  response.cookies.set({
    name: "token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  response.cookies.set({
    name: "email",
    value: user.email,
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
