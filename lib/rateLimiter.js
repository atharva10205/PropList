import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';

// Initialize rate limiter with correct syntax
const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(5, '10s'),  // Fixed this line
  analytics: true
});

export async function POST(request) {
  try {
    // Get IP address from request (Note: In Next.js 13+ API routes, use headers)
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    
    // Check rate limit
    const { success, limit, reset, remaining } = await ratelimit.limit(ip);
    
    if (!success) {
      const retryAfter = Math.ceil((reset - Date.now()) / 1000);
      return new Response(
        JSON.stringify({
          error: `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
          retryAfter
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': retryAfter.toString()
          }
        }
      );
    }

    // Your route logic here
    return new Response(
      JSON.stringify({ success: true, remaining }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString()
        }
      }
    );

  } catch (error) {
    console.error('Rate limit error:', error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}