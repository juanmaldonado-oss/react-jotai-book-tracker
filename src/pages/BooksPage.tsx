import BookForm from '../components/BookForm';
import BookSearch from '../components/BookSearch';
import BookStats from '../components/BookStats';
import BookFilters from '../components/BookFilters';
import BookList from '../components/BookList';

function BooksPage() {
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
    </main>
  );
}

export default BooksPage;