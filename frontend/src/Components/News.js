import React from 'react'
import './News.css'

function News() {
    return (
        <div className='news-container'>
            <h className='news-title'>Official Notices</h>
            <div className='news-data'>
                <div className='news-empty'></div>
                <div>
                    <h1 className='news-subtitle'>Administrative Updates</h1>
                    <div>
                        <div className='news-competition-event'>
                            <p>Notice-1</p>
                            <p>Library records are managed through the secure administrative panel.</p>
                        </div>
                        <div className='news-competition-event'>
                            <p>Notice-2</p>
                            <p>Member and staff access remain separated for operational clarity.</p>
                        </div>
                        <div className='news-competition-event'>
                            <p>Notice-3</p>
                            <p>Book issue and return transactions are tracked in real time.</p>
                        </div>
                        <div className='news-competition-event'>
                            <p>Notice-4</p>
                            <p>All data is maintained for institutional reporting and audit readiness.</p>
                        </div>
                        <div className='news-competition-event'>
                            <p>Notice-5</p>
                            <p>System settings can be aligned with the hosting environment before deployment.</p>
                        </div>
                    </div>
                </div>
                <div className='news-empty'></div>
                <div>
                    <h1 className='news-subtitle'>Service Guidance</h1>
                    <div>
                        <div className='news-quiz-event'>
                            <p>Guide-1</p>
                            <p>Use the sign-in screen with approved credentials to access the dashboard.</p>
                        </div>
                        <div className='news-quiz-event'>
                            <p>Guide-2</p>
                            <p>Administrators can manage books, members, and transactions from one console.</p>
                        </div>
                        <div className='news-quiz-event'>
                            <p>Guide-3</p>
                            <p>Member access is limited to browsing and account-specific activity.</p>
                        </div>
                        <div className='news-quiz-event'>
                            <p>Guide-4</p>
                            <p>The interface is suitable for demonstration in official review sessions.</p>
                        </div>
                        <div className='news-quiz-event'>
                            <p>Guide-5</p>
                            <p>Hosting should use a production MongoDB connection and secure backend URL.</p>
                        </div>
                    </div>
                </div>
                <div className='news-empty'></div>
            </div>
        </div>
    )
}

export default News
