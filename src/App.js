import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import HomePage from "./HomePage";
import ProfilePage from "./ProfilePage";
import ReelPage from "./ReelPage";
import Introduction from "./Introduction";
import { Authenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import awsExports from "./aws-exports";
import '@aws-amplify/ui-react/styles.css';
import { getUrl } from 'aws-amplify/storage';
import "./styles.css";

Amplify.configure(awsExports);

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(localStorage.getItem('profileImageUrl') || null); // Load from localStorage
  const [user, setUser] = useState(null);

  const fetchProfileImage = async (username) => {
    try {
      const linkToStorageFile = await getUrl({
        path: `profile-pictures/${username}`,
        options: { validateObjectExistence: true, expiresIn: 900 }
      });
      setProfileImageUrl(linkToStorageFile.url);
      localStorage.setItem('profileImageUrl', linkToStorageFile.url); // Persist in localStorage
    } catch (error) {
      console.log("No profile picture found for the user, setting default image.");
      const defaultLinkToStorageFile = await getUrl({
        path: 'default-pictures/user.PNG', // Default image
        options: { validateObjectExistence: true, expiresIn: 900 }
      });
      setProfileImageUrl(defaultLinkToStorageFile.url);
      localStorage.setItem('profileImageUrl', defaultLinkToStorageFile.url);
    }
  };

  useEffect(() => {
    if (user && !isAuthenticated) {
      setIsAuthenticated(true);
      fetchProfileImage(user.username); // Fetch profile image globally after login
    }
  }, [user, isAuthenticated]);

  const handleProfileImageChange = (imageUrl) => {
    setProfileImageUrl(imageUrl);
    localStorage.setItem('profileImageUrl', imageUrl); // Save new image URL to localStorage
  };

  const handleSignOut = (signOut) => {
    signOut();
    setIsAuthenticated(false);
    localStorage.removeItem('profileImageUrl'); // Clear profile image on sign-out
    window.location.reload();
  };

  return (
    <div>
      {!isAuthenticated && <Introduction />} {/* Show Introduction only when not authenticated */}
      <Authenticator
        formFields={{
          signUp: {
            name: {
              placeholder: "Name",
              label: "Name", // Name field for sign-up
              required: true,
              order: 1
            },
            username: {
              placeholder: "Username",
              label: "Username", // Username field
              required: true,
              order: 2
            },
            email: {
              placeholder: "Email",
              label: "Email", // Email field
              required: true,
              order: 3
            },
            phone_number: {
              placeholder: "Phone Number (optional)",
              label: "Phone Number", // Optional phone number field
              required: false
            },
          },
        }}
      >
        {({ signOut, user: currentUser }) => {
          if (currentUser && !user) {
            setUser(currentUser);
          }

          return (
            <>
              {currentUser ? (
                <>
                  <Navbar
                    isAuthenticated={!!currentUser}
                    signOut={() => handleSignOut(signOut)}
                    profileImageUrl={profileImageUrl} // Pass profile image URL to Navbar
                  />
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route
                      path="/profile"
                      element={
                        <ProfilePage
                          user={currentUser}
                          onProfileImageChange={handleProfileImageChange} // Handle profile image change
                        />
                      }
                    />
                    <Route path="/reel" element={<ReelPage />} />
                  </Routes>
                </>
              ) : (
                <>
                  {!isAuthenticated && <Introduction />}
                  <div className="auth-container">
                    <Authenticator />
                  </div>
                </>
              )}
            </>
          );
        }}
      </Authenticator>
    </div>
  );
};

export default App;
