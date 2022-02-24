import type { NextApiRequest, NextApiResponse } from 'next'
import Parser from 'rss-parser';
import crypto from 'crypto';

import cache from '@/lib/cache';
import iTunes from '@/lib/external/itunes';

const CACHE_TIME = 60 * 60;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const itunes = new iTunes();

  const results = await itunes.lookupPodcast(req.body.id);

  if (results.resultCount === 1) {
    const feedUrl = results.results[0].feedUrl;

    if (!feedUrl) {
      return res.status(400).json({ error: 'This podcast does not have a public feed URL'});
    }

    const hash = crypto.createHash('md5').update(feedUrl).digest('hex');
    const cacheKey = `feed-${hash}`;

    const cached = await cache.getCache(cacheKey);
    if (cached) {
      return res.status(200).json(cached);
    }

    const parser = new Parser();
    const feed = await parser.parseURL(feedUrl);

    await cache.setCache(cacheKey, feed, CACHE_TIME);

    return res.status(200).json(feed);
  }

  res.status(400).json({ error: 'Invalid ID' });
}
