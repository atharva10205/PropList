const attemptsMap = new Map();

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; 
const MAX_ATTEMPTS = 5;

export function checkLoginAttempts(email) {
  const now = Date.now();
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

export function recordFailedAttempt(email) {
  const now = Date.now();
  const record = attemptsMap.get(email) || {
    attempts: [],
    blockedUntil: null,
  };

  record.attempts.push(now);
  attemptsMap.set(email, record);
}



export function clearLoginAttempts(email) {
  attemptsMap.delete(email);
}