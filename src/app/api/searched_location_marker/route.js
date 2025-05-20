import prisma from "../../../../lib/prisma";

export async function POST(req) {
  try {
    const { location } = await req.json();
    const [lat, lng] = location;


    const markers = await prisma.property.findMany({
      where: {
        latitude: {
          gte: lat - 0.27,
          lte: lat + 0.27,
        },
        longitude: {
          gte: lng - 0.434,
          lte: lng + 0.434,
        },
      },
    });


    return Response.json({ markers }); 
  } catch (error) {
    console.error("Error in /api/searched_location_marker:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
