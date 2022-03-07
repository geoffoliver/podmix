# Podmix

Podcast playlists. Yipee.

## Getting Started

First, configure your `.env.development.local` file like [.env.sample](.env.sample) as much as you can (see below).

Now run the development server:

```bash
docker compose up
```

Now you can generate a quirrel token ([see here for details](https://docs.quirrel.dev/deploying/#how-to-deploy-your-own-server)) and pop that into the `.env.development.local` and (yes, this is annoying) restart the podmix container.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Getting a Quirrel token

In the instance that the quirrel site goes down, here's how you get a token for use with Quirrel.

> Once our server is ready, we'll need to get an auth token:

> `curl --user ignored:{PASSPHRASE} -X PUT {QUIRREL_SERVER_URL}/tokens/{NAME_OF_TOKEN}`
> _The fields inside of {} are placeholders and should be replaced by you._

> Save the returned token for the next step.

## Migrations

Migrations are powered by [umzug](https://github.com/sequelize/umzug) since `sequelize-cli` can't handle typescript. Just run `yarn migrate [up|down|whatever]` in the app container to deal with migrations. If you run `yarn migrate` you'll get a friendly little help screen.
