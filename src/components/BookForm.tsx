import { useState, type SubmitEvent } from 'react';
import { useSetAtom } from 'jotai';
import { addBookAtom } from '../atoms/bookActions';

interface BookFormProps {
  onBookAdded: () => void;
}

function BookForm({
  onBookAdded,
}: BookFormProps) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing,] = useState(false);
  const [pdfMessage, setPdfMessage,] = useState('');
  const addBook = useSetAtom(addBookAtom);

const analyzePdf = async () => {
  if (!selectedFile) {
    setError('Please select a PDF first.');
    return;
  }

  const maxFileSize =
    4 * 1024 * 1024;

  if (selectedFile.size > maxFileSize) {
    setError(
      'PDF must be smaller than 4 MB.'
    );
    return;
  }

  setError('');
  setPdfMessage('');
  setIsAnalyzing(true);

  try {
    const formData =
      new FormData();

    formData.append(
      'file',
      selectedFile
    );

    const response =
      await fetch(
        '/api/analyze-book',
        {
          method: 'POST',
          body: formData,
        }
      );

    const data =
      (await response.json()) as {
        success?: boolean;

        book?: {
          title: string;
          author: string;
        };

        error?: string;
      };

    if (!response.ok) {
      setError(
        data.error ??
          'Unable to analyze PDF.'
      );

      return;
    }

    if (!data.book) {
      setError(
        'Book information was not returned.'
      );
      return;
    }

    setTitle(data.book.title);
    setAuthor(data.book.author);

    setPdfMessage(
      'Book information detected successfully.'
    );
  } catch (error) {
    console.error(
      'PDF analysis failed:',
      error
    );

    setError(
      'Unable to analyze PDF.'
    );
  } finally {
    setIsAnalyzing(false);
  }
};

const handleSubmit = async (
  event: SubmitEvent<HTMLFormElement>
) => {
  event.preventDefault();

  if (!title.trim() || !author.trim()) {
    setError('Title and author are required.');
    return;
  }

  const result = await addBook({
  title: title.trim(),
  author: author.trim(),
});

if (!result.success) {
  setError(result.message);
  return;
}

  setError('');
  setTitle('');
  setAuthor('');
  onBookAdded();
  setSelectedFile(null);
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

        <div className="form-field">
  <label htmlFor="book-pdf">
    Book PDF
  </label>

  <input
    id="book-pdf"
    type="file"
    accept="application/pdf"
    onChange={(event) => {
      const file =
        event.target.files?.[0] ?? null;

      if (
        file &&
        file.type !== 'application/pdf'
      ) {
        setError(
          'Please select a PDF file.'
        );

        setSelectedFile(null);

        return;
      }

      setError('');
      setSelectedFile(file);
    }}
  />

  {selectedFile && (
  <p className="selected-file">
    Selected: {selectedFile.name}
  </p>
)}

<button
  type="button"
  className="button button-secondary"
  onClick={analyzePdf}
  disabled={
    !selectedFile ||
    isAnalyzing
  }
>
  {isAnalyzing
    ? 'Analyzing...'
    : 'Analyze PDF'}
</button>

{pdfMessage && (
  <p className="api-message">
    {pdfMessage}
  </p>
)}

  {!pdfMessage && (<small className="form-help">
    Optional. Upload a PDF to detect the
    book title and author.
  </small>)}
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