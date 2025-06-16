import { clientCredentials } from '@/utils/client';
import { getAuth } from 'firebase/auth';
import { toggleFavorite as toggleFavoriteStatus, isItemFavorited } from './favoritesData';

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

const getEveryHobby = async () => {
  try {
    console.log('Fetching hobbies with REST API + Auth...');

    const token = await getAuthToken();
    if (!token) {
      throw new Error('User not authenticated - cannot fetch hobbies');
    }

    const url = `${endpoint}/hobby.json?auth=${token}`;
    console.log('Calling URL with auth token...');

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Raw data received:', data ? 'Data found' : 'No data');

    if (data) {
      const hobbiesArray = Object.entries(data).map(([firebaseKey, hobbyObj]) => ({
        ...hobbyObj,
        id: firebaseKey,
      }));
      console.log('Processed hobbies count:', hobbiesArray.length);
      return hobbiesArray;
    }
    return [];
  } catch (error) {
    console.error('Error fetching hobbies:', error);
    throw error;
  }
};

const getHobby = async (uid) => {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('User not authenticated');
    }

    const url = `${endpoint}/hobby.json?orderBy="uid"&equalTo="${uid}"&auth=${token}`;

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
      const hobbiesArray = Object.entries(data).map(([firebaseKey, hobbyObj]) => ({
        ...hobbyObj,
        id: firebaseKey,
      }));
      return hobbiesArray;
    }
    return [];
  } catch (error) {
    console.error('Error fetching user hobbies:', error);
    throw error;
  }
};

const getSingleHobby = async (id) => {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('User not authenticated');
    }

    const url = `${endpoint}/hobby/${id}.json?auth=${token}`;

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
      const isFavorited = await isItemFavorited(id);

      return {
        ...data,
        id,
        isFavorited,
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching single hobby:', error);
    throw error;
  }
};

const toggleHobbyFavorite = async (hobbyId, metadata = {}) => {
  try {
    console.log('Toggling hobby favorite with new system...');

    const hobby = await getSingleHobby(hobbyId);
    if (!hobby) {
      throw new Error('Hobby not found');
    }

    const favoriteMetadata = {
      category: hobby.category,
      title: hobby.title,
      ...metadata,
    };

    const newFavoriteStatus = await toggleFavoriteStatus(hobbyId, 'hobby', favoriteMetadata);

    console.log(`Successfully toggled favorite for hobby: ${hobbyId} - Now favorited: ${newFavoriteStatus}`);

    return {
      ...hobby,
      isFavorited: newFavoriteStatus,
    };
  } catch (error) {
    console.error(`Error toggling favorite for hobby ${hobbyId}:`, error);
    throw error;
  }
};

const getHobbiesWithFavoriteStatus = async (uid = null) => {
  try {
    const hobbies = uid ? await getHobby(uid) : await getEveryHobby();

    const hobbiesWithFavorites = await Promise.all(
      hobbies.map(async (hobby) => {
        const isFavorited = await isItemFavorited(hobby.id);
        return {
          ...hobby,
          isFavorited,
        };
      }),
    );

    return hobbiesWithFavorites;
  } catch (error) {
    console.error('Error fetching hobbies with favorite status:', error);
    return [];
  }
};

export { getHobby, getSingleHobby, getEveryHobby, toggleHobbyFavorite, getHobbiesWithFavoriteStatus };
