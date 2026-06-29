import React, { useContext, useEffect, useState } from 'react'
import "../AdminDashboard.css"
import axios from "axios"
import { AuthContext } from '../../../../Context/AuthContext'
import FormMessage from '../../../../Components/FormMessage'
import { getApiErrorMessage, parsePositiveInteger, isNonEmpty } from '../../../../utils/formHelpers'

function ManageBooks() {
    const API_URL = process.env.REACT_APP_API_URL
    const { user } = useContext(AuthContext)
    const [books, setBooks] = useState([])
    const [editingId, setEditingId] = useState(null)
    const [editForm, setEditForm] = useState({})
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadBooks = async () => {
            setLoading(true)
            try {
                const response = await axios.get(API_URL + "api/books/allbooks")
                setBooks(response.data)
            } catch (err) {
                setError(getApiErrorMessage(err, "Failed to load books."))
            }
            setLoading(false)
        }
        loadBooks()
    }, [API_URL])

    const reloadBooks = async () => {
        setLoading(true)
        try {
            const response = await axios.get(API_URL + "api/books/allbooks")
            setBooks(response.data)
        } catch (err) {
            setError(getApiErrorMessage(err, "Failed to load books."))
        }
        setLoading(false)
    }

    const startEdit = (book) => {
        setEditingId(book._id)
        setEditForm({
            bookName: book.bookName,
            author: book.author,
            alternateTitle: book.alternateTitle || "",
            language: book.language || "",
            publisher: book.publisher || "",
            bookCountAvailable: book.bookCountAvailable
        })
        setError("")
        setSuccess("")
    }

    const cancelEdit = () => {
        setEditingId(null)
        setEditForm({})
    }

    const saveEdit = async () => {
        if (!isNonEmpty(editForm.bookName) || !isNonEmpty(editForm.author)) {
            setError("Book name and author are required.")
            return
        }
        const countResult = parsePositiveInteger(editForm.bookCountAvailable, "Number of copies")
        if (!countResult.valid) {
            setError(countResult.error)
            return
        }
        try {
            await axios.put(API_URL + "api/books/updatebook/" + editingId, {
                isAdmin: user.isAdmin,
                bookName: editForm.bookName.trim(),
                author: editForm.author.trim(),
                alternateTitle: editForm.alternateTitle.trim(),
                language: editForm.language.trim(),
                publisher: editForm.publisher.trim(),
                bookCountAvailable: countResult.value
            })
            setSuccess("Book updated successfully.")
            setEditingId(null)
            reloadBooks()
        } catch (err) {
            setError(getApiErrorMessage(err, "Failed to update book."))
        }
    }

    const deleteBook = async (bookId, bookName) => {
        if (!window.confirm(`Delete "${bookName}"? This cannot be undone.`)) return
        setError("")
        setSuccess("")
        try {
            await axios.delete(API_URL + "api/books/removebook/" + bookId, {
                data: { isAdmin: user.isAdmin }
            })
            setSuccess("Book deleted successfully.")
            if (editingId === bookId) cancelEdit()
            reloadBooks()
        } catch (err) {
            setError(getApiErrorMessage(err, "Failed to delete book."))
        }
    }

    return (
        <div>
            <p className="dashboard-option-title">Manage Books</p>
            <div className="dashboard-title-line"></div>
            <FormMessage type="error" message={error} />
            <FormMessage type="success" message={success} />
            {loading && <p className="dashboard-loading">Loading books...</p>}

            {editingId && (
                <div className="edit-panel">
                    <p style={{ fontWeight: 700, marginBottom: 12 }}>Edit Book</p>
                    <label className="addbook-form-label">Book Name</label><br />
                    <input className="addbook-form-input" value={editForm.bookName} onChange={(e) => setEditForm({ ...editForm, bookName: e.target.value })} /><br />
                    <label className="addbook-form-label">Author</label><br />
                    <input className="addbook-form-input" value={editForm.author} onChange={(e) => setEditForm({ ...editForm, author: e.target.value })} /><br />
                    <label className="addbook-form-label">Alternate Title</label><br />
                    <input className="addbook-form-input" value={editForm.alternateTitle} onChange={(e) => setEditForm({ ...editForm, alternateTitle: e.target.value })} /><br />
                    <label className="addbook-form-label">Language</label><br />
                    <input className="addbook-form-input" value={editForm.language} onChange={(e) => setEditForm({ ...editForm, language: e.target.value })} /><br />
                    <label className="addbook-form-label">Publisher</label><br />
                    <input className="addbook-form-input" value={editForm.publisher} onChange={(e) => setEditForm({ ...editForm, publisher: e.target.value })} /><br />
                    <label className="addbook-form-label">Copies Available</label><br />
                    <input className="addbook-form-input" type="number" min="0" value={editForm.bookCountAvailable} onChange={(e) => setEditForm({ ...editForm, bookCountAvailable: e.target.value })} /><br />
                    <button type="button" className="dashboard-action-btn" onClick={saveEdit}>Save</button>
                    <button type="button" className="dashboard-action-btn secondary" onClick={cancelEdit}>Cancel</button>
                </div>
            )}

            <table className="admindashboard-table">
                <tr>
                    <th>S.No</th>
                    <th>Book Name</th>
                    <th>Author</th>
                    <th>Copies</th>
                    <th>Added</th>
                    <th>Actions</th>
                </tr>
                {books.map((book, index) => (
                    <tr key={book._id}>
                        <td>{index + 1}</td>
                        <td>{book.bookName}</td>
                        <td>{book.author}</td>
                        <td>{book.bookCountAvailable}</td>
                        <td>{book.createdAt?.substring(0, 10)}</td>
                        <td>
                            <button type="button" className="dashboard-action-btn secondary" onClick={() => startEdit(book)}>Edit</button>
                            <button type="button" className="dashboard-action-btn danger" onClick={() => deleteBook(book._id, book.bookName)}>Delete</button>
                        </td>
                    </tr>
                ))}
            </table>
        </div>
    )
}

export default ManageBooks
