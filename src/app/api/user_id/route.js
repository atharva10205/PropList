import { parse } from "cookie";
import jwt from "jsonwebtoken";

export async function POST(req) {
  const cookies = parse(req.headers.get("cookie") || "");
  const token = cookies.token;

  if (!token) {
    return new Response(JSON.stringify({ error: "No token" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const decode = jwt.decode(token);
    const userId = decode.id;

    return new Response(JSON.stringify({ userId }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch  {
    return new Response(JSON.stringify({ error: "Invalid token" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}
