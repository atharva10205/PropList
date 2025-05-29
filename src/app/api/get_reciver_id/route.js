import prisma from "../../../../lib/prisma";

export async function POST(req) {
    const {id} = await req.json();
    console.log("didiididi",id)

    const response = await prisma.Property.findUnique({
        where : {
            id : parseInt(id, 10),
        }
    })
    console.log(id)
    return new Response(JSON.stringify(response) , {
        status: 200,
        headers: { "Content-Type": "application/json" },
    })
}