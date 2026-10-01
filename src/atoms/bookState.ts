import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import type {
  Book,
  BookFilter,
} from '../types/book';

export const booksAtom = atomWithStorage<Book[]>('books', []);

export const searchAtom = atom('');

export const bookFilterAtom = atom<BookFilter>('all');

export const apiSearchQueryAtom = atom('');