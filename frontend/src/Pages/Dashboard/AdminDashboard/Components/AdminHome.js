import React, { useEffect, useState } from 'react'
import "../AdminDashboard.css"
import axios from "axios"
import FormMessage from '../../../../Components/FormMessage'
import { getApiErrorMessage, calculateFine } from '../../../../utils/formHelpers'
import moment from "moment"

function AdminHome() {
    const API_URL = process.env.REACT_APP_API_URL
    const [stats, setStats] = useState({
        books: 0, members: 0, activeLoans: 0, overdue: 0, reserved: 0
    })
    const [overdueList, setOverdueList] = useState([])
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const load = async () => {
            setLoading(true)
            setError("")
            try {
                const [booksRes, membersRes, txnsRes] = await Promise.all([
                    axios.get(API_URL + "api/books/allbooks"),
                    axios.get(API_URL + "api/users/allmembers"),
                    axios.get(API_URL + "api/transactions/all-transactions")
                ])
                const txns = txnsRes.data
                const active = txns.filter((t) => t.transactionStatus === "Active")
                const issued = active.filter((t) => t.transactionType === "Issued")
                const reserved = active.filter((t) => t.transactionType === "Reserved")
                const today = moment(new Date()).format("MM/DD/YYYY")
                const overdue = issued.filter((t) => Date.parse(t.toDate) < Date.parse(today))

                setStats({
                    books: booksRes.data.length,
                    members: membersRes.data.length,
                    activeLoans: issued.length,
                    overdue: overdue.length,
                    reserved: reserved.length
                })
                setOverdueList(overdue.map((t) => ({
                    ...t,
                    fine: calculateFine(t.toDate)
                })))
            } catch (err) {
                setError(getApiErrorMessage(err, "Failed to load dashboard stats."))
            }
            setLoading(false)
        }
        load()
    }, [API_URL])

    return (
        <div>
            <p className="dashboard-option-title">Dashboard Overview</p>
            <div className="dashboard-title-line"></div>
            <FormMessage type="error" message={error} />
            {loading && <p className="dashboard-loading">Loading overview...</p>}
            <div className="admin-stats-grid">
                <div className="admin-stat-card"><h3>Total Books</h3><p>{stats.books}</p></div>
                <div className="admin-stat-card"><h3>Members</h3><p>{stats.members}</p></div>
                <div className="admin-stat-card"><h3>Active Loans</h3><p>{stats.activeLoans}</p></div>
                <div className="admin-stat-card"><h3>Reserved</h3><p>{stats.reserved}</p></div>
                <div className="admin-stat-card"><h3>Overdue</h3><p>{stats.overdue}</p></div>
            </div>

            <p className="dashboard-option-title">Overdue Books</p>
            <div className="dashboard-title-line"></div>
            <table className="admindashboard-table">
                <tr>
                    <th>Book</th>
                    <th>Borrower</th>
                    <th>To Date</th>
                    <th>Fine (₹)</th>
                </tr>
                {overdueList.length === 0 ? (
                    <tr><td colSpan="4">No overdue books right now.</td></tr>
                ) : overdueList.map((t) => (
                    <tr key={t._id}>
                        <td>{t.bookName}</td>
                        <td>{t.borrowerName}</td>
                        <td>{t.toDate}</td>
                        <td>{t.fine}</td>
                    </tr>
                ))}
            </table>
        </div>
    )
}

export default AdminHome
