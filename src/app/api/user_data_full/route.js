import prisma from "../../../../lib/prisma";


export async function POST(req) {
    const {userId} = await req.json();
    

    const response = await prisma.User.findUnique({
        where : {
            id : userId
        }
    })
    return new Response(JSON.stringify(response) , {
        status: 200,
        headers: { "Content-Type": "application/json" },
    })
}