import React from "react";
import "./Allbooks.css";

function Allbooks() {
  return (
    <div className="books-page">
      <div className="books">
        <div className="book-card">
          <img
            src="https://covers.openlibrary.org/b/id/9153819-L.jpg"
            alt="Wings Of Fire cover"
          />
          <p className="bookcard-title">Wings Of Fire</p>
          <p className="bookcard-author">By A. P. J. Abdul Kalam</p>
          <div className="bookcard-category">
            <p>Auto Biography</p>
          </div>
          <div className="bookcard-emptybox"></div>
        </div>
        <div className="book-card">
          <img
            src="https://covers.openlibrary.org/b/id/6553019-L.jpg"
            alt="The Power Of Your Subconscious Mind cover"
          />
          <p className="bookcard-title">The Power Of Your Subconscious Mind</p>
          <p className="bookcard-author">By Joseph</p>
          <div className="bookcard-category">
            <p>Psychology</p>
          </div>
          <div className="bookcard-emptybox"></div>
        </div>
        <div className="book-card">
          <img
            src="https://covers.openlibrary.org/b/id/8463846-L.jpg"
            alt="Elon Musk cover"
          />
          <p className="bookcard-title">Elon Musk</p>
          <p className="bookcard-author">By Elon</p>
          <div className="bookcard-category">
            <p>Auto Biography</p>
          </div>
          <div className="bookcard-emptybox"></div>
        </div>
        <div className="book-card">
          <img
            src="https://covers.openlibrary.org/b/id/8231990-L.jpg"
            alt="The Subtle Art Of Not Giving A Fuck cover"
          />
          <p className="bookcard-title">The Subtle Art Of Not Giving A Fuck</p>
          <p className="bookcard-author">By Mark Manson</p>
          <div className="bookcard-category">
            <p>COMIC</p>
          </div>
          <div className="bookcard-emptybox"></div>
        </div>
      </div>
    </div>
  );
}

export default Allbooks;
