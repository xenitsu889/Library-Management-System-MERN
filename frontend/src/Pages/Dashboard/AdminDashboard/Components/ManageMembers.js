import React, { useContext, useEffect, useState } from 'react'
import "../AdminDashboard.css"
import axios from "axios"
import { AuthContext } from '../../../../Context/AuthContext'
import FormMessage from '../../../../Components/FormMessage'
import { getApiErrorMessage, parseAge, parseMobileNumber, isNonEmpty } from '../../../../utils/formHelpers'

function ManageMembers() {
    const API_URL = process.env.REACT_APP_API_URL
    const { user } = useContext(AuthContext)
    const [members, setMembers] = useState([])
    const [editingId, setEditingId] = useState(null)
    const [editForm, setEditForm] = useState({})
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [loading, setLoading] = useState(true)

    const loadMembers = async () => {
        setLoading(true)
        try {
            const response = await axios.get(API_URL + "api/users/allmembers")
            setMembers(response.data)
        } catch (err) {
            setError(getApiErrorMessage(err, "Failed to load members."))
        }
        setLoading(false)
    }

    useEffect(() => { loadMembers() }, [API_URL])

    const startEdit = (member) => {
        setEditingId(member._id)
        setEditForm({
            userFullName: member.userFullName,
            email: member.email,
            mobileNumber: member.mobileNumber,
            address: member.address,
            age: member.age
        })
        setError("")
        setSuccess("")
    }

    const cancelEdit = () => {
        setEditingId(null)
        setEditForm({})
    }

    const saveEdit = async () => {
        if (!isNonEmpty(editForm.userFullName) || !isNonEmpty(editForm.email) || !isNonEmpty(editForm.address)) {
            setError("Name, email, and address are required.")
            return
        }
        const ageResult = parseAge(editForm.age)
        if (!ageResult.valid) {
            setError(ageResult.error)
            return
        }
        const mobileResult = parseMobileNumber(editForm.mobileNumber)
        if (!mobileResult.valid) {
            setError(mobileResult.error)
            return
        }
        try {
            await axios.put(API_URL + "api/users/updateuser/" + editingId, {
                isAdmin: user.isAdmin,
                userFullName: editForm.userFullName.trim(),
                email: editForm.email.trim(),
                address: editForm.address.trim(),
                age: ageResult.value,
                mobileNumber: mobileResult.value
            })
            setSuccess("Member updated successfully.")
            setEditingId(null)
            loadMembers()
        } catch (err) {
            setError(getApiErrorMessage(err, "Failed to update member."))
        }
    }

    const deleteMember = async (memberId, name) => {
        if (!window.confirm(`Delete member "${name}"? This cannot be undone.`)) return
        setError("")
        setSuccess("")
        try {
            await axios.delete(API_URL + "api/users/deleteuser/" + memberId, {
                data: { isAdmin: user.isAdmin }
            })
            setSuccess("Member deleted successfully.")
            if (editingId === memberId) cancelEdit()
            loadMembers()
        } catch (err) {
            setError(getApiErrorMessage(err, "Failed to delete member."))
        }
    }

    const activeLoanCount = (member) =>
        member.activeTransactions?.filter((t) => t.transactionStatus === "Active").length || 0

    return (
        <div>
            <p className="dashboard-option-title">Manage Members</p>
            <div className="dashboard-title-line"></div>
            <FormMessage type="error" message={error} />
            <FormMessage type="success" message={success} />
            {loading && <p className="dashboard-loading">Loading members...</p>}

            {editingId && (
                <div className="edit-panel">
                    <p style={{ fontWeight: 700, marginBottom: 12 }}>Edit Member</p>
                    <label className="addmember-form-label">Full Name</label><br />
                    <input className="addmember-form-input" value={editForm.userFullName} onChange={(e) => setEditForm({ ...editForm, userFullName: e.target.value })} /><br />
                    <label className="addmember-form-label">Email</label><br />
                    <input className="addmember-form-input" type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} /><br />
                    <label className="addmember-form-label">Mobile</label><br />
                    <input className="addmember-form-input" value={editForm.mobileNumber} onChange={(e) => setEditForm({ ...editForm, mobileNumber: e.target.value })} /><br />
                    <label className="addmember-form-label">Age</label><br />
                    <input className="addmember-form-input" type="number" min="1" max="150" value={editForm.age} onChange={(e) => setEditForm({ ...editForm, age: e.target.value })} /><br />
                    <label className="addmember-form-label">Address</label><br />
                    <input className="addmember-form-input" value={editForm.address} onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} /><br />
                    <button type="button" className="dashboard-action-btn" onClick={saveEdit}>Save</button>
                    <button type="button" className="dashboard-action-btn secondary" onClick={cancelEdit}>Cancel</button>
                </div>
            )}

            <table className="admindashboard-table">
                <tr>
                    <th>S.No</th>
                    <th>Type</th>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Active Loans</th>
                    <th>Points</th>
                    <th>Actions</th>
                </tr>
                {members.map((member, index) => (
                    <tr key={member._id}>
                        <td>{index + 1}</td>
                        <td>{member.userType}</td>
                        <td>{member.userType === "Student" ? member.admissionId : member.employeeId}</td>
                        <td>{member.userFullName}</td>
                        <td>{activeLoanCount(member)}</td>
                        <td>{member.points}</td>
                        <td>
                            <button type="button" className="dashboard-action-btn secondary" onClick={() => startEdit(member)}>Edit</button>
                            <button type="button" className="dashboard-action-btn danger" onClick={() => deleteMember(member._id, member.userFullName)}>Delete</button>
                        </td>
                    </tr>
                ))}
            </table>
        </div>
    )
}

export default ManageMembers
