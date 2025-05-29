import prisma from "../../../../lib/prisma";

export async function POST(req) {
    const { applicationId} = await req.json();
    console.log(applicationId)

    const response = await prisma.Application.update({
        where : {
            id : applicationId
        }, data : {
            status : "decline"
        }
    })
    return new Response(JSON.stringify({ message: "Application declined", data: response }), {
        headers: { "Content-Type": "application/json" },
      });
}