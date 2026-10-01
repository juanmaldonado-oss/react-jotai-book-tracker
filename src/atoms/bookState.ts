import { atom } from 'jotai';
import type { Book, BookFilter } from '../types/book';

export const booksAtom = atom<Book[]>([]);

export const searchAtom = atom('');

export const bookFilterAtom = atom<BookFilter>('all');

export const apiSearchQueryAtom = atom('');