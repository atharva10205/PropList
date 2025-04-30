import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req) {
    const cookieStore = await cookies();
    const response = cookieStore.get("token").value;
    const decode = jwt.decode(response);
    const userId = decode.id;
    try {
    const {
      email,
      propertyName,
      description,
      pricePerMonth,
      securityDeposit,
      applicationFee,
      beds,
      baths,
      squareFeet,
      petsAllowed,
      parkingIncluded,
      propertyType,
      amenities,
      highlights,
      address,
      city,
      state,
      postalCode,
      country,
      latitude,
      longitude,
    } = await req.json();

    const property = await prisma.property.create({
      data: {
        email,
        propertyName,
        description,
        pricePerMonth,
        securityDeposit,
        applicationFee,
        beds,
        baths,
        squareFeet,
        petsAllowed,
        parkingIncluded,
        propertyType,
        amenities,
        highlights,
        address,
        city,
        state,
        postalCode,
        country,
        latitude,
        longitude,
        user: {
            connect: { id: userId } // Pass an existing User's ID here
          }
      },
    });

    return new Response(JSON.stringify(property), { status: 201 });
  } catch (error) {
    console.error("Error creating property:", error);
    return new Response(JSON.stringify({ error: "Failed to create listing" }), {
      status: 500,
    });
  }
}
