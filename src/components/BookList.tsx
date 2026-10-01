import { useAtomValue } from 'jotai';

import {
  filteredBooksAtom,
} from '../atoms/bookSelectors';

import BookItem from './BookItem';

function BookList() {
  const books =
    useAtomValue(filteredBooksAtom);

  return (
    <section className="books-section">
      <h2>My Books</h2>

      {books.length === 0 ? (
        <div className="empty-message">
          <p>
            No books found.
          </p>
        </div>
      ) : (
        <ul className="book-list">
          {books.map((book) => (
            <BookItem
              key={book.id}
              book={book}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

export default BookList;