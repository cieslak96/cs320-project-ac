import React
 from "react";
import { Amplify} from 'aws-amplify'; // Use Amplify's Storage module
import amplifyconfig from './amplifyconfiguration.json';
import "./ProfilePage.css";

Amplify.configure(amplifyconfig); // Configure Amplify with your settings

const ProfilePage = ({ user, onProfileImageChange }) => {
 


  return (
 
      <h2>My Profile</h2>
      
  );
};

export default ProfilePage;
