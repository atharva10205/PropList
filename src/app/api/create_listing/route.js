import { PrismaClient } from "@prisma/client";
import { parse } from "cookie";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(req) {
  const cookies = parse(req.headers.get("cookie") || "");
  const token = cookies.token;

  if (!token) {
    return new Response(JSON.stringify({ error: "Unauthorized. Token missing." }), {
      status: 401,
    });
  }

  const decode = jwt.decode(token); // Use jwt.verify() in production
  if (!decode?.id) {
    return new Response(JSON.stringify({ error: "Unauthorized. Invalid token." }), {
      status: 401,
    });
  }

  const userId = decode.id;

  try {
    const form = await req.formData();

    const property = await prisma.property.create({
      data: {
        propertyName: form.get("propertyName"),
        description: form.get("description"),
        pricePerMonth: form.get("pricePerMonth"),
        securityDeposit: form.get("securityDeposit"),
        applicationFee: form.get("applicationFee"),
        beds: form.get("beds"),
        baths: form.get("baths"),
        squareFeet: form.get("squareFeet"),
        petsAllowed: form.get("petsAllowed") === "true",
        parkingIncluded: form.get("parkingIncluded") === "true",
        propertyType: form.get("propertyType"),
        amenities: form.get("amenities"),
        highlights: form.get("highlights"),
        address: form.get("address"),
        city: form.get("city"),
        state: form.get("state"),
        postalCode: form.get("postalCode"),
        country: form.get("country"),
        latitude: parseFloat(form.get("latitude")),
        longitude: parseFloat(form.get("longitude")),
        user: {
          connect: { id: userId },
        },
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
