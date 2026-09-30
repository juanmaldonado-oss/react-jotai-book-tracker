import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
export interface Book {
  id: string;
  title: string;
  author: string;
  isRead?: boolean;
}

export interface NewBook {
  title: string;
  author: string;
}

export interface ApiBook {
  key: string;
  title: string;
  authorName: string;
}

export interface OpenLibraryBook {
  key: string;
  title: string;
  author_name?: string[];
}

export interface OpenLibraryResponse {
  docs: OpenLibraryBook[];
}

export type BookFilter = 'all' | 'read' | 'unread';

export const booksAtom = atomWithStorage<Book[]>(
  'books',
  []
);
export const searchAtom = atom('');
export const bookFilterAtom = atom<BookFilter>('all');
export const apiSearchQueryAtom = atom('');

export const totalBooksAtom = atom((get) => {
  const books = get(booksAtom);

  return books.length;
});

export const readBooksAtom = atom((get) => {
  const books = get(booksAtom);

  return books.filter((book) => book.isRead);
});

export const unreadBooksAtom = atom((get) => {
  const books = get(booksAtom);

  return books.filter((book) => !book.isRead);
});

export const readPercentageAtom = atom((get) => {
const totalBooks = get(totalBooksAtom);
  const readBooks = get(readBooksAtom);

  if (totalBooks === 0) {
    return 0;
  }


  return Math.round((readBooks.length / totalBooks  ) * 100);
});

export const deleteBookAtom = atom(
  null,
  (_get, set, id: string) => {
    set(booksAtom, (books) =>
      books.filter((book) => book.id !== id)
    );
  }
);

export const toggleBookReadAtom = atom(
  null,
  (_get, set, id: string) => {
    set(booksAtom, (books) =>
      books.map((book) =>
        book.id === id
          ? {
              ...book,
              isRead: !book.isRead,
            }
          : book
      )
    );
  }
);

export const addBookAtom = atom(
  null,
  (_get, set, newBook: NewBook) => {
    const book: Book = {
      id: crypto.randomUUID(),
      title: newBook.title,
      author: newBook.author,
      isRead: false,
    };

    set(booksAtom, (books) => [
      ...books,
      book,
    ]);
  }
);

export const filteredBooksAtom = atom((get) => {
  const books = get(booksAtom);
  const search = get(searchAtom).toLowerCase();
  const filter = get(bookFilterAtom);

  return books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(search) ||
      book.author.toLowerCase().includes(search);

    const matchesFilter =
      filter === 'all' ||
      (filter === 'read' && book.isRead) ||
      (filter === 'unread' && !book.isRead);

    return matchesSearch && matchesFilter;
  });
});

export const apiBooksAtom = atom(
  async (get): Promise<ApiBook[]> => {
    const query = get(apiSearchQueryAtom);

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
