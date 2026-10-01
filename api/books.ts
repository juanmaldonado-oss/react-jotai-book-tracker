import { booksContainer } from '../server/cosmos.js';
import type {
  CosmosBook,
  CreateBookRequest,
  UpdateBookRequest,
  DeleteBookRequest,
} from '../src/types/book';

const USER_ID = 'demo-user';

export async function GET() {
  try {
    const query = {
      query: `
        SELECT *
        FROM c
        WHERE c.userId = @userId
      `,
      parameters: [
        {
          name: '@userId',
          value: USER_ID,
        },
      ],
    };

    const { resources: books } =
      await booksContainer.items
        .query<CosmosBook>(
          query,
          {
            partitionKey: USER_ID,
          }
        )
        .fetchAll();

    return Response.json({
      books,
    });
  } catch (error) {
    console.error(
      'Failed to retrieve books:',
      error
    );

    return Response.json(
      {
        error: 'Failed to retrieve books.',
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(
  request: Request
) {
  try {
    const body =
      (await request.json()) as CreateBookRequest;

    const title = body.title?.trim();
    const author = body.author?.trim();

    if (!title || !author) {
      return Response.json(
        {
          error:
            'Title and author are required.',
        },
        {
          status: 400,
        }
      );
    }

    const book: CosmosBook = {
      id: crypto.randomUUID(),
      userId: USER_ID,
      title,
      author,
      isRead: false,
      createdAt:
        new Date().toISOString(),
    };

    const { resource } =
      await booksContainer.items.create(book);

    return Response.json(
      {
        book: resource,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      'Failed to create book:',
      error
    );

    return Response.json(
      {
        error: 'Failed to create book.',
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(
  request: Request
) {
  try {
    const body =
      (await request.json()) as UpdateBookRequest;

    if (!body.id) {
      return Response.json(
        {
          error: 'Book id is required.',
        },
        {
          status: 400,
        }
      );
    }

    const { resource } =
      await booksContainer
        .item(body.id, USER_ID)
        .patch<CosmosBook>([
          {
            op: 'replace',
            path: '/isRead',
            value: body.isRead,
          },
        ]);

    return Response.json({
      book: resource,
    });
  } catch (error) {
    console.error(
      'Failed to update book:',
      error
    );

    return Response.json(
      {
        error: 'Failed to update book.',
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  request: Request
) {
  try {
    const body =
      (await request.json()) as DeleteBookRequest;

    if (!body.id) {
      return Response.json(
        {
          error: 'Book id is required.',
        },
        {
          status: 400,
        }
      );
    }

    await booksContainer
      .item(body.id, USER_ID)
      .delete();

    return Response.json({
      success: true,
    });
  } catch (error) {
    console.error(
      'Failed to delete book:',
      error
    );

    return Response.json(
      {
        error: 'Failed to delete book.',
      },
      {
        status: 500,
      }
    );
  }
}