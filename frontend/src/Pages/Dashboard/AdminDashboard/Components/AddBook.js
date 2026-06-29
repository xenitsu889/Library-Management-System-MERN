import React, { useContext, useEffect, useState } from 'react'
import "../AdminDashboard.css"
import axios from "axios"
import { AuthContext } from '../../../../Context/AuthContext'
import { Dropdown } from 'semantic-ui-react'
import FormMessage from '../../../../Components/FormMessage'
import { getApiErrorMessage, parsePositiveInteger, isNonEmpty } from '../../../../utils/formHelpers'

function AddBook() {

    const API_URL = process.env.REACT_APP_API_URL
    const [isLoading, setIsLoading] = useState(false)
    const { user } = useContext(AuthContext)

    const [bookName, setBookName] = useState("")
    const [alternateTitle, setAlternateTitle] = useState("")
    const [author, setAuthor] = useState("")
    const [bookCountAvailable, setBookCountAvailable] = useState("")
    const [language, setLanguage] = useState("")
    const [publisher, setPublisher] = useState("")
    const [allCategories, setAllCategories] = useState([])
    const [selectedCategories, setSelectedCategories] = useState([])
    const [recentAddedBooks, setRecentAddedBooks] = useState([])
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")


    useEffect(() => {
        const getAllCategories = async () => {
            try {
                const response = await axios.get(API_URL + "api/categories/allcategories")
                const all_categories = await response.data.map(category => (
                    { value: `${category._id}`, text: `${category.categoryName}` }
                ))
                setAllCategories(all_categories)
            }
            catch (err) {
                setError(getApiErrorMessage(err, "Failed to load categories."))
            }
        }
        getAllCategories()
    }, [API_URL])

    const addBook = async (e) => {
        e.preventDefault()
        setError("")
        setSuccess("")

        if (!isNonEmpty(bookName) || !isNonEmpty(author)) {
            setError("Book name and author are required.")
            return
        }

        const countResult = parsePositiveInteger(bookCountAvailable, "Number of copies")
        if (!countResult.valid) {
            setError(countResult.error)
            return
        }

        if (selectedCategories.length === 0) {
            setError("Please select at least one category.")
            return
        }

        setIsLoading(true)
        const BookData = {
            bookName: bookName.trim(),
            alternateTitle: alternateTitle.trim(),
            author: author.trim(),
            bookCountAvailable: countResult.value,
            language: language.trim(),
            publisher: publisher.trim(),
            categories: selectedCategories,
            isAdmin: user.isAdmin
        }
        try {
            const response = await axios.post(API_URL + "api/books/addbook", BookData)
            if (recentAddedBooks.length >= 5) {
                recentAddedBooks.splice(-1)
            }
            setRecentAddedBooks([response.data, ...recentAddedBooks])
            setBookName("")
            setAlternateTitle("")
            setAuthor("")
            setBookCountAvailable("")
            setLanguage("")
            setPublisher("")
            setSelectedCategories([])
            setSuccess("Book added successfully.")
        }
        catch (err) {
            setError(getApiErrorMessage(err, "Failed to add book."))
        }
        setIsLoading(false)
    }


    useEffect(() => {
        const getallBooks = async () => {
            try {
                const response = await axios.get(API_URL + "api/books/allbooks")
                setRecentAddedBooks(response.data.slice(0, 5))
            } catch (err) {
                setError(getApiErrorMessage(err, "Failed to load recent books."))
            }
        }
        getallBooks()
    }, [API_URL])


    return (
        <div>
            <p className="dashboard-option-title">Add a Book</p>
            <div className="dashboard-title-line"></div>
            <FormMessage type="error" message={error} />
            <FormMessage type="success" message={success} />
            <form className='addbook-form' onSubmit={addBook}>

                <label className="addbook-form-label" htmlFor="bookName">Book Name<span className="required-field">*</span></label><br />
                <input className="addbook-form-input" type="text" id="bookName" name="bookName" value={bookName} onChange={(e) => { setBookName(e.target.value); setError("") }} required></input><br />

                <label className="addbook-form-label" htmlFor="alternateTitle">AlternateTitle</label><br />
                <input className="addbook-form-input" type="text" id="alternateTitle" name="alternateTitle" value={alternateTitle} onChange={(e) => { setAlternateTitle(e.target.value) }}></input><br />

                <label className="addbook-form-label" htmlFor="author">Author Name<span className="required-field">*</span></label><br />
                <input className="addbook-form-input" type="text" id="author" name="author" value={author} onChange={(e) => { setAuthor(e.target.value); setError("") }} required></input><br />

                <label className="addbook-form-label" htmlFor="language">Language</label><br />
                <input className="addbook-form-input" type="text" id="language" name="language" value={language} onChange={(e) => { setLanguage(e.target.value) }}></input><br />

                <label className="addbook-form-label" htmlFor="publisher">Publisher</label><br />
                <input className="addbook-form-input" type="text" id="publisher" name="publisher" value={publisher} onChange={(e) => { setPublisher(e.target.value) }}></input><br />

                <label className="addbook-form-label" htmlFor="copies">No.of Copies Available<span className="required-field">*</span></label><br />
                <input
                    className="addbook-form-input"
                    type="number"
                    id="copies"
                    name="copies"
                    min="0"
                    step="1"
                    value={bookCountAvailable}
                    onChange={(e) => { setBookCountAvailable(e.target.value); setError("") }}
                    required
                ></input><br />

                <label className="addbook-form-label" htmlFor="categories">Categories<span className="required-field">*</span></label><br />
                <div className="semanticdropdown">
                    <Dropdown
                        placeholder='Category'
                        fluid
                        multiple
                        search
                        selection
                        options={allCategories}
                        value={selectedCategories}
                        onChange={(event, value) => { setSelectedCategories(value.value); setError("") }}
                    />
                </div>

                <input className="addbook-submit" type="submit" value="SUBMIT" disabled={isLoading}></input>
            </form>
            <div>
                <p className="dashboard-option-title">Recently Added Books</p>
                <div className="dashboard-title-line"></div>
                <table className='admindashboard-table'>
                    <tr>
                        <th>S.No</th>
                        <th>Book Name</th>
                        <th>Added Date</th>
                    </tr>
                    {
                        recentAddedBooks.map((book, index) => {
                            return (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{book.bookName}</td>
                                    <td>{book.createdAt.substring(0, 10)}</td>
                                </tr>
                            )
                        })
                    }
                </table>
            </div>
        </div>
    )
}

export default AddBook
