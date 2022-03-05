import { Playlist } from '@/lib/models';
import { Queue } from 'quirrel/next';

type JobDetail = {
  playlistId: string;
};

export default Queue('api/playlists/update-search-index', async (job: JobDetail): Promise<void> => {
  const playlist = await Playlist.findByPk(job.playlistId);

  if (!playlist) {
    return;
  }

  await playlist.updateSearchIndex();
});
