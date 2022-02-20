import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';
import Parser from 'rss-parser';

import Playlist from '@/lib/models/playlist';
import iTunes from '@/lib/external/itunes';
import Podcast from '@/lib/models/podcast';
import { ItemWithiTunes } from '@/lib/types/podcast';
import { durationToSeconds } from '@/lib/util';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const playlist = await Playlist.findOne({
    where: {
      userId: session.user.id,
      id: req.body.id,
    },
  });

  if (!playlist) {
    return res.status(404).json({ error: 'Invalid playlist' });
  }

  const itunes = new iTunes();
  const iTunesPodcast = await itunes.lookupPodcast(req.body.collectionId);

  if (!iTunesPodcast || iTunesPodcast.resultCount === 0) {
    return res.status(400).json({ error: 'Invalid podcast' });
  }

  const podData = iTunesPodcast.results[0];

  if (!podData.feedUrl) {
    return res.status(400).json({ error: 'Podcast is missing data' });
  }

  const parser = new Parser();
  const feed = await parser.parseURL(podData.feedUrl);

  const feedItem: ItemWithiTunes = feed.items.find((item) => {
    return item.enclosure?.url === req.body.mediaUrl;
  });

  if (!feedItem) {
    return res.status(400).json({ error: 'Invalid episode' });
  }

  const [podcast] = await Podcast.findOrCreate({
    where: {
      name: podData.trackName,
    },
    defaults: {
      name: podData.trackName,
      image: podData.artworkUrl600,
      iTunesArtistName: podData.artistName,
      iTunesCollectionName: podData.collectionName,
      iTunesTrackName: podData.trackName,
      iTunesPrimaryGenreName: podData.primaryGenreName,
      iTunesGenres: podData.genres,
      iTunesData: podData,
    },
  });

  if (!podcast) {
    return res.status(500).json({ error: 'Error locating podcast' });
  }

  const totalItems = await playlist.countItems();

  const {
    title,
    pubDate,
  } = feedItem;

  const url = feedItem.enclosure?.url;

  if (!url) {
    return res.status(500).json({ error: 'Missing episode URL' });
  }

  const image = feedItem.itunes?.image || podData.artworkUrl600;
  const description = feedItem.contentSnippet;
  const duration = durationToSeconds(feedItem.itunes?.duration || '0');

  const item = await playlist.createItem({
    title,
    description,
    url,
    image,
    duration,
    podcastId: podcast.id,
    pubDate: new Date(pubDate),
    artist: podData.trackName,
    filesize: Number(feedItem.enclosure?.length || 0),
    position: req.body.position || totalItems,
    feedData:  feedItem,
  });

  return res.status(200).json({ item })
}
