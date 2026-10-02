import {
  Suspense,
  useEffect,
  useState,
} from 'react';
import ErrorBoundary from './ErrorBoundary';
import { useSetAtom } from 'jotai';
import {
  apiSearchQueryAtom,
} from '../atoms/bookState';

import BookSearchResults from './BookSearchResults';

function BookSearch() {
  const [input, setInput] = useState('');

  const setSearchQuery =
    useSetAtom(apiSearchQueryAtom);

  useEffect(() => {
  const trimmedInput = input.trim();

  if (trimmedInput.length < 3) {
    setSearchQuery('');
    return;
  }

  const timer = setTimeout(() => {
    setSearchQuery(trimmedInput);
  }, 500);

  return () => {
    clearTimeout(timer);
  };
}, [input, setSearchQuery]);

  return (
    <section className="card api-search">
      <h2>Find a Book</h2>

      <div className="form-field">
  <label htmlFor="api-search">
    Search Open Library
  </label>

  <div className="search-row">
    <input
      id="api-search"
      type="text"
      placeholder="Enter at least 3 characters..."
      value={input}
      onChange={(event) =>
        setInput(event.target.value)
      }
    />

    <button
      type="button"
      className="button button-secondary agent-button"
      onClick={() => {
        console.log(
          'AI Agent coming soon'
        );
      }}
    >
      %
    </button>
  </div>
</div>

      <ErrorBoundary
            key={input}
            fallback={
                <p className="api-error">
                Unable to search books. Please try again.
                </p>
            }
            >
            <Suspense
                fallback={
                <p className="api-message">
                    Searching...
                </p>
                }
            >
                <BookSearchResults />
            </Suspense>
        </ErrorBoundary>
    </section>
  );
}

export default BookSearch;