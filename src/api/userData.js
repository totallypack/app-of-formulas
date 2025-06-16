import { clientCredentials } from '@/utils/client';
import { getAuth } from 'firebase/auth';

const endpoint = clientCredentials.databaseURL;

const getAuthToken = async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    console.log('Got auth token for user:', user.uid);
    return token;
  }
  console.log('No authenticated user found');
  return null;
};

const UpdateUserData = async (userObj) => {
  try {
    console.log('Updating user data with REST API + Auth...');

    const token = await getAuthToken();
    if (!token) {
      throw new Error('User not authenticated');
    }

    const url = `${endpoint}/user/${userObj.uid}.json?auth=${token}`;

    const userData = {
      uid: userObj.uid,
      name: userObj.displayName || '',
      email: userObj.email || '',
      photoURL: userObj.photoURL || '',
      lastLogin: new Date().toISOString(),
    };

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    await response.json();
    console.log('Successfully updated user data:', userObj.uid);
    return true;
  } catch (error) {
    console.error('Error updating user data:', error);
    return false;
  }
};

const getUserData = async (uid) => {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('User not authenticated');
    }

    const url = `${endpoint}/user/${uid}.json?auth=${token}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data) {
      return {
        ...data,
        id: uid,
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};

const getAllUsers = async () => {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('User not authenticated');
    }

    const url = `${endpoint}/user.json?auth=${token}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data) {
      const usersArray = Object.entries(data).map(([uid, userObj]) => ({
        ...userObj,
        id: uid,
      }));
      return usersArray;
    }
    return [];
  } catch (error) {
    console.error('Error fetching all users:', error);
    return [];
  }
};

export { UpdateUserData, getUserData, getAllUsers };
