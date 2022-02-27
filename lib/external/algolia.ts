import algoliasearch from 'algoliasearch';

const client = algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID, process.env.ALGOLIA_API_KEY);

const searchIndex = client.initIndex(process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME);

export default client;

export { searchIndex };
