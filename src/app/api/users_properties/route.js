import prisma from "../../../../lib/prisma";
import redis from "../../../../lib/redis";

export async function POST(req) {
    const body = await req.json();
    const userId = body.userId; 


    if (!userId) {
        return new Response(JSON.stringify({ error: "Missing userId" }), { status: 400 });
    }

    const cached = await redis.get(`properties:${userId}`);
    if(cached){
        return new Response(JSON.stringify(cached) , {
            status: 200,
            headers: { "Content-Type": "application/json" },
        })
    }

    const properties = await prisma.property.findMany({
        where : {
            userId : userId
        }
    })
    await redis.set(`properties:${userId}`,properties,{ex : 60})

    return new Response(JSON.stringify(properties) , {
        status: 200,
        headers: { "Content-Type": "application/json" },
    })
}
