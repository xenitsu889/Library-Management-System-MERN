import { React, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import './Header.css'

import MenuIcon from '@material-ui/icons/Menu';
import ClearIcon from '@material-ui/icons/Clear';

function Header() {

    const [menutoggle, setMenutoggle] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const history = useHistory()

    const Toggle = () => {
        setMenutoggle(!menutoggle)
    }

    const closeMenu = () => {
        setMenutoggle(false)
    }

    const handleSearch = (e) => {
        e.preventDefault()
        const q = searchQuery.trim()
        if (q) {
            history.push(`/books?q=${encodeURIComponent(q)}`)
        } else {
            history.push('/books')
        }
        closeMenu()
    }

    return (
        <div className="header">
            <div className="logo-nav">
            <Link to='/' className="logo-link">
                LIBRARY
            </Link>
            </div>
            <div className='nav-right'>
                <form onSubmit={handleSearch} style={{ display: 'flex', width: '100%' }}>
                    <input
                        className='search-input'
                        type='text'
                        placeholder='Search books'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </form>
                <ul className={menutoggle ? "nav-options active" : "nav-options"}>
                    <li className="option" onClick={() => { closeMenu() }}>
                        <Link to='/'>
                            Home
                        </Link>
                    </li>
                    <li className="option" onClick={() => { closeMenu() }}>
                        <Link to='/books'>
                        Books
                        </Link>
                    </li>
                    <li className="option" onClick={() => { closeMenu() }}>
                        <Link to='/signin'>
                        Sign In
                        </Link>
                    </li>
                </ul>
            </div>

            <div className="mobile-menu" onClick={() => { Toggle() }}>
                {menutoggle ? (
                    <ClearIcon className="menu-icon" style={{ fontSize: 40 }} />
                ) : (
                    <MenuIcon className="menu-icon" style={{ fontSize: 40 }} />
                )}
            </div>
        </div>
    )
}

export default Header
