import React from 'react'
import './About.css'

function About() {
    return (
        <div className='about-box'>
            <h2 className="about-title">About the Library</h2>
            <div className="about-data">
                <div className="about-img">
                    <img src="https://images.unsplash.com/photo-1583468982228-19f19164aee2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=913&q=80" alt="" />
                </div>
                <div>
                    <p className="about-text">
                        This portal supports library administration, member records, book circulation,
                        and issue/return tracking in a single system.<br/>
                        <br/>
                        It is designed to present a clear, official workflow for institutional use,
                        with separate access for administrators and members.<br/>
                        <br/>
                        The interface is intentionally simple so it can be demonstrated and reviewed
                        in formal environments without unnecessary promotional content.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default About
