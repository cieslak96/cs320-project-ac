import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import HomePage from "./HomePage";
import ProfilePage from "./ProfilePage";
import ReelPage from "./ReelPage";
import { Authenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import awsExports from "./aws-exports";
import Introduction from "./Introduction";
import '@aws-amplify/ui-react/styles.css';

// Ensure AWS Amplify is configured
Amplify.configure(awsExports);

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(null);

  const handleProfileImageChange = (imageUrl) => {
    setProfileImageUrl(imageUrl); // Update the profile image URL
  };

  return (
    <div>
      {!isAuthenticated && <Introduction />}
      <Authenticator
        formFields={{
          signUp: {
          
          
            name: {
              placeholder: "Name",
              label: "Name", // Email is required
              required: true,
              order:1
            },
            username: {
              placeholder: "Username",
              label: "Username", // Email is required
              required: true,
              order:2
            },
            email: {
              placeholder: "Email",
              label: "Email", // Email is required
              required: true,
              order:3
            },
            phone_number: {
              placeholder: "Phone Number (optional)",
              label: "Phone Number", // Optional phone number
              required: false,
            },
          },
        }}
      >
        {({ signOut, user }) => {
          if (user && !isAuthenticated) {
            setIsAuthenticated(true);
          }

          const handleSignOut = () => {
            signOut();
            setIsAuthenticated(false);
            window.location.reload();
          };

          return (
            <>
              {user ? (
                <>
                  <Navbar
                    isAuthenticated={!!user}
                    signOut={handleSignOut}
                    profileImageUrl={profileImageUrl}
                  />
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route
                      path="/profile"
                      element={<ProfilePage user={user} onProfileImageChange={handleProfileImageChange} />}
                    />
                    <Route path="/reel" element={<ReelPage />} />
                  </Routes>
                  <button onClick={handleSignOut}>Sign Out</button>
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
