import {
  ContentUnderstandingClient,
  type ContentFieldUnion,
  type DocumentContent,
} from '@azure/ai-content-understanding';

import {
  AzureKeyCredential,
} from '@azure/core-auth';

const MAX_FILE_SIZE =
  4 * 1024 * 1024;

function getRequiredEnv(
  name: string
): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `Missing environment variable: ${name}`
    );
  }

  return value;
}

const endpoint = getRequiredEnv(
  'CONTENTUNDERSTANDING_ENDPOINT'
);

const key = getRequiredEnv(
  'CONTENTUNDERSTANDING_KEY'
);

const analyzerId = getRequiredEnv(
  'CONTENTUNDERSTANDING_ANALYZER_ID'
);

const client =
  new ContentUnderstandingClient(
    endpoint,
    new AzureKeyCredential(key),
    {
      apiVersion: '2025-11-01',
    }
  );

function getStringValue(
  field: ContentFieldUnion | undefined
): string {
  if (!field) {
    return '';
  }

  if (
    'valueString' in field &&
    typeof field.valueString === 'string'
  ) {
    return field.valueString;
  }

  const rawField = field as unknown as {
    value?: unknown;
  };

  if (typeof rawField.value === 'string') {
    return rawField.value;
  }

  return '';
}

export async function POST(
  request: Request
) {
  try {
    const formData =
      await request.formData();

    const file =
      formData.get('file');

    if (!(file instanceof File)) {
      return Response.json(
        {
          error:
            'A PDF file is required.',
        },
        {
          status: 400,
        }
      );
    }

    if (
      file.type !==
      'application/pdf'
    ) {
      return Response.json(
        {
          error:
            'Only PDF files are allowed.',
        },
        {
          status: 400,
        }
      );
    }

    if (
      file.size > MAX_FILE_SIZE
    ) {
      return Response.json(
        {
          error:
            'PDF must be smaller than 4 MB.',
        },
        {
          status: 413,
        }
      );
    }

    const arrayBuffer =
      await file.arrayBuffer();

    const pdfBytes =
      new Uint8Array(arrayBuffer);

    const poller =
      client.analyzeBinary(
        analyzerId,
        pdfBytes,
        'application/pdf'
      );

    const result =
      await poller.pollUntilDone();

    if (
      !result.contents ||
      result.contents.length === 0
    ) {
      return Response.json(
        {
          error:
            'Azure did not return document content.',
        },
        {
          status: 422,
        }
      );
    }

    const content =
      result.contents[0];

    if (
      content.kind !== 'document'
    ) {
      return Response.json(
        {
          error:
            'The uploaded content was not recognized as a document.',
        },
        {
          status: 422,
        }
      );
    }

    const document =
      content as DocumentContent;

    const title =
      getStringValue(
        document.fields?.['Title']
      );

    const author =
      getStringValue(
        document.fields?.['Author']
      );

    if (!title && !author) {
      return Response.json(
        {
          error:
            'Unable to detect the book title or author.',
        },
        {
          status: 422,
        }
      );
    }

    return Response.json({
      success: true,
      book: {
        title,
        author,
      },
    });
  } catch (error) {
    console.error(
      'Content Understanding analysis failed:',
      error
    );

    return Response.json(
      {
        error:
          'Unable to analyze the PDF.',
      },
      {
        status: 500,
      }
    );
  }
}