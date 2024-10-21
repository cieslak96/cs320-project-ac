import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './Navbar.css';

const Navbar = ({ isAuthenticated, signOut, profileImageUrl }) => {
  const [profileImage, setProfileImage] = useState(
    profileImageUrl || "https://via.placeholder.com/40"
  );

  // Update profile image when the user logs in or profile image changes
  useEffect(() => {
    if (isAuthenticated && profileImageUrl) {
      setProfileImage(profileImageUrl);
    } else {
      setProfileImage("https://via.placeholder.com/40"); // Placeholder image if no profile image
    }
  }, [isAuthenticated, profileImageUrl]);

  return (
    <nav className="navbar">
      <div className="nav-logo">
        <Link to="/" className="nav-link">
          My Mural App
        </Link>
      </div>
      <ul className="nav-list">
        <li className="nav-item">
          <Link to="/" className="nav-link">Home</Link>
        </li>
        {isAuthenticated && (
          <>
            <li className="nav-item">
              <Link to="/reel" className="nav-link">Reel</Link>
            </li>
            <li className="nav-item">
              <Link to="/profile" className="nav-link profile-link">
                <img src={profileImage} alt="Profile" className="profile-picture"/>
              </Link>
            </li>
            <li className="nav-item">
              <button className="nav-link logout-button" onClick={signOut}>
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;

