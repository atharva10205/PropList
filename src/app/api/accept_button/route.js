import prisma from "../../../../lib/prisma";

export async function POST(req) {
    const { applicationId} = await req.json();

    const response = await prisma.Application.update({
        where : {
            id : applicationId
        }, data : {
            status : "accepted"
        }
    })
    return new Response(JSON.stringify({ message: "Application accepted", data: response }), {
        headers: { "Content-Type": "application/json" },
      });
}