import prisma from "../../../../lib/prisma";

export async function POST(req) {
    const {e} = await req.json();
    console.log(e)

    const response = await prisma.Application.delete({
        where : {
            id : e
        }
    })
    return new Response(JSON.stringify({ message: "Application deleted", data: response }), {
        headers: { "Content-Type": "application/json" },
      });
}