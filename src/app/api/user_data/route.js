import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { cookies } from "next/headers";

async function getUsernameByEmail(emailFromCookie) {
  if (!emailFromCookie) return null;

  const user = await prisma.user.findUnique({
    where: { email: emailFromCookie },
    select: { username: true },
  });

  return user?.username || null;
}

export async function GET() {
  const cookieStore = await cookies(); // ✅ await here
  const email = cookieStore.get("email")?.value;

  const username = await getUsernameByEmail(email);

  return NextResponse.json({ username });
}
