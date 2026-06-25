import React from 'react'
import './PhotoGallery.css'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import LocalLibraryIcon from '@material-ui/icons/LocalLibrary';
import HistoryIcon from '@material-ui/icons/History';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import EventNoteIcon from '@material-ui/icons/EventNote';
import SecurityIcon from '@material-ui/icons/Security';

function PhotoGallery() {
    return (
        <div className='photogallery-container'>
            <h1 className='photogallery-title'>Operational Overview</h1>
            <div className="photogallery-images photogallery-cards">
                <div className='gallery-card'><MenuBookIcon className='gallery-icon' /><p>Book catalog management</p></div>
                <div className='gallery-card'><LocalLibraryIcon className='gallery-icon' /><p>Member registry and access</p></div>
                <div className='gallery-card'><HistoryIcon className='gallery-icon' /><p>Issue and return history</p></div>
                <div className='gallery-card'><AssignmentTurnedInIcon className='gallery-icon' /><p>Verified transaction flow</p></div>
                <div className='gallery-card'><EventNoteIcon className='gallery-icon' /><p>Reservation scheduling</p></div>
                <div className='gallery-card'><SecurityIcon className='gallery-icon' /><p>Role-based security controls</p></div>
            </div>
            <button>VIEW MORE<ArrowForwardIosIcon style={{fontSize:20}}/></button>
        </div>
    )
}

export default PhotoGallery