import fs from 'fs';
import axios from 'axios';

class Bunny {
  async upload(localPath: string, remotePath: string): Promise<string | null> {
    const remoteFile = `https://${process.env.BUNNY_STORAGE_REGION}.storage.bunnycdn.com/${process.env.BUNNY_STORAGE_ZONE}/${remotePath}`;

    try {
      const uploaded = await axios.put(
        remoteFile,
        fs.readFileSync(localPath),
        {
          headers: {
            'AccessKey': process.env.BUNNY_API_KEY,
            'Content-Type': 'application/octet-stream',
          }
        }
      );

      const url = `https://${process.env.BUNNY_PULL_ZONE}.b-cdn.net/${remotePath}`;

      if (uploaded.status === 201) {
        return url;
      }

      throw new Error('An unknown error occurred');
    } catch (ex) {
      console.error(`Error uploading file: ${ex.mesage}`);
      throw ex;
    }
  }

  async delete(toDelete: string): Promise<boolean> {
    const bunnyCdn = `https://${process.env.BUNNY_PULL_ZONE}.b-cdn.net`;

    const bunnyFile = toDelete.replace(
      bunnyCdn,
      `https://${process.env.BUNNY_STORAGE_REGION}.storage.bunnycdn.com/${process.env.BUNNY_STORAGE_ZONE}`,
    );

    try {
      const deleted = await axios.delete(
        bunnyFile,
        {
          headers: {
            'AccessKey': process.env.BUNNY_API_KEY,
            'Content-Type': 'application/octet-stream',
          },
        },
      );

      return deleted.status === 200;
    } catch (ex) {
      console.log('Error deleting file from Bunny', ex.message);
      return false;
    }
  }
}

export default Bunny;
