import React from 'react'
import './ReservedBooks.css'

function ReservedBooks() {
    return (
        <div className='reservedbooks-container'>
            <h className='reservedbooks-title'>Books On Hold</h>
            <table className='reservedbooks-table'>
                <tr>
                    <th>Name</th>
                    <th>Book</th>
                    <th>Date</th>
                </tr>
                <tr>
                    <td>Member A</td>
                    <td>Administrative Handbook</td>
                    <td>12/7/2026</td>
                </tr>
                <tr>
                    <td>Member B</td>
                    <td>Public Policy Reference</td>
                    <td>10/7/2026</td>
                </tr>
                <tr>
                    <td>Member C</td>
                    <td>Wings Of Fire</td>
                    <td>15/9/2026</td>
                </tr>
                <tr>
                    <td>Member D</td>
                    <td>Policy and Governance</td>
                    <td>02/9/2026</td>
                </tr>
                <tr>
                    <td>Member E</td>
                    <td>Research Methods</td>
                    <td>21/7/2026</td>
                </tr>
                <tr>
                    <td>Member F</td>
                    <td>Information Management</td>
                    <td>02/7/2026</td>
                </tr>
            </table>
        </div>
    )
}

export default ReservedBooks
