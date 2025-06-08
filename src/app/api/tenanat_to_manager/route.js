import prisma from "../../../../lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET; // Make sure this is set in .env

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

    // 1. Update role in DB
    const updatedUser = await prisma.user.update({
      where: { id: numericUserId },
      data: { role: "manager" },
    });

    // 2. Re-sign new JWT token
    const payload = {
      id: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role,
    };

    const newToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });

    // 3. Set token as a cookie
    const res = new Response(JSON.stringify({ message: "Role updated", user: updatedUser }), {
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
