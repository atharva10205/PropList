import prisma from "../../../../lib/prisma";

export async function POST(req) {
  const { userId, propertyId } = await req.json();
  const numericUserId = Number(userId);
  const numericPropertyId = Number(propertyId);

  const existingLike = await prisma.like.findFirst({
    where: {
      userId: numericUserId,
      propertyId: numericPropertyId,
    },
  });

  if (existingLike) {
    await prisma.like.delete({
      where: {
        userId_propertyId: {
          userId: numericUserId,
          propertyId: numericPropertyId,
        },
      },
    });
    return new Response(JSON.stringify({ liked: false }), { status: 200 });
  } else {
    await prisma.like.create({
      data: {
        userId: numericUserId,
        propertyId: numericPropertyId,
      },
    });
    return new Response(JSON.stringify({ liked: true }), { status: 201 });
  }
}
