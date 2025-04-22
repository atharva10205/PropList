import axios from "axios";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${query}`,
      {
        headers: {
          "User-Agent": "YourAppName/1.0 (youremail@example.com)",
        },
      }
    );

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to fetch location" }), {
      status: 500,
    });
  }
}
