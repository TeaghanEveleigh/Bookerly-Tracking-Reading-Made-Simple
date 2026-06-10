// src/lib/redis/redis-client.ts
import { createClient } from 'redis';

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  throw new Error('REDIS_URL is required');
}

export const redisClient = createClient({
  url: redisUrl,
});

redisClient.on('error', (error) => {
  console.error('Redis client error:', error);
});

export const connectRedis = async (): Promise<void> => {
  if (redisClient.isOpen) {
    return;
  }

  await redisClient.connect();
};

export type RedisClient = typeof redisClient;