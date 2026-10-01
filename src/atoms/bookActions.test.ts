import {
  beforeEach,
  describe,
  expect,
  it,
} from 'vitest';

import { createStore } from 'jotai';

import { booksAtom } from './bookState';

import {
  addBookAtom,
  deleteBookAtom,
  toggleBookReadAtom,
} from './bookActions';

import type { Book } from '../types/book';

describe('book actions', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('adds a book', () => {
    const store = createStore();

    store.set(addBookAtom, {
      title: 'Dune',
      author: 'Frank Herbert',
    });

    const books = store.get(booksAtom);

    expect(books).toHaveLength(1);

    expect(books[0]).toMatchObject({
      title: 'Dune',
      author: 'Frank Herbert',
      isRead: false,
    });

    expect(books[0].id).toBeTruthy();
  });

  it('deletes a book', () => {
    const store = createStore();

    const initialBooks: Book[] = [
      {
        id: '1',
        title: 'Dune',
        author: 'Frank Herbert',
        isRead: false,
      },
      {
        id: '2',
        title: 'The Hobbit',
        author: 'J.R.R. Tolkien',
        isRead: false,
      },
    ];

    store.set(booksAtom, initialBooks);

    store.set(deleteBookAtom, '1');

    const books = store.get(booksAtom);

    expect(books).toHaveLength(1);
    expect(books[0].title).toBe(
      'The Hobbit'
    );
  });

  it('toggles a book as read', () => {
    const store = createStore();

    store.set(booksAtom, [
      {
        id: '1',
        title: 'Dune',
        author: 'Frank Herbert',
        isRead: false,
      },
    ]);

    store.set(toggleBookReadAtom, '1');

    expect(
      store.get(booksAtom)[0].isRead
    ).toBe(true);
  });

  it('toggles a book back to unread', () => {
    const store = createStore();

    store.set(booksAtom, [
      {
        id: '1',
        title: 'Dune',
        author: 'Frank Herbert',
        isRead: true,
      },
    ]);

    store.set(toggleBookReadAtom, '1');

    expect(
      store.get(booksAtom)[0].isRead
    ).toBe(false);
  });
});

it('does not add duplicate books', () => {
  const store = createStore();

  store.set(addBookAtom, {
    title: 'Dune',
    author: 'Frank Herbert',
  });

  store.set(addBookAtom, {
    title: 'dune',
    author: 'frank herbert',
  });

  const books = store.get(booksAtom);

  expect(books).toHaveLength(1);
});