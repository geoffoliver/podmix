# Podmix

Podcast playlists. Yipee.

## Getting Started

First, configure your `.env.local` file like [.env.sample](.env.sample) as much as you can (see below).

Now run the development server:

```bash
docker compose up
```

Now you can generate a quirrel token ([see here for details](https://docs.quirrel.dev/deploying/#how-to-deploy-your-own-server)) and pop that into the .env.local and (yes, this is annoying) restart the podmix container.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
