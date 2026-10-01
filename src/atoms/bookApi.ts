import { atom } from 'jotai';
import {
  apiSearchQueryAtom,
} from './bookState';

import type {
  ApiBook,
  OpenLibraryResponse,
} from '../types/book';

export const apiBooksAtom = atom(
  async (get): Promise<ApiBook[]> => {
    const query =
      get(apiSearchQueryAtom);

    if (query.trim().length < 3) {
      return [];
    }

    const response = await fetch(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=5`
    );

    if (!response.ok) {
      throw new Error(
        `Failed to search books: ${response.status}`
      );
    }

    const data =
      (await response.json()) as OpenLibraryResponse;

    return data.docs.map(
      (item): ApiBook => ({
        key: item.key,
        title: item.title,
        authorName:
          item.author_name?.[0] ??
          'Unknown author',
      })
    );
  }
);