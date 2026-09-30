import { useAtomValue } from 'jotai';
import {
  totalBooksAtom,
  readBooksAtom,
  unreadBooksAtom,
  readPercentageAtom
} from '../atoms/bookAtoms';

function BookStats() {
  const totalBooks = useAtomValue(totalBooksAtom);
  const readBooks = useAtomValue(readBooksAtom);
  const unreadBooks = useAtomValue(unreadBooksAtom);
  const readPercentage = useAtomValue(readPercentageAtom);

   return (
    <section className="stats-grid">
      <div className="stat-card">
        <span className="stat-value">
          {totalBooks}
        </span>

        <span className="stat-label">
          Total Books
        </span>
      </div>

      <div className="stat-card">
        <span className="stat-value">
          {readBooks.length}
        </span>

        <span className="stat-label">
          Read
        </span>
      </div>

      <div className="stat-card">
        <span className="stat-value">
          {unreadBooks.length}
        </span>

        <span className="stat-label">
          Unread
        </span>
      </div>

      <div className="stat-card">
        <span className="stat-value">
          {readPercentage}%
        </span>

        <span className="stat-label">
          Progress
        </span>
      </div>
    </section>
  );
}

export default BookStats;