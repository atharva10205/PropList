import prisma from "../../../../lib/prisma";

export async function POST(req) {
  try {
    const body = await req.json();
    const { Contact, reciver_id, Message, id, userId } = body;

    console.log("reciver_id", reciver_id);
    console.log("userId", userId);

    const sameUser = await prisma.Application.findFirst({
      where: {
        reciverId: parseInt(userId, 10),
        senderId: parseInt(userId, 10),
      },
    });

    if (!sameUser) {
      console.log("samememmem ussseeerrrr")
      return new Response(
        JSON.stringify({
          success: false,
          message: "You are the owner",
        }),
        {
          status: 409,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const existingApplication = await prisma.Application.findFirst({
      where: {
        senderId: parseInt(userId, 10),
        reciverId: parseInt(reciver_id, 10),
        addId: parseInt(id, 10),
      },
    });

    if (existingApplication) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Application already exists",
        }),
        {
          status: 409,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    await prisma.Application.create({
      data: {
        senderId: parseInt(userId, 10),
        reciverId: parseInt(reciver_id, 10),
        addId: parseInt(id, 10),
        contact: Contact,
        message: Message,
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Application created successfully",
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error creating application:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to create application",
        error: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
