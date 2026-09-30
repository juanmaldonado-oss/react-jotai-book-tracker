import { useState, type SubmitEvent } from 'react';
import { useSetAtom } from 'jotai';
import { addBookAtom} from '../atoms/bookAtoms';

function BookForm() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');

  const addBook = useSetAtom(addBookAtom);

const handleSubmit = (
  event: SubmitEvent<HTMLFormElement>
) => {
    event.preventDefault(); 

    if (!title.trim() || !author.trim()) {
      return;
    }

    
    addBook({ title: title.trim(), author: author.trim() });

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
            onChange={(event) => setTitle(event.target.value)}
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
            onChange={(event) => setAuthor(event.target.value)}
          />
        </div>

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