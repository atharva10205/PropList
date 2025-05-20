import prisma from "../../../../lib/prisma";

export async function POST(req) {
  const { userId, propertyId } = await req.json();
  const numericUserId = Number(userId);
  const numericPropertyId = Number(propertyId);

  const cheak_like = await prisma.like.findFirst({
    where: { userId: numericUserId, propertyId: numericPropertyId },
  });
  
  if (cheak_like) {
    return new Response(JSON.stringify({ liked: true }), { status: 200 });
  } else {
    return new Response(JSON.stringify({ liked: false }), { status: 200 });
  }
}
