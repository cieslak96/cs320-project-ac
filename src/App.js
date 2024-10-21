import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import HomePage from "./HomePage";
import ProfilePage from "./ProfilePage";
import ReelPage from "./ReelPage";
import { Authenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import awsExports from "./aws-exports";
import '@aws-amplify/ui-react/styles.css';
import { getUrl } from 'aws-amplify/storage';

// Ensure AWS Amplify is configured
Amplify.configure(awsExports);

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [user, setUser] = useState(null); // Track user state separately

  // Fetch profile image when the user logs in
  const fetchProfileImage = async (username) => {
    try {
      const linkToStorageFile = await getUrl({
        path: `profile-pictures/${username}`,
        options: { validateObjectExistence: true, expiresIn: 900 }
      });
      setProfileImageUrl(linkToStorageFile.url);
      localStorage.setItem('profileImageUrl', linkToStorageFile.url);
    } catch (error) {
      console.log("No profile picture found for the user, setting default image.");
      const defaultLinkToStorageFile = await getUrl({
        path: 'default-pictures/user.PNG', // Set the path to your default image here
        options: { validateObjectExistence: true, expiresIn: 900 }
      });
      setProfileImageUrl(defaultLinkToStorageFile.url);
      localStorage.setItem('profileImageUrl', defaultLinkToStorageFile.url);
    }
  };

  // Set user and authenticated state when the user logs in
  useEffect(() => {
    if (user && !isAuthenticated) {
      setIsAuthenticated(true);
      fetchProfileImage(user.username); // Fetch profile image after login
    }
  }, [user, isAuthenticated]);

  const handleProfileImageChange = (imageUrl) => {
    setProfileImageUrl(imageUrl);
    localStorage.setItem('profileImageUrl', imageUrl); // Save image URL to localStorage
  };

  const handleSignOut = (signOut) => {
    signOut();
    setIsAuthenticated(false);
    localStorage.removeItem('profileImageUrl'); // Clear image URL from localStorage on sign-out
    window.location.reload();
  };

  return (
    <div>
      <Authenticator
        formFields={{
          signUp: {
            name: {
              placeholder: "Name",
              label: "Name",
              required: true,
              order: 1,
            },
            username: {
              placeholder: "Username",
              label: "Username",
              required: true,
              order: 2,
            },
            email: {
              placeholder: "Email",
              label: "Email",
              required: true,
              order: 3,
            },
            phone_number: {
              placeholder: "Phone Number (optional)",
              label: "Phone Number",
              required: false,
            },
          },
        }}
      >
        {({ signOut, user: currentUser }) => {
          // Set the user state when the user logs in
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
                    profileImageUrl={profileImageUrl}
                  />
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route
                      path="/profile"
                      element={
                        <ProfilePage
                          user={currentUser}
                          onProfileImageChange={handleProfileImageChange}
                        />
                      }
                    />
                    <Route path="/reel" element={<ReelPage />} />
                  </Routes>
                  <button onClick={() => handleSignOut(signOut)}>Sign Out</button>
                </>
              ) : (
                <>
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
