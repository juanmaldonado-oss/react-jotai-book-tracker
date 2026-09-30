import {
  useAtomValue,
  useSetAtom,
} from 'jotai';

import {
  deleteBookAtom,
  filteredBooksAtom,
  toggleBookReadAtom,
} from '../atoms/bookAtoms';

function BookList() {
  const books = useAtomValue(filteredBooksAtom);

  const deleteBook = useSetAtom(deleteBookAtom);
  const toggleRead = useSetAtom(toggleBookReadAtom);

  return (
    <section className="books-section">
      <h2>My Books</h2>

      {books.length === 0 ? (
        <div className="empty-message">
          <p>No books yet. Add your first one above.</p>
        </div>
      ) : (
        <ul className="book-list">
          {books.map((book) => (
            <li
              className="book-item"
              key={book.id}
            >
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
                  {book.isRead ? '✓ Read' : 'Not Read'}
                </span>

                <button
                  className="button button-secondary"
                  onClick={() => toggleRead(book.id)}
                >
                  {book.isRead
                    ? 'Mark Unread'
                    : 'Mark Read'}
                </button>

                <button
                  className="button button-danger"
                  onClick={() => deleteBook(book.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default BookList;