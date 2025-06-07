// Redis-based rate limiting using @upstash/ratelimit
import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';

// Initialize rate limiter
const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(5, '10s'),
  analytics: true
});

export async function POST(request) {
  try {
    // Get IP address or other identifier from request
    const identifier = request.ip || 'anonymous';
    
    // Check rate limit
    const { success, limit, reset, remaining } = await ratelimit.limit(identifier);
    
    if (!success) {
      const retryAfter = Math.ceil((reset - Date.now()) / 1000);
      return new Response(
        JSON.stringify({
          error: `Too many requests. Try again in ${retryAfter} seconds.`,
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

    // Process your request here
    // ...

    return new Response(
      JSON.stringify({ message: "Request processed successfully" }),
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
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}