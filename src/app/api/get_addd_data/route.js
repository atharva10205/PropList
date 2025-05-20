import { PrismaClient } from "@prisma/client";

export async function POST(req) {
    const prisma = new PrismaClient();

    try {
        const {id} = await req.json();
        const numericId = parseInt(id, 10);

       
        
        const information = await prisma.property.findUnique({
            where : {
                id : numericId
            }
        })

        return new Response(JSON.stringify({ information }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });

    } catch (error) {
        console.log("error in get_addd_data" , error)
    }
}