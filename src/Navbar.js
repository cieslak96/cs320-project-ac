import React, { useEffect, useState } from "react";
import './Navbar.css';
import { getUrl } from 'aws-amplify/storage';

const Navbar = ({ isAuthenticated, signOut, profileImageUrl }) => {
  const [profileImage, setProfileImage] = useState(profileImageUrl || "https://via.placeholder.com/40");
  const [logoUrl, setLogoUrl] = useState("/logo/murallogo.png");
  const logoS3Path = "logo/murallogo.png";

  const fetchLogoFromS3 = async () => {
    try {
      const linkToStorageFile = await getUrl({
        path: logoS3Path,
        options: { validateObjectExistence: true, expiresIn: 900 }
      });
      setLogoUrl(linkToStorageFile.url);
    } catch (error) {
      console.log("No existing logo found in S3, using default.");
      setLogoUrl("/logo/murallogo.png");
    }
  };

  useEffect(() => {
    if (isAuthenticated && profileImageUrl) {
      setProfileImage(profileImageUrl); // Update profile image from props
    } else {
      setProfileImage("https://via.placeholder.com/40"); // Fallback if not authenticated
    }
  }, [isAuthenticated, profileImageUrl]);

  useEffect(() => {
    fetchLogoFromS3();
  }, []);

  return (
    <nav className="navbar">
      <div className="nav-logo">
        <button onClick={() => window.location.href = "/reel"} className="nav-link logo-button">
          <img src={logoUrl} alt="Logo" className="navbar-logo" />
          <span className="navbar-text">URAL</span>
        </button>
      </div>
      <ul className="nav-list">
        {isAuthenticated && (
          <>
            <li className="nav-item">
              <button onClick={() => window.location.href = "/profile"} className="nav-link profile-button">
                <img src={profileImage} alt="Profile" className="profile-picture" />
              </button>
            </li>
            <li className="nav-item">
              <button onClick={() => window.location.href = "/"} className="nav-link upload-button">
              <svg fill="#ffffff" height="25px" width="25px" viewBox="0 0 477.075 477.075" stroke="#ffffff">
                  <g id="SVGRepo_iconCarrier">
                    <g>
                      <path d="M358.387,159.975h-38.9c-7.5,0-13.5,6-13.5,13.5s6,13.5,13.5,13.5h38.9c19.1,0,34.7,15.6,34.7,34.7v193.8 c0,19.1-15.6,34.7-34.7,34.7h-239.8c-19.1,0-34.7-15.6-34.7-34.7v-193.9c0-19.1,15.6-34.7,34.7-34.7h38.9c7.5,0,13.5-6,13.5-13.5 s-6-13.5-13.5-13.5h-38.9c-34,0-61.7,27.7-61.7,61.7v193.8c0,34,27.7,61.7,61.7,61.7h239.9c34,0,61.7-27.7,61.7-61.7v-193.8 C420.087,187.575,392.387,159.975,358.387,159.975z"></path>
                      <path d="M166.987,104.175l58-58v218c0,7.5,6,13.5,13.5,13.5s13.5-6,13.5-13.5v-218l58,58c2.6,2.6,6.1,4,9.5,4s6.9-1.3,9.5-4 c5.3-5.3,5.3-13.8,0-19.1l-81.1-81.1c-5.3-5.3-13.8-5.3-19.1,0l-81.1,81.1c-5.3,5.3-5.3,13.8,0,19.1 C153.187,109.475,161.687,109.475,166.987,104.175z"></path>
                    </g>
                  </g>
                </svg>
              </button>
            </li>
            <li className="nav-item">
              <div className="logout-container">
                <button className="nav-link logout-button" onClick={signOut}>
                  Logout<span className="logout-space"></span>
                  <svg fill="#ffffff" height="20px" width="20px" viewBox="0 0 481.5 481.5" stroke="#ffffff">
                    <g id="SVGRepo_iconCarrier">
                      <g>
                        <path d="M0,240.7c0,7.5,6,13.5,13.5,13.5h326.1l-69.9,69.9c-5.3,5.3-5.3,13.8,0,19.1c2.6,2.6,6.1,4,9.5,4s6.9-1.3,9.5-4l93-93c5.3-5.3,5.3-13.8,0-19.1l-93-93c-5.3-5.3-13.8-5.3-19.1,0c-5.3,5.3-5.3,13.8,0,19.1l69.9,69.9h-326C6,227.2,0,233.2,0,240.7z"></path>
                        <path d="M382.4,0H99C44.4,0,0,44.4,0,99v58.2c0,7.5,6,13.5,13.5,13.5s13.5-6,13.5-13.5V99c0-39.7,32.3-72,72-72h283.5c39.7,0,72,32.3,72,72v283.5c0,39.7-32.3,72-72,72H99c-39.7,0-72-32.3-72-72V325c0-7.5-6-13.5-13.5-13.5S0,317.5,0,325v57.5c0,54.6,44.4,99,99,99h283.5c54.6,0,99-44.4,99-99V99C481.4,44.4,437,0,382.4,0z"></path>
                      </g>
                    </g>
                  </svg>
                </button>
              </div>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
