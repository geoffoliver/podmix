import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const url = `https://itunes.apple.com/search?entity=podcast&term=${req.body.search}`;
  const results = await axios.get(url);
  res.status(200).json(results.data)
}
