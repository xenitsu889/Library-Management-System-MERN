import React, { useEffect, useState } from 'react'
import './Stats.css'
import axios from 'axios'
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import LocalLibraryIcon from '@material-ui/icons/LocalLibrary';
import BookIcon from '@material-ui/icons/Book';

function Stats() {
    const API_URL = process.env.REACT_APP_API_URL
    const [counts, setCounts] = useState({ books: 0, members: 0, reservations: 0 })

    useEffect(() => {
        const loadCounts = async () => {
            try {
                const [booksRes, membersRes, reservationsRes] = await Promise.all([
                    axios.get(API_URL + 'api/books/allbooks'),
                    axios.get(API_URL + 'api/users/allmembers'),
                    axios.get(API_URL + 'api/transactions/all-transactions')
                ])

                setCounts({
                    books: booksRes.data.length,
                    members: membersRes.data.length,
                    reservations: reservationsRes.data.length
                })
            } catch (err) {
                console.log(err)
            }
        }

        loadCounts()
    }, [API_URL])

    return (
        <div className='stats'>
            <div className='stats-block'>
                <LibraryBooksIcon className='stats-icon' style={{ fontSize:80 }}/>
                <p className='stats-title'>Total Books</p>
                <p className='stats-count'>{counts.books}</p>
            </div>
            <div className='stats-block'>
                <LocalLibraryIcon className='stats-icon' style={{ fontSize:80 }}/>
                <p className='stats-title'>Total Members</p>
                <p className='stats-count'>{counts.members}</p>
            </div>
            <div className='stats-block'>
                <BookIcon className='stats-icon' style={{ fontSize:80 }}/>
                <p className='stats-title'>Reservations</p>
                <p className='stats-count'>{counts.reservations}</p>
            </div>
        </div>
    )
}

export default Stats