import {
  beforeEach,
  describe,
  expect,
  it,
} from 'vitest';

import { createStore } from 'jotai';

import {
  booksAtom,
  searchAtom,
  bookFilterAtom,
} from './bookState';

import {
  totalBooksAtom,
  readBooksAtom,
  unreadBooksAtom,
  readPercentageAtom,
  filteredBooksAtom,
} from './bookSelectors';

import type { Book } from '../types/book';

const books: Book[] = [
  {
    id: '1',
    title: 'Dune',
    author: 'Frank Herbert',
    isRead: true,
  },
  {
    id: '2',
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    isRead: false,
  },
  {
    id: '3',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    isRead: true,
  },
  {
    id: '4',
    title: '1984',
    author: 'George Orwell',
    isRead: false,
  },
];

describe('book selectors', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('calculates book statistics', () => {
    const store = createStore();

    store.set(booksAtom, books);

    expect(
      store.get(totalBooksAtom)
    ).toBe(4);

    expect(
      store.get(readBooksAtom)
    ).toHaveLength(2);

    expect(
      store.get(unreadBooksAtom)
    ).toHaveLength(2);

    expect(
      store.get(readPercentageAtom)
    ).toBe(50);
  });
});

it('filters books by title', () => {
  const store = createStore();

  store.set(booksAtom, books);
  store.set(searchAtom, 'dune');

  const results =
    store.get(filteredBooksAtom);

  expect(results).toHaveLength(1);

  expect(results[0].title).toBe(
    'Dune'
  );
});

it('filters books by author', () => {
  const store = createStore();

  store.set(booksAtom, books);
  store.set(searchAtom, 'tolkien');

  const results =
    store.get(filteredBooksAtom);

  expect(results).toHaveLength(1);

  expect(results[0].title).toBe(
    'The Hobbit'
  );
});

it('shows only read books', () => {
  const store = createStore();

  store.set(booksAtom, books);

  store.set(
    bookFilterAtom,
    'read'
  );

  const results =
    store.get(filteredBooksAtom);

  expect(results).toHaveLength(2);

  expect(
    results.every(
      (book) => book.isRead
    )
  ).toBe(true);
});

it('shows only unread books', () => {
  const store = createStore();

  store.set(booksAtom, books);

  store.set(
    bookFilterAtom,
    'unread'
  );

  const results =
    store.get(filteredBooksAtom);

  expect(results).toHaveLength(2);

  expect(
    results.every(
      (book) => !book.isRead
    )
  ).toBe(true);
});

it('combines search and read filter', () => {
  const store = createStore();

  store.set(booksAtom, books);

  store.set(
    searchAtom,
    'code'
  );

  store.set(
    bookFilterAtom,
    'read'
  );

  const results =
    store.get(filteredBooksAtom);

  expect(results).toHaveLength(1);

  expect(results[0].title).toBe(
    'Clean Code'
  );
});