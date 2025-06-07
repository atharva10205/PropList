// Redis-based rate limiting using @upstash/ratelimit (for distributed environments)
import { Ratelimit, slidingWindow } from '@upstash/ratelimit';
import { kv } from '@vercel/kv'; // or your own Redis instance

// Create an Upstash rate limiter: 5 requests per 15 minutes
const ratelimit = new Ratelimit({
  redis: kv,
  limiter: slidingWindow(5, '15m'),
  analytics: true,
});

// A fallback Map to keep track of login attempts per email (used locally)
const attemptsMap = new Map();

// Time window for local fallback (15 minutes in milliseconds)
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

/**
 * Checks whether a user is allowed to attempt login based on their email.
 */
export async function checkLoginAttempts(email) {
  const now = Date.now();

  // Use Upstash ratelimit check (keyed by user email)
  const { success, pending, limit, reset, remaining } = await ratelimit.limit(email);

  if (!success) {
    const retryAfter = Math.ceil((reset - Date.now()) / 1000);
    return {
      allowed: false,
      retryAfter,
      message: `Too many attempts. Try again in ${retryAfter} seconds.`,
    };
  }

  // Optional: Use local fallback in development or testing
  const record = attemptsMap.get(email) || {
    attempts: [],
    blockedUntil: null,
  };

  if (record.blockedUntil && record.blockedUntil > now) {
    const retryAfter = Math.ceil((record.blockedUntil - now) / 1000);
    return {
      allowed: false,
      retryAfter,
      message: `Too many attempts. Try again in ${retryAfter} seconds.`,
    };
  }

  // Filter old attempts
  record.attempts = record.attempts.filter((time) => now - time < RATE_LIMIT_WINDOW_MS);
  const attemptsLeft = MAX_ATTEMPTS - record.attempts.length;

  if (attemptsLeft <= 0) {
    record.blockedUntil = now + RATE_LIMIT_WINDOW_MS;
    attemptsMap.set(email, record);
    return {
      allowed: false,
      retryAfter: Math.ceil(RATE_LIMIT_WINDOW_MS / 1000),
      message: `Too many attempts. Try again in ${Math.ceil(RATE_LIMIT_WINDOW_MS / 1000)} seconds.`,
    };
  }

  return {
    allowed: true,
    attemptsLeft,
  };
}

/**
 * Records a failed login attempt for the specified email.
 */
export function recordFailedAttempt(email) {
  const now = Date.now();
  const record = attemptsMap.get(email) || {
    attempts: [],
    blockedUntil: null,
  };

  record.attempts.push(now);
  attemptsMap.set(email, record);
}

/**
 * Clears all login attempts and unblocks the user.
 */
export function clearLoginAttempts(email) {
  attemptsMap.delete(email);
}
