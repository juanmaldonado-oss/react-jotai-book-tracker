import { useState, type SubmitEvent } from 'react';
import { useSetAtom } from 'jotai';
import { addBookAtom } from '../atoms/bookActions';

function BookForm() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [error, setError] = useState('');

  const addBook = useSetAtom(addBookAtom);

const handleSubmit = (
  event: SubmitEvent<HTMLFormElement>
) => {
  event.preventDefault();

  if (!title.trim() || !author.trim()) {
    setError('Title and author are required.');
    return;
  }

  const wasAdded = addBook({
    title: title.trim(),
    author: author.trim(),
  });

  if (!wasAdded) {
    setError('This book is already in your collection.');
    return;
  }

  setError('');
  setTitle('');
  setAuthor('');
};

  return (
    <section className="card">
      <h2>Add a Book</h2>

      <form className="book-form" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="title">
            Title
          </label>

          <input
            id="title"
            type="text"
            placeholder="Enter book title"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);

              if (error) {
                setError('');
              }
            }}
          />
        </div>

        <div className="form-field">
          <label htmlFor="author">
            Author
          </label>

          <input
            id="author"
            type="text"
            placeholder="Enter author name"
            value={author}
            onChange={(event) => {
              setAuthor(event.target.value);

              if (error) {
                setError('');
              }
            }}
          />
        </div>

        {error && (
          <p className="form-error">
            {error}
          </p>
        )}

        <div className="form-actions">
          <button
            className="button button-primary"
            type="submit"
          >
            Add Book
          </button>
        </div>
      </form>
    </section>
  );
}

export default BookForm;