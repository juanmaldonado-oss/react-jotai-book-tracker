import { atom } from 'jotai';
import { booksAtom } from './bookState';
import type {
  Book,
  NewBook,
} from '../types/book';

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