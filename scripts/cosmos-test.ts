import dotenv from 'dotenv';
import { CosmosClient } from '@azure/cosmos';

dotenv.config({
  path: '.env.local',
});

interface CosmosBook {
  id: string;
  userId: string;
  title: string;
  author: string;
  isRead: boolean;
  createdAt: string;
}

const endpoint =
  process.env.COSMOS_ENDPOINT;

const key =
  process.env.COSMOS_KEY;

const databaseId =
  process.env.COSMOS_DATABASE;

const containerId =
  process.env.COSMOS_CONTAINER;

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

const container =
  database.container(containerId);

const query = {
  query: `
    SELECT *
    FROM c
    WHERE c.userId = @userId
  `,
  parameters: [
    {
      name: '@userId',
      value: 'demo-user',
    },
  ],
};

const { resources: books } =
  await container.items
    .query<CosmosBook>(
      query,
      {
        partitionKey: 'demo-user',
      }
    )
    .fetchAll();

console.log('Books from Cosmos:');

console.table(
  books.map((book) => ({
    id: book.id,
    title: book.title,
    author: book.author,
    read: book.isRead,
  }))
);