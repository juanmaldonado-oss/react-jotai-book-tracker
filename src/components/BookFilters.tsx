import { useAtom } from 'jotai';
import {
  searchAtom,
  bookFilterAtom,
} from '../atoms/bookAtoms';

function BookFilters() {
  const [search, setSearch] = useAtom(searchAtom);
  const [filter, setFilter] = useAtom(bookFilterAtom);

  return (
    <section className="card filters-card">
      <div className="form-field">
        <label htmlFor="search">
          Search
        </label>

        <input
          id="search"
          type="text"
          placeholder="Search by title or author"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />
      </div>

      <div className="filter-buttons">
        <button
          className={
            filter === 'all'
              ? 'button button-primary'
              : 'button button-secondary'
          }
          onClick={() => setFilter('all')}
        >
          All
        </button>

        <button
          className={
            filter === 'read'
              ? 'button button-primary'
              : 'button button-secondary'
          }
          onClick={() => setFilter('read')}
        >
          Read
        </button>

        <button
          className={
            filter === 'unread'
              ? 'button button-primary'
              : 'button button-secondary'
          }
          onClick={() => setFilter('unread')}
        >
          Unread
        </button>
      </div>
    </section>
  );
}

export default BookFilters;