import React, { useState, useEffect, useCallback } from 'react';
import { getUrl, uploadData, remove } from 'aws-amplify/storage';
import { Button, Flex, Heading, Image, TextField, View } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import "./styles.css";

const ProfilePage = ({ user, onProfileImageChange }) => {
  const [profilePic, setProfilePic] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Default image path in the S3 bucket for users without a profile picture
  const defaultImagePath = 'default-pictures/user.PNG'; // Path within the S3 bucket

  // Fetch existing profile picture on mount
  const fetchProfileImage = useCallback(async () => {
    try {
      const linkToStorageFile = await getUrl({
        path: `profile-pictures/${user.username}`,
        options: { validateObjectExistence: true, expiresIn: 900 }
      });
      setImageUrl(linkToStorageFile.url); // Update with the signed URL
      onProfileImageChange(linkToStorageFile.url);
      
    } catch (error) {
      console.log("No existing profile picture found, using default.");
      // Fetch the default image from S3 using the path
      const defaultLinkToStorageFile = await getUrl({
        path: defaultImagePath,
        options: { validateObjectExistence: true, expiresIn: 900 }
      });
      setImageUrl(defaultLinkToStorageFile.url); // Use the signed URL for the default image
      onProfileImageChange(defaultLinkToStorageFile.url);
    }
  }, [user.username, onProfileImageChange, defaultImagePath]);

  useEffect(() => {
    fetchProfileImage();
  }, [fetchProfileImage]);

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePic(file);  // Store the selected file
      setErrorMessage('');  // Clear any error messages
      
    }
  };

  // Upload the selected profile picture to S3
  const uploadProfilePic = async (event) => {
    event.preventDefault();
    if (!profilePic) {
      setErrorMessage('Please select a valid image file.');
      return;
    }

    setUploading(true);
    
    try {
      // Upload the file to S3
      await uploadData({
        path: `profile-pictures/${user.username}`,
        data: profilePic,
        options: { contentType: profilePic.type }
      });

      // Fetch the new URL of the uploaded image
      const linkToStorageFile = await getUrl({
        path: `profile-pictures/${user.username}`,
        options: { validateObjectExistence: true, expiresIn: 900 }
      });

      setImageUrl(linkToStorageFile.url); 
      // Update the displayed image
      onProfileImageChange(linkToStorageFile.url);  
      // Notify parent of profile picture change
      setProfilePic(null);
      setUploading(false);

      window.location.reload(); // Option 1: Automatically refresh the page
     

    } catch (error) {
      console.error('Upload error:', error);
      setErrorMessage(`Failed to upload the profile picture: ${error.message}`);
      setUploading(false);
      window.location.reload(); 
    }
  };

  // Delete the profile picture from S3 and reset to default
  const deleteProfilePic = async () => {
    try {
      await remove({
        path: `profile-pictures/${user.username}`
      });
      const defaultLinkToStorageFile = await getUrl({
        path: defaultImagePath,
        options: { validateObjectExistence: true, expiresIn: 900 }
      });
      setImageUrl(defaultLinkToStorageFile.url);  // Reset to default image
      onProfileImageChange(defaultLinkToStorageFile.url);  // Notify parent of profile picture removal

      // Option 1: Automatically refresh the page
      window.location.reload();

    } catch (error) {
      console.error('Error deleting profile picture:', error);
    }
  };

  return (
    <View>
      <Heading level={1}>Profile Page</Heading>
      <View as="form" margin="3rem 0" onSubmit={uploadProfilePic}>
        <Flex direction="row" justifyContent="center">
          <TextField
            name="profilePic"
            as="input"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            labelHidden
            style={{ alignSelf: 'end' }}
          />
          <Button type="submit" variation="primary" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload Profile Picture'}
          </Button>
        </Flex>
      </View>

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      <Heading level={2}>Current Profile Picture</Heading>
      {imageUrl ? (
        <View margin="3rem 0">
          <Image src={imageUrl} alt="Profile Picture" style={{ width: 150, height: 150, borderRadius: '50%' }} />
          <Button variation="link" onClick={deleteProfilePic}>Delete Profile Picture</Button>
        </View>
      ) : (
        <p>No profile picture uploaded</p>
      )}
    </View>
  );
};

export default ProfilePage;
