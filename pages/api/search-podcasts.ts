import type { NextApiRequest, NextApiResponse } from 'next'

import iTunes from '@/lib/external/itunes';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const itunes = new iTunes();
  const results = await itunes.searchPodcasts(req.body.search);

  // remove podcasts without a feedUrl
  const cleaned = {
    ...results,
    results: results.results.filter((r) => !!r.feedUrl),
  };

  res.status(200).json(cleaned)
}
