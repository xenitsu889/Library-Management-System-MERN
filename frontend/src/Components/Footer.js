import React from 'react'
import './Footer.css'

function Footer() {
    return (
        <div className='footer'>
            <div>
                <div className='footer-data'>
                    <div className="contact-details">
                        <h1>Contact</h1>
                        <p>Library Administration</p>
                        <p>Government Library Management Portal</p>
                        <p>Visakhapatnam-530041</p>
                        <p>Andhra Pradesh, India</p>
                        <p><b>Email:</b> library.admin@example.gov.in</p>
                    </div>
                    <div className='usefull-links'>
                        <h1>Useful Links</h1>
                        <a href='#home'>Home</a>
                        <a href='#home'>Books</a>
                        <a href='#home'>Member Access</a>
                        <a href='#home'>Support</a>
                    </div>
                    <div className='librarian-details'>
                        <h1>Administration</h1>
                        <p>Records Management</p>
                        <p>Digital Library Operations</p>
                        <p>Contact: +91 9123456787</p>
                    </div>
                </div>
            </div>
            <div className='copyright-details'>
                <p className='footer-copyright'>&#169; 2026 Government Library Management Portal<br /><span>Official institutional deployment</span></p>
            </div>
        </div>
    )
}

export default Footer