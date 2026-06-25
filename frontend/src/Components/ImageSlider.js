import React from 'react'
import './ImageSlider.css'
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import SecurityIcon from '@material-ui/icons/Security';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';

function ImageSlider() {
    return (
        <div className='slider'>
            <div className='hero-banner'>
                <div className='hero-copy'>
                    <p className='hero-kicker'>Official Portal</p>
                    <h1>Digital Library Administration</h1>
                    <p className='hero-description'>A controlled workspace for records, circulation, member access, and reporting.</p>
                </div>
                <div className='hero-features'>
                    <div className='hero-card'>
                        <AssignmentIndIcon className='hero-icon' />
                        <h3>Member Records</h3>
                        <p>Structured profiles and account management.</p>
                    </div>
                    <div className='hero-card'>
                        <SecurityIcon className='hero-icon' />
                        <h3>Secure Access</h3>
                        <p>Role-based staff and member workflows.</p>
                    </div>
                    <div className='hero-card'>
                        <VerifiedUserIcon className='hero-icon' />
                        <h3>Audit Ready</h3>
                        <p>Clear status tracking for official review.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ImageSlider
