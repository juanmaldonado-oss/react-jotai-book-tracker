import { memo } from 'react';
import { useSetAtom } from 'jotai';

import {
  deleteBookAtom,
  toggleBookReadAtom,
} from '../atoms/bookActions';

import type { Book } from '../types/book';

interface BookItemProps {
  book: Book;
}

function BookItemComponent({
  book,
}: BookItemProps) {

  const deleteBook =
    useSetAtom(deleteBookAtom);

  const toggleRead =
    useSetAtom(toggleBookReadAtom);

  return (
    <li className="book-item">
      <div className="book-info">
        <div className="book-title">
          {book.title}
        </div>

        <div className="book-author">
          {book.author}
        </div>
      </div>

      <div className="book-actions">
        <span
          className={
            book.isRead
              ? 'status status-read'
              : 'status status-unread'
          }
        >
          {book.isRead
            ? '✓ Read'
            : 'Not Read'}
        </span>

        <button
          className="button button-secondary"
          onClick={() =>
            toggleRead(book.id)
          }
        >
          {book.isRead
            ? 'Mark Unread'
            : 'Mark Read'}
        </button>

        <button
          className="button button-danger"
          onClick={() =>
            deleteBook(book.id)
          }
        >
          Delete
        </button>
      </div>
    </li>
  );
}

const BookItem =
  memo(BookItemComponent);

export default BookItem;