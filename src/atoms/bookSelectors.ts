import { atom } from 'jotai';
import {
  booksAtom,
  searchAtom,
  bookFilterAtom,
} from './bookState';

export const totalBooksAtom = atom(
  (get) => get(booksAtom).length
);

export const readBooksAtom = atom((get) => {
  return get(booksAtom).filter(
    (book) => book.isRead
  );
});

export const unreadBooksAtom = atom((get) => {
  return get(booksAtom).filter(
    (book) => !book.isRead
  );
});

export const readPercentageAtom = atom(
  (get) => {
    const totalBooks =
      get(totalBooksAtom);

    const readBooks =
      get(readBooksAtom);

    if (totalBooks === 0) {
      return 0;
    }

    return Math.round(
      (readBooks.length / totalBooks) * 100
    );
  }
);

export const filteredBooksAtom = atom(
  (get) => {
    const books = get(booksAtom);

    const search =
      get(searchAtom)
        .trim()
        .toLowerCase();

    const filter =
      get(bookFilterAtom);

    return books.filter((book) => {
      const matchesSearch =
        book.title
          .toLowerCase()
          .includes(search) ||
        book.author
          .toLowerCase()
          .includes(search);

      const matchesFilter =
        filter === 'all' ||
        (filter === 'read' &&
          book.isRead) ||
        (filter === 'unread' &&
          !book.isRead);

      return (
        matchesSearch &&
        matchesFilter
      );
    });
  }
);