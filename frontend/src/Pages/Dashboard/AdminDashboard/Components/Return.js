import React, { useContext, useEffect, useState } from 'react'
import "../AdminDashboard.css"
import axios from "axios"
import { Dropdown } from 'semantic-ui-react'
import '../../MemberDashboard/MemberDashboard.css'
import moment from "moment"
import { AuthContext } from '../../../../Context/AuthContext'
import FormMessage from '../../../../Components/FormMessage'
import { getApiErrorMessage, calculateFine } from '../../../../utils/formHelpers'


function Return() {

    const API_URL = process.env.REACT_APP_API_URL
    const { user } = useContext(AuthContext)

    const [allTransactions, setAllTransactions] = useState([])
    const [ExecutionStatus, setExecutionStatus] = useState(null) /* For triggering the tabledata to be updated */ 

    const [allMembersOptions, setAllMembersOptions] = useState(null)
    const [borrowerId, setBorrowerId] = useState(null)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")


    //Fetching all Members
    useEffect(() => {
        const getMembers = async () => {
            try {
                const response = await axios.get(API_URL + "api/users/allmembers")
                setAllMembersOptions(response.data.map((member) => (
                    { value: `${member?._id}`, text: `${member?.userType === "Student" ? `${member?.userFullName}[${member?.admissionId}]` : `${member?.userFullName}[${member?.employeeId}]`}` }
                )))
            }
            catch (err) {
                setError(getApiErrorMessage(err, "Failed to load members."))
            }
        }
        getMembers()
    }, [API_URL])


    /* Getting all active transactions */
    useEffect(()=>{
        const getAllTransactions = async () =>{
            try{
                const response = await axios.get(API_URL+"api/transactions/all-transactions")
                setAllTransactions(response.data.sort((a, b) => Date.parse(a.toDate) - Date.parse(b.toDate)).filter((data) => {
                    return data.transactionStatus === "Active"
                }))
                setExecutionStatus(null)
            }
            catch(err){
                setError(getApiErrorMessage(err, "Failed to load transactions."))
            }
        }
        getAllTransactions()
    },[API_URL,ExecutionStatus])


    const returnBook = async (transactionId,borrowerId,bookId,due) =>{
        setError("")
        setSuccess("")
        try{
            /* Setting return date and transactionStatus to completed */
            await axios.put(API_URL+"api/transactions/update-transaction/"+transactionId,{
                isAdmin:user.isAdmin,
                transactionStatus:"Completed",
                returnDate:moment(new Date()).format("MM/DD/YYYY")
            })

            /* Getting borrower points alreadt existed */
            const borrowerdata = await axios.get(API_URL+"api/users/getuser/"+borrowerId)
            const points = borrowerdata.data.points

            /* If the number of days after dueDate is greater than zero then decreasing points by 10 else increase by 10*/
            if(due > 0){
                await axios.put(API_URL+"api/users/updateuser/"+borrowerId,{
                    points:points-10,
                    isAdmin: user.isAdmin
                })
            }
            else if(due<=0){
                await axios.put(API_URL+"api/users/updateuser/"+borrowerId,{
                    points:points+10,
                    isAdmin: user.isAdmin
                })
            }

            const book_details = await axios.get(API_URL+"api/books/getbook/"+bookId)
            await axios.put(API_URL+"api/books/updatebook/"+bookId,{
                isAdmin:user.isAdmin,
                bookCountAvailable:book_details.data.bookCountAvailable + 1
            })

            /* Pulling out the transaction id from user active Transactions and pushing to Prev Transactions */
            await axios.put(API_URL + `api/users/${transactionId}/move-to-prevtransactions`, {
                userId: borrowerId,
                isAdmin: user.isAdmin
            })

            setExecutionStatus("Completed");
            setSuccess("Book returned to the library successfully.")
        }
        catch(err){
            setError(getApiErrorMessage(err, "Failed to return book."))
        }
    }

    const convertToIssue = async (transactionId) => {
        setError("")
        setSuccess("")
        try{
            await axios.put(API_URL+"api/transactions/update-transaction/"+transactionId,{
                transactionType:"Issued",
                isAdmin:user.isAdmin
            })
            setExecutionStatus("Completed");
            setSuccess("Book issued successfully.")
        }
        catch(err){
            setError(getApiErrorMessage(err, "Failed to convert reservation to issue."))
        }
    }

    const cancelReservation = async (transactionId, borrowerId, bookId) => {
        if (!window.confirm("Cancel this reservation and restore the book copy?")) return
        setError("")
        setSuccess("")
        try {
            await axios.put(API_URL + "api/transactions/update-transaction/" + transactionId, {
                transactionStatus: "Cancelled",
                isAdmin: user.isAdmin
            })
            const book_details = await axios.get(API_URL + "api/books/getbook/" + bookId)
            await axios.put(API_URL + "api/books/updatebook/" + bookId, {
                isAdmin: user.isAdmin,
                bookCountAvailable: book_details.data.bookCountAvailable + 1
            })
            await axios.put(API_URL + `api/users/${transactionId}/remove-from-active`, {
                userId: borrowerId,
                isAdmin: user.isAdmin
            })
            setExecutionStatus("Completed")
            setSuccess("Reservation cancelled successfully.")
        } catch (err) {
            setError(getApiErrorMessage(err, "Failed to cancel reservation."))
        }
    }

    const overdueIssued = allTransactions?.filter((data) => {
        const isIssued = data.transactionType === "Issued"
        const matchesBorrower = borrowerId === null || data.borrowerId === borrowerId
        return isIssued && matchesBorrower && calculateFine(data.toDate) > 0
    }) || []


    return (
        <div>
            <FormMessage type="error" message={error} />
            <FormMessage type="success" message={success} />
            <div className='semanticdropdown returnbook-dropdown'>
                <Dropdown
                    placeholder='Select Member'
                    fluid
                    search
                    selection
                    value={borrowerId}
                    options={allMembersOptions}
                    onChange={(event, data) => setBorrowerId(data.value)}
                />
            </div>
            {overdueIssued.length > 0 && (
                <>
                    <p className="dashboard-option-title">Overdue ({overdueIssued.length})</p>
                    <table className="admindashboard-table">
                        <tr>
                            <th>Book Name</th>
                            <th>Borrower</th>
                            <th>To Date</th>
                            <th>Fine</th>
                        </tr>
                        {overdueIssued.map((data) => (
                            <tr key={data._id}>
                                <td>{data.bookName}</td>
                                <td>{data.borrowerName}</td>
                                <td>{data.toDate}</td>
                                <td>{calculateFine(data.toDate)}</td>
                            </tr>
                        ))}
                    </table>
                </>
            )}
            <p className="dashboard-option-title">Issued</p>
            <table className="admindashboard-table">
                    <tr>
                        <th>Book Name</th>
                        <th>Borrower Name</th>
                        <th>From Date</th>
                        <th>To Date</th>
                        <th>Fine</th>
                        <th></th>
                    </tr>
                    {
                        allTransactions?.filter((data)=>{
                            if(borrowerId === null){
                                return data.transactionType === "Issued"
                            }
                            else{
                                return data.borrowerId === borrowerId && data.transactionType === "Issued"
                            }
                        }).map((data, index) => {
                            return (
                                <tr key={index}>
                                    <td>{data.bookName}</td>
                                    <td>{data.borrowerName}</td>
                                    <td>{data.fromDate}</td>
                                    <td>{data.toDate}</td>
                                    <td>{calculateFine(data.toDate)}</td>
                                    <td><button type="button" className="dashboard-action-btn" onClick={()=>{returnBook(data._id,data.borrowerId,data.bookId,(Math.floor(( Date.parse(moment(new Date()).format("MM/DD/YYYY")) - Date.parse(data.toDate) ) / 86400000)))}}>Return</button></td>
                                </tr>
                            )
                        })
                    }
                </table>
                <p className="dashboard-option-title">Reserved</p>
            <table className="admindashboard-table">
                    <tr>
                        <th>Book Name</th>
                        <th>Borrower Name</th>
                        <th>From Date</th>
                        <th>To Date</th>
                        <th>Convert</th>
                        <th>Cancel</th>
                    </tr>
                    {
                        allTransactions?.filter((data)=>{
                            if(borrowerId === null){
                                return data.transactionType === "Reserved"
                            }
                            else{
                                return data.borrowerId === borrowerId && data.transactionType === "Reserved"
                            }
                        }).map((data, index) => {
                            return (
                                <tr key={index}>
                                    <td>{data.bookName}</td>
                                    <td>{data.borrowerName}</td>
                                    <td>{data.fromDate}</td>
                                    <td>{data.toDate}</td>
                                    <td><button type="button" className="dashboard-action-btn" onClick={()=>{convertToIssue(data._id)}}>Convert</button></td>
                                    <td><button type="button" className="dashboard-action-btn danger" onClick={()=>{cancelReservation(data._id, data.borrowerId, data.bookId)}}>Cancel</button></td>
                                </tr>
                            )
                        })
                    }
                </table>
        </div>
    )
}

export default Return
