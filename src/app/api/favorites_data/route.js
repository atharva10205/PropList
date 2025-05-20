import prisma from "../../../../lib/prisma";

export async function POST(req) {
  const { userId } = await req.json();

  if (!userId) {
    return new Response(JSON.stringify({ error: "Missing userId" }), {
      status: 400,
    });
  }

  const numericId = Number(userId);

  try {
    const properties = await prisma.Property.findMany({
      where: {
        id: numericId,
        like: true,
      },
    });

    console.log(properties)

    return new Response(JSON.stringify(properties), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching properties:", error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
