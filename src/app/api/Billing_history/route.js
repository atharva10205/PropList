import prisma from "../../../../lib/prisma";

export async function POST(req) {
  const { addID, ethAmount } = await req.json();
  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth() + 1; // months are 0-based
  const year = now.getFullYear() % 100; // last two digits of the year

  // Format as dd/mm/yy string
  const formattedDate = `${day}/${month}/${year}`;
  const parsedAmount = parseFloat(ethAmount);

  const existing = await prisma.property.findUnique({
    where: { id: addID },
    select: { amount: true, date: true },
  });

  if (!existing) {
    return new Response(JSON.stringify({ error: "Property not found" }), {
      status: 404,
    });
  }

  const updatedAmount = [...existing.amount, parsedAmount];
  const updatedDate = [...existing.date, formattedDate];

  const updated = await prisma.property.update({
    where: { id: addID },
    data: {
      amount: updatedAmount,
      date: updatedDate,
    },
  });

  return new Response(JSON.stringify(updated), { status: 200 });
}
