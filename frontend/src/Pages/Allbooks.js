import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./Allbooks.css";
import axios from "axios";
import FormMessage from "../Components/FormMessage";
import { getApiErrorMessage } from "../utils/formHelpers";

const PLACEHOLDER_COVER = "https://covers.openlibrary.org/b/id/8231990-L.jpg";

function Allbooks() {
  const API_URL = process.env.REACT_APP_API_URL;
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = (searchParams.get("q") || "").trim().toLowerCase();

  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [booksRes, catsRes] = await Promise.all([
          axios.get(API_URL + "api/books/allbooks"),
          axios.get(API_URL + "api/categories/allcategories"),
        ]);
        setBooks(booksRes.data);
        setCategories(catsRes.data);
      } catch (err) {
        setError(getApiErrorMessage(err, "Failed to load books."));
      }
      setLoading(false);
    };
    load();
  }, [API_URL]);

  const categoryMap = categories.reduce((acc, cat) => {
    acc[cat._id] = cat.categoryName;
    return acc;
  }, {});

  const filtered = books.filter((book) => {
    if (!query) return true;
    const haystack = `${book.bookName} ${book.author} ${book.alternateTitle || ""}`.toLowerCase();
    return haystack.includes(query);
  });

  const getCategoryNames = (book) => {
    if (!book.categories?.length) return ["General"];
    return book.categories.map((c) => (typeof c === "object" ? categoryMap[c._id] || "Category" : categoryMap[c] || "Category"));
  };

  return (
    <div className="books-page">
      <div style={{ padding: "70px 20px 10px", maxWidth: 1024, margin: "0 auto" }}>
        <FormMessage type="error" message={error} />
        {query && (
          <p style={{ fontWeight: 700, margin: "0 0 10px" }}>
            Showing results for &quot;{searchParams.get("q")}&quot; ({filtered.length})
          </p>
        )}
      </div>
      {loading && <p className="books-empty">Loading books...</p>}
      <div className="books">
        {!loading && filtered.length === 0 && (
          <p className="books-empty">No books found.</p>
        )}
        {filtered.map((book) => (
          <div
            key={book._id}
            className="book-card"
            style={{ cursor: "pointer" }}
            onClick={() => setSelectedBook(book)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setSelectedBook(book)}
          >
            <img src={PLACEHOLDER_COVER} alt={`${book.bookName} cover`} />
            <p className="bookcard-title">{book.bookName}</p>
            <p className="bookcard-author">By {book.author}</p>
            <p className="bookcard-availability">
              {book.bookCountAvailable > 0
                ? `${book.bookCountAvailable} cop${book.bookCountAvailable === 1 ? "y" : "ies"} available`
                : "Currently unavailable"}
            </p>
            <div className="bookcard-category">
              {getCategoryNames(book).map((name) => (
                <p key={name}>{name}</p>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedBook && (
        <div className="book-modal-overlay" onClick={() => setSelectedBook(null)}>
          <div className="book-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{selectedBook.bookName}</h3>
            {selectedBook.alternateTitle && <p><b>Also known as:</b> {selectedBook.alternateTitle}</p>}
            <p><b>Author:</b> {selectedBook.author}</p>
            {selectedBook.publisher && <p><b>Publisher:</b> {selectedBook.publisher}</p>}
            {selectedBook.language && <p><b>Language:</b> {selectedBook.language}</p>}
            <p><b>Categories:</b> {getCategoryNames(selectedBook).join(", ")}</p>
            <p className="book-availability">
              {selectedBook.bookCountAvailable > 0
                ? `${selectedBook.bookCountAvailable} cop${selectedBook.bookCountAvailable === 1 ? "y" : "ies"} available`
                : "Currently unavailable — contact the library to reserve."}
            </p>
            <button type="button" className="book-modal-close" onClick={() => setSelectedBook(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Allbooks;
