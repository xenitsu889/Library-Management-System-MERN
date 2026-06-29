import React, { useContext, useEffect, useState } from 'react'
import "../AdminDashboard.css"
import axios from "axios"
import { AuthContext } from '../../../../Context/AuthContext'
import FormMessage from '../../../../Components/FormMessage'
import { getApiErrorMessage, isNonEmpty } from '../../../../utils/formHelpers'

function ManageCategories() {
    const API_URL = process.env.REACT_APP_API_URL
    const { user } = useContext(AuthContext)
    const [categories, setCategories] = useState([])
    const [categoryName, setCategoryName] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadCategories = async () => {
            setLoading(true)
            try {
                const response = await axios.get(API_URL + "api/categories/allcategories")
                setCategories(response.data)
            } catch (err) {
                setError(getApiErrorMessage(err, "Failed to load categories."))
            }
            setLoading(false)
        }
        loadCategories()
    }, [API_URL])

    const reloadCategories = async () => {
        setLoading(true)
        try {
            const response = await axios.get(API_URL + "api/categories/allcategories")
            setCategories(response.data)
        } catch (err) {
            setError(getApiErrorMessage(err, "Failed to load categories."))
        }
        setLoading(false)
    }

    const addCategory = async (e) => {
        e.preventDefault()
        setError("")
        setSuccess("")
        if (!isNonEmpty(categoryName)) {
            setError("Category name is required.")
            return
        }
        try {
            await axios.post(API_URL + "api/categories/addcategory", {
                categoryName: categoryName.trim(),
                isAdmin: user.isAdmin
            })
            setCategoryName("")
            setSuccess("Category added successfully.")
            reloadCategories()
        } catch (err) {
            setError(getApiErrorMessage(err, "Failed to add category."))
        }
    }

    const deleteCategory = async (id, name) => {
        if (!window.confirm(`Delete category "${name}"?`)) return
        setError("")
        setSuccess("")
        try {
            await axios.delete(API_URL + "api/categories/removecategory/" + id, {
                data: { isAdmin: user.isAdmin }
            })
            setSuccess("Category deleted successfully.")
            reloadCategories()
        } catch (err) {
            setError(getApiErrorMessage(err, "Failed to delete category."))
        }
    }

    return (
        <div>
            <p className="dashboard-option-title">Manage Categories</p>
            <div className="dashboard-title-line"></div>
            <FormMessage type="error" message={error} />
            <FormMessage type="success" message={success} />
            <form className="addbook-form" onSubmit={addCategory}>
                <label className="addbook-form-label" htmlFor="categoryName">Category Name</label><br />
                <input
                    id="categoryName"
                    className="addbook-form-input"
                    value={categoryName}
                    onChange={(e) => { setCategoryName(e.target.value); setError("") }}
                    required
                /><br />
                <input className="addbook-submit" type="submit" value="ADD CATEGORY" />
            </form>
            {loading && <p className="dashboard-loading">Loading categories...</p>}
            <table className="admindashboard-table">
                <tr>
                    <th>S.No</th>
                    <th>Category</th>
                    <th>Books</th>
                    <th>Actions</th>
                </tr>
                {categories.map((cat, index) => (
                    <tr key={cat._id}>
                        <td>{index + 1}</td>
                        <td>{cat.categoryName}</td>
                        <td>{cat.books?.length || 0}</td>
                        <td>
                            <button
                                type="button"
                                className="dashboard-action-btn danger"
                                onClick={() => deleteCategory(cat._id, cat.categoryName)}
                                disabled={(cat.books?.length || 0) > 0}
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
            </table>
        </div>
    )
}

export default ManageCategories
