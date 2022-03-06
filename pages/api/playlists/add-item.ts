import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import Parser from 'rss-parser';
import crypto from 'crypto';

import { Playlist, Podcast } from '@/lib/models';
import iTunes from '@/lib/external/itunes';
import { ItemWithiTunes } from '@/lib/types/podcast';
import { durationToSeconds } from '@/lib/util';
import Bunny from '@/lib/external/bunny';
import cache from '@/lib/cache';
import GenerateImage from '@/pages/api/playlists/generate-image';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(400).json({ error: 'Invalid request' });
  }

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

  const hash = crypto.createHash('md5').update(podData.feedUrl.toLocaleLowerCase()).digest('hex');
  const cacheKey = `feed-${hash}`;

  let feed: any;

  const cached = await cache.getCache(cacheKey);
  if (cached) {
    feed = cached;
  } else {
    const parser = new Parser();
    feed = await parser.parseURL(podData.feedUrl);
    await cache.setCache(cacheKey, feed, 60 * 60);
  }

  const feedItem: ItemWithiTunes = feed.items.find((item) => {
    return item.enclosure?.url === req.body.mediaUrl;
  });

  if (!feedItem) {
    return res.status(400).json({ error: 'Invalid episode' });
  }

  const values = {
    name: podData.trackName,
    image: podData.artworkUrl600,
    iTunesArtistName: podData.artistName,
    iTunesCollectionName: podData.collectionName,
    iTunesTrackName: podData.trackName,
    iTunesPrimaryGenreName: podData.primaryGenreName,
    iTunesGenres: podData.genres,
    iTunesData: podData,
  };

  const [podcast] = await Podcast.findOrCreate({
    where: {
      name: podData.trackName,
    },
    defaults: values,
  });

  if (!podcast) {
    return res.status(500).json({ error: 'Error locating podcast' });
  }

  podcast.set(values);

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

  await podcast.save();

  const rssCache = `playlist-rss-${playlist.id}`;
  const m3uCache = `playlist-m3u-${playlist.id}`;

  await cache.deleteCache(rssCache, m3uCache);

  if (playlist.image) {
    const bunny = new Bunny();
    await bunny.delete(playlist.image);

    playlist.set('image', null);

    await GenerateImage.enqueue({
      playlistId: playlist.id,
    });

    await playlist.save();
  }

  return res.status(200).json({ item });
}
