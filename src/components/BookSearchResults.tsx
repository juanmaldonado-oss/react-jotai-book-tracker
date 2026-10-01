import {
  useAtomValue,
  useSetAtom,
} from 'jotai';

import {
  apiBooksAtom,
} from '../atoms/bookApi';

import {
  apiSearchQueryAtom,
} from '../atoms/bookState';

import {
  addBookAtom,
} from '../atoms/bookActions';

function BookSearchResults() {
  const query =
    useAtomValue(apiSearchQueryAtom);

  const books =
    useAtomValue(apiBooksAtom);

  const addBook =
    useSetAtom(addBookAtom);

  if (!query) {
    return null;
  }

  if (books.length === 0) {
    return (
      <p className="api-message">
        No books found.
      </p>
    );
  }

  return (
    <ul className="api-results">
      {books.map((book) => (
        <li
          key={book.key}
          className="api-result"
        >
          <div>
            <strong>{book.title}</strong>
            <p>{book.authorName}</p>
          </div>

          <button
            className="button button-primary"
            onClick={() =>
              addBook({
                title: book.title,
                author: book.authorName,
              })
            }
          >
            Add
          </button>
        </li>
      ))}
    </ul>
  );
}

export default BookSearchResults;