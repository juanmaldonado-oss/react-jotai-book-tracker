import { atom } from 'jotai';
import { booksAtom } from './bookState';
import type {
  Book,
  NewBook,
} from '../types/book';

export const addBookAtom = atom(
  null,
  (get, set, newBook: NewBook) => {
    const books = get(booksAtom);

    const alreadyExists = books.some(
      (book) =>
        book.title.trim().toLowerCase() ===
          newBook.title.trim().toLowerCase() &&
        book.author.trim().toLowerCase() ===
          newBook.author.trim().toLowerCase()
    );

    if (alreadyExists) {
      return false;
    }

    const book: Book = {
      id: crypto.randomUUID(),
      title: newBook.title.trim(),
      author: newBook.author.trim(),
      isRead: false,
    };

    set(booksAtom, [...books, book]);

    return true;
  }
);

export const deleteBookAtom = atom(
  null,
  (_get, set, id: string) => {
    set(booksAtom, (books) =>
      books.filter(
        (book) => book.id !== id
      )
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