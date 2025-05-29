import prisma from "../../../../lib/prisma";

export async function POST(req) {
  const { userId } = await req.json();

  const applications = await prisma.Application.findMany({
    where: {
      reciverId: parseInt(userId, 10),
    },
  });

  const senderIds = applications.map((app) => app.senderId);
  const application_ID = applications.map((app) => app.id);//gpt thisss 
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


  return new Response(JSON.stringify(combinedData), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
