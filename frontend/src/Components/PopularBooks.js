import React from "react";
import "./PopularBooks.css";
import MenuBookIcon from '@material-ui/icons/MenuBook';
import DescriptionIcon from '@material-ui/icons/Description';
import LocalLibraryIcon from '@material-ui/icons/LocalLibrary';
import AssignmentIcon from '@material-ui/icons/Assignment';

function PopularBooks() {
  return (
    <div className="popularbooks-container">
      <h className="popularbooks-title">Reference Collection</h>
      <div className="popularbooks popularbooks-grid">
        <div className='popular-card'><MenuBookIcon className='popular-icon' /><h3>Policies</h3><p>Rules and service guidelines for official use.</p></div>
        <div className='popular-card'><DescriptionIcon className='popular-icon' /><h3>Forms</h3><p>Applications and record templates for staff workflows.</p></div>
        <div className='popular-card'><LocalLibraryIcon className='popular-icon' /><h3>Collections</h3><p>Catalogued resources for members and administrators.</p></div>
        <div className='popular-card'><AssignmentIcon className='popular-icon' /><h3>Reports</h3><p>Operational summaries and circulation oversight.</p></div>
      </div>
      <div className="popularbooks popularbooks-grid">
        <div className='popular-card'><MenuBookIcon className='popular-icon' /><h3>Policies</h3><p>Rules and service guidelines for official use.</p></div>
        <div className='popular-card'><DescriptionIcon className='popular-icon' /><h3>Forms</h3><p>Applications and record templates for staff workflows.</p></div>
        <div className='popular-card'><LocalLibraryIcon className='popular-icon' /><h3>Collections</h3><p>Catalogued resources for members and administrators.</p></div>
        <div className='popular-card'><AssignmentIcon className='popular-icon' /><h3>Reports</h3><p>Operational summaries and circulation oversight.</p></div>
      </div>
    </div>
  );
}

export default PopularBooks;
