import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function POST(req) {
  try {
    const { userId } = await req.json();
    console.log("Received userId:", userId);

    const applications = await prisma.Application.findMany({
      where: {
        senderId: parseInt(userId, 10),
      },
    });

    const reciverIds = applications.map((app) => app.reciverId);
    const addIds = applications.map((app) => app.addId);

    const managers = await prisma.User.findMany({
      where: {
        id: { in: reciverIds },
      },
      select: {
        id: true,
        username: true,
      },
    });

    const properties = await prisma.Property.findMany({
      where: {
        id: { in: addIds },
      },
    });


    const finalData = applications.map((app) => {
      const manager = managers.find((m) => m.id === app.reciverId);
      const property = properties.find((p) => p.id === app.addId);

      return {
        id: app.id,
        addId: app.addId,
        contact: app.contact,
        message: app.message,
        status: app.status, 
        managerUsername: manager ? manager.username : null,
        propertyimage: property ? property.imageURLs[0] : null,
        propertyName: property ? property.propertyName : null,
        description: property ? property.description : null,
        pricePerMonth: property ? property.pricePerMonth : null,
        beds: property ? property.beds : null,
        baths: property ? property.baths : null,
      };
    });


    return NextResponse.json({ applications: finalData }, { status: 200 });
  } catch (error) {
    console.error("Error in POST /your-route:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
