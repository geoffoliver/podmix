import type { NextApiRequest, NextApiResponse } from 'next'
import Parser from 'rss-parser';

import iTunes from '@/lib/external/itunes';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const itunes = new iTunes();

  const results = await itunes.lookupPodcast(req.body.id);

  console.log(results);

  if (results.resultCount === 1) {
    const feedUrl = results.results[0].feedUrl;

    if (!feedUrl) {
      return res.status(400).json({ error: 'This podcast does not have a public feed URL'});
    }

    const parser = new Parser();
    const feed = await parser.parseURL(feedUrl);

    return res.status(200).json(feed);
  }

  res.status(400).json({ error: 'Invalid ID' });
}
