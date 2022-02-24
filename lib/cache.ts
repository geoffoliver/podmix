import Redis from 'ioredis';
import Cache from 'ioredis-cache';

const cache = new Cache(new Redis({
  port: Number(process.env.REDIS_PORT.toString()),
  host: process.env.REDIS_HOST,
  keyPrefix: 'podmix:',
}));

export default cache;
