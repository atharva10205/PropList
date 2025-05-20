import prisma from "../../../../lib/prisma"; 
import redis from "../../../../lib/redis";

export async function POST(req) {
  const { userId } = await req.json();
  const numericUserId = Number(userId);


  if (!userId) {
    return new Response(JSON.stringify({ error: "Missing userId" }), {
      status: 400,
    });
  }

  const cache = await redis.get(`like:${numericUserId}`);
  if(cache){
  return new Response(JSON.stringify(cache), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
  }

  const likedProperties = await prisma.like.findMany({
    where: { userId: numericUserId },
  });

  const propertyIds = likedProperties.map((like) => like.propertyId);

  const liked_list = await prisma.Property.findMany({
    where: { id: { in : propertyIds} },
  });

  await redis.set(`like:${numericUserId}`,liked_list,{ex : 60})

  return new Response(JSON.stringify(liked_list), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
