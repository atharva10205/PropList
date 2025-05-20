// lib/redis.js
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: 'https://tight-mastodon-23771.upstash.io',
  token: 'AVzbAAIjcDE3YjQ5ZmNmMDk1YjM0NmM2YjRlNWI0MDE2NWY5ODAxNHAxMA',
});

export default redis;
