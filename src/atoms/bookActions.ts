import { atom } from 'jotai';
import { booksAtom } from './bookState';
import type {
  Book,
  NewBook,
  AddBookResult,
} from '../types/book';


export const loadBooksAtom = atom(
  null,
  async (_get, set) => {
    const response = await fetch('/api/books');

    if (!response.ok) {
      throw new Error(
        `Failed to load books: ${response.status}`
      );
    }

    const data = (await response.json()) as {
      books: Book[];
    };

    set(booksAtom, data.books);
  }
);

export const addBookAtom = atom(
  null,
  async (
    get,
    set,
    newBook: NewBook
  ): Promise<AddBookResult> => {
    const books = get(booksAtom);

    const alreadyExists = books.some(
      (book) =>
        book.title.trim().toLowerCase() ===
          newBook.title.trim().toLowerCase() &&
        book.author.trim().toLowerCase() ===
          newBook.author.trim().toLowerCase()
    );

    if (alreadyExists) {
      return {
        success: false,
        message:
          'This book is already in your collection.',
      };
    }

    const response = await fetch('/api/books', {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        title: newBook.title.trim(),
        author: newBook.author.trim(),
      }),
    });

    if (!response.ok) {
      return {
        success: false,
        message:
          'Unable to save the book. Please try again.',
      };
    }

    const data = (await response.json()) as {
      book: Book;
    };

    set(booksAtom, (books) => [
      ...books,
      data.book,
    ]);

    return {
      success: true,
    };
  }
);

export const deleteBookAtom = atom(
  null,
  async (_get, set, id: string) => {
    const response = await fetch('/api/books', {
      method: 'DELETE',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        id,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to delete book: ${response.status}`
      );
    }

    set(booksAtom, (books) =>
      books.filter(
        (book) => book.id !== id
      )
    );
  }
);

export const toggleBookReadAtom = atom(
  null,
  async (get, set, id: string) => {
    const books = get(booksAtom);

    const book = books.find(
      (book) => book.id === id
    );

    if (!book) {
      return;
    }

    const newIsRead = !book.isRead;

    const response = await fetch('/api/books', {
      method: 'PATCH',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        id,
        isRead: newIsRead,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to update book: ${response.status}`
      );
    }

    const data = (await response.json()) as {
      book: Book;
    };

    set(booksAtom, (books) =>
      books.map((book) =>
        book.id === id
          ? data.book
          : book
      )
    );
  }
);