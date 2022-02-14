import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';
import Parser from 'rss-parser';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const url = `https://itunes.apple.com/lookup?id=${req.body.id}&entity=podcast`;
  const results = await axios.get(url);

  if (results.data.resultCount === 1) {
    const feedUrl = results.data.results[0].feedUrl;

    const parser = new Parser();
    const feed = await parser.parseURL(feedUrl);

    return res.status(200).json(feed);
  }

  res.status(400).json({ error: 'Invalid ID' });
}
