import prisma from '../../../../lib/prisma';

export async function POST(req) {
  const { userId , pfpUrl} = await req.json();

  const existingUser = await prisma.user.update({
    where: { id : userId },
    data : { pfpUrl : pfpUrl}
  });

  return new Response(JSON.stringify(existingUser), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
}
