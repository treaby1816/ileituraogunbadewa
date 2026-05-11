import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Only initialize Redis if the environment variables are present
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

// Chatbot rate limiter: 10 requests per 60 seconds (sliding window)
// Export a dummy object if Redis is not configured so the app doesn't crash
export const chatRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "60 s"),
      analytics: true,
      prefix: "@upstash/ratelimit:chat",
    })
  : { limit: async () => ({ success: true, limit: 10, remaining: 10, reset: 0 }) };
