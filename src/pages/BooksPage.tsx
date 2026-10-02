import {
  useEffect,
  useState,
} from 'react';

import { useSetAtom } from 'jotai';

import BookForm from '../components/BookForm';
import BookSearch from '../components/BookSearch';
import BookStats from '../components/BookStats';
import BookFilters from '../components/BookFilters';
import BookList from '../components/BookList';

import {
  loadBooksAtom,
} from '../atoms/bookActions';

function BooksPage() {
  const loadBooks =
    useSetAtom(loadBooksAtom);

  const [isLoading, setIsLoading] =
    useState(true);

  const [loadError, setLoadError] =
    useState('');

  const [isAddBookOpen, setIsAddBookOpen] =
  useState(false);

  useEffect(() => {
    loadBooks()
      .catch((error) => {
        console.error(
          'Failed to load books:',
          error
        );

        setLoadError(
          'Unable to load your books.'
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [loadBooks]);

    return (
    <main className="app-container">
      <header className="app-header">
        <h1>📚 Book Tracker</h1>

        <p>
          Keep track of the books you're reading.
        </p>
      </header>

       <BookSearch />

      <div className="add-book-row">
        <button
          type="button"
          className="button button-primary"
          onClick={() =>
            setIsAddBookOpen(true)
          }
        >
          Add Book
        </button>
      </div>

      {isAddBookOpen && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <h2>Add Book</h2>

              <button
                type="button"
                className="modal-close"
                onClick={() =>
                  setIsAddBookOpen(false)
                }
              >
                ×
              </button>
            </div>

            <BookForm
              onBookAdded={() =>
                setIsAddBookOpen(false)
              }
/>

            <div className="modal-footer">
              <button
                type="button"
                className="button button-secondary"
                onClick={() =>
                  setIsAddBookOpen(false)
                }
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <BookStats />

      <BookFilters />

      {!isLoading && (
            <BookList />
      )}

       {isLoading && (
        <p className="api-message">
          Loading books...
        </p>
      )}

      {loadError && (
        <p className="api-error">
          {loadError}
        </p>
      )}

    </main>
  );
}

export default BooksPage;