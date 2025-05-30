import prisma from "../../../../lib/prisma";

export async function POST(req) {
  try {
    const { applicationId, userId ,add_id} = await req.json();

    console.log("applicationId", applicationId);
    console.log("userId", userId);
    console.log("add_id", add_id);



    const acceptedApplication = await prisma.Application.update({
      where: { id: applicationId },
      data: { status: "accepted" },
    });

    await prisma.Application.updateMany({
      where: {
        addId: add_id,
        reciverId: userId,
        status: "under_process",
      },
      data: { status: "decline" },
    });

    return new Response(
      JSON.stringify({
        message: "Application accepted, others declined",
        data: acceptedApplication,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Error", error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
