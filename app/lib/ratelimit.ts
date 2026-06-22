import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Distributed rate limiting via Upstash Redis. In-memory counters do not work
// on serverless: requests fan out across stateless instances, so no single
// instance sees the true count. A shared Redis counter fixes that.
const redis = Redis.fromEnv();

const perMinute = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 m'),
  prefix: 'rl:min',
});

const perDay = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(50, '1 d'),
  prefix: 'rl:day',
});

// Returns true if the request is allowed, false if it should be blocked.
export async function checkRateLimit(ip: string): Promise<boolean> {
  const [minute, day] = await Promise.all([perMinute.limit(ip), perDay.limit(ip)]);
  return minute.success && day.success;
}
