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

      <BookForm />

      <BookSearch />
      <BookStats />

      <BookFilters />

      <BookList />

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