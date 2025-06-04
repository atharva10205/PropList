import prisma from "../../../../lib/prisma";
import redis from "../../../../lib/redis";

export async function POST(req) {
  const { userId } = await req.json();
  const numericUserId = parseInt(userId, 10);

  if (!userId) {
    return new Response(JSON.stringify({ error: "Missing userId" }), {
      status: 400,
    });
  }

  const cache = await redis.get(`applications:${numericUserId}`);
  if (cache) {
    return new Response(JSON.stringify(cache), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const applications = await prisma.Application.findMany({
    where: {
      reciverId: numericUserId,
    },
  });

  const senderIds = applications.map((app) => app.senderId);
  const addIds = applications.map((app) => app.addId);

  const senders = await prisma.User.findMany({
    where: {
      id: {
        in: senderIds,
      },
    },
    select: {
      id: true,
      username: true,
      email: true,
    },
  });

  const properties = await prisma.Property.findMany({
    where: {
      id: {
        in: addIds,
      },
    },
    select: {
      id: true,
      propertyName: true,
      description: true,
      pricePerMonth: true,
      imageURLs: true,
      beds: true,
      baths: true,
    },
  });

  const combinedData = applications.map((app) => {
    const sender = senders.find((s) => s.id === app.senderId);
    const property = properties.find((p) => p.id === app.addId);

    return {
      applicationId: app.id,
      contact: app.contact,
      message: app.message,
      status: app.status,
      sender: {
        id: sender?.id,
        username: sender?.username,
        email: sender?.email,
      },
      property: property
        ? {
            id: property.id,
            propertyName: property.propertyName,
            description: property.description,
            pricePerMonth: property.pricePerMonth,
            imageURL: property.imageURLs?.[0] || null,
            beds: property.beds,
            baths: property.baths,
          }
        : null,
    };
  });

  await redis.set(`applications:${numericUserId}`, combinedData, { ex: 60 });

  return new Response(JSON.stringify(combinedData), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
