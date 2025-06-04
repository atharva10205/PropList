import prisma from "../../../../lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  try {
    const { userId } = await req.json();

    const numericUserId = parseInt(userId, 10);
    if (isNaN(numericUserId)) {
      return new Response(JSON.stringify({ error: "Invalid userId" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Step 1: Update role to tenant in DB
    const updatedUser = await prisma.user.update({
      where: { id: numericUserId },
      data: { role: "tenant" },
    });

    // Step 2: Re-sign a new JWT with updated role
    const payload = {
      id: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role,
    };

    const newToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });

    // Step 3: Set new token in cookie
    const res = new Response(JSON.stringify({ message: "Role switched to tenant", user: updatedUser }), {
      headers: { "Content-Type": "application/json" },
    });

    res.headers.append(
      "Set-Cookie",
      `token=${newToken}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${60 * 60 * 24 * 30}`
    );

    return res;
  } catch (error) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
