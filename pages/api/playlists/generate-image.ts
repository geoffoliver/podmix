import { Playlist } from '@/lib/models';
import { Queue } from 'quirrel/next';

type JobDetail = {
  playlistId: string;
};

export default Queue('api/playlists/generate-image', async (job: JobDetail): Promise<void> => {
  const playlist = await Playlist.findByPk(job.playlistId);

  if (!playlist) {
    return;
  }

  await playlist.generateImage();
});
