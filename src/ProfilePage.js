import React, { useState, useEffect, useCallback } from 'react';
import { getUrl } from 'aws-amplify/storage'; // Use 'list' for listing files
import { Image, View} from '@aws-amplify/ui-react';
import { useNavigate } from 'react-router-dom';
import '@aws-amplify/ui-react/styles.css';
import './styles.css';

const ProfilePage = ({ user, onProfileImageChange }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate();

  const defaultImagePath = 'default-pictures/user.PNG'; // Default image in case of 404 error

  // Fetch profile image from S3 or use default if not available
  const fetchProfileImage = useCallback(async () => {
    try {
      const result = await getUrl({
        path: `profile-pictures/${user.username}`, // Use protected folder for user-specific files
        options: { validateObjectExistence: true, expiresIn: 900 }
      });
      setImageUrl(result.url); // Ensure you get the URL from the result object
      onProfileImageChange(result.url);
    } catch (error) {
      if (error.code === "NotFound") {
        console.log("Profile image not found, using default image.");
        // Fallback to default image
        const defaultResult = await getUrl({
          path: defaultImagePath,
          options: { validateObjectExistence: true, expiresIn: 900 }
        });
        setImageUrl(defaultResult.url);
        onProfileImageChange(defaultResult.url);
      } else {
        console.error("Error fetching profile image: ", error);
      }
    }
  }, [user.username, onProfileImageChange, defaultImagePath]);



  useEffect(() => {
    fetchProfileImage();
   
  }, [fetchProfileImage]); // Ensure this runs only once on mount

  const toggleOptions = () => {
    navigate('/manage-account');
  };

  return (
    <View>
      <div className='page-container'>
        <View margin="3rem 0" alignItems="center" justifyContent="center">
          {imageUrl ? (
            <>
              <Image
                src={imageUrl}
                alt="Profile Picture"
                style={{ width: 150, height: 150, borderRadius: '50%', cursor: 'pointer', transition: 'transform 0.3s' }}
                onClick={toggleOptions}
                onMouseEnter={(e) => (e.target.style.transform = 'scale(1.1)')}
                onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
              />
              <h2 style={{ marginTop: '1rem' }}>{user.username}</h2>
            </>
          ) : (
            <p>No profile picture uploaded</p>
          )}
        </View>

      
      </div>
    </View>
  );
};

export default ProfilePage;
