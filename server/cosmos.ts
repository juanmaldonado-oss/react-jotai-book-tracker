import { CosmosClient } from '@azure/cosmos';

const endpoint = process.env.COSMOS_ENDPOINT;
const key = process.env.COSMOS_KEY;
const databaseId = process.env.COSMOS_DATABASE;
const containerId = process.env.COSMOS_CONTAINER;

if (
  !endpoint ||
  !key ||
  !databaseId ||
  !containerId
) {
  throw new Error(
    'Missing Cosmos DB environment variables.'
  );
}

const client = new CosmosClient({
  endpoint,
  key,
});

const database =
  client.database(databaseId);

export const booksContainer =
  database.container(containerId);