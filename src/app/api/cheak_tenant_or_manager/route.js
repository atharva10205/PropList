import prisma from "../../../../lib/prisma";

export async function POST(req) {
  try {
    const { userId } = await req.json();

    const numericUserId = parseInt(userId, 10);
    if (isNaN(numericUserId)) {
      return new Response(JSON.stringify({ error: "Invalid userId" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const response = await prisma.user.findUnique({
      where: {
        id: numericUserId, // 👈 converted to integer
      },
    });

    return new Response(JSON.stringify(response), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
