import React from 'react'
import './RecentAddedBooks.css'
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import EventNoteIcon from '@material-ui/icons/EventNote';
import HistoryIcon from '@material-ui/icons/History';
import SecurityIcon from '@material-ui/icons/Security';

function RecentAddedBooks() {
    return (
        <div className='recentaddedbooks-container'>
            <h className='recentbooks-title'>Recent Additions</h>
            <div className='recentbooks recentbooks-grid'>
                <div className='recent-card'><LibraryBooksIcon className='recent-icon' /><h3>Catalog Entries</h3><p>New titles are added through administrative review.</p></div>
                <div className='recent-card'><EventNoteIcon className='recent-icon' /><h3>Reservation Logs</h3><p>Hold requests are recorded for controlled circulation.</p></div>
                <div className='recent-card'><HistoryIcon className='recent-icon' /><h3>Issue History</h3><p>Every issue and return action is tracked in the portal.</p></div>
                <div className='recent-card'><SecurityIcon className='recent-icon' /><h3>Verified Records</h3><p>Member details stay aligned with authorization rules.</p></div>
            </div>
        </div>
    )
}

export default RecentAddedBooks