import prisma from "../../../../lib/prisma";

export async function POST() {
  const latestProperties = await prisma.property.findMany({
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  return new Response(JSON.stringify(latestProperties), {
    headers: { "Content-Type": "application/json" },
  });
}
