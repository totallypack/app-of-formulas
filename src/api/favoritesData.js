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

const addToFavorites = async (itemId, itemType, metadata = {}) => {
  try {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const token = await getAuthToken();
    if (!token) {
      throw new Error('Failed to get auth token');
    }

    const favoriteData = {
      favorited: true,
      timestamp: Date.now(),
      itemType, // 'hobby' or 'recipe'
      itemId,
      ...metadata,
    };

    const url = `${endpoint}/favorites/${userId}/${itemId}.json?auth=${token}`;

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(favoriteData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log(`Successfully added ${itemType} ${itemId} to favorites`);
    return favoriteData;
  } catch (error) {
    console.error('Error adding to favorites:', error);
    throw error;
  }
};

const removeFromFavorites = async (itemId) => {
  try {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const token = await getAuthToken();
    if (!token) {
      throw new Error('Failed to get auth token');
    }

    const url = `${endpoint}/favorites/${userId}/${itemId}.json?auth=${token}`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log(`Successfully removed item ${itemId} from favorites`);
    return true;
  } catch (error) {
    console.error('Error removing from favorites:', error);
    throw error;
  }
};

const getUserFavorites = async (userId = null) => {
  try {
    const auth = getAuth();
    const currentUserId = userId || auth.currentUser?.uid;
    if (!currentUserId) {
      throw new Error('User not authenticated');
    }

    const token = await getAuthToken();
    if (!token) {
      throw new Error('Failed to get auth token');
    }

    const url = `${endpoint}/favorites/${currentUserId}.json?auth=${token}`;

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
      const favoritesArray = Object.entries(data).map(([itemId, favoriteData]) => ({
        ...favoriteData,
        itemId,
      }));

      console.log(`Retrieved ${favoritesArray.length} favorites for user ${currentUserId}`);
      return favoritesArray;
    }

    return [];
  } catch (error) {
    console.error('Error fetching user favorites:', error);
    return [];
  }
};

const isItemFavorited = async (itemId) => {
  try {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;
    if (!userId) {
      return false;
    }

    const token = await getAuthToken();
    if (!token) {
      return false;
    }

    const url = `${endpoint}/favorites/${userId}/${itemId}.json?auth=${token}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data && data.favorited === true;
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return false;
  }
};

const getFavoritesByType = async (itemType) => {
  try {
    const allFavorites = await getUserFavorites();
    return allFavorites.filter((favorite) => favorite.itemType === itemType);
  } catch (error) {
    console.error(`Error fetching ${itemType} favorites:`, error);
    return [];
  }
};

const toggleFavorite = async (itemId, itemType, metadata = {}) => {
  try {
    const isFavorited = await isItemFavorited(itemId);

    if (isFavorited) {
      await removeFromFavorites(itemId);
      return false;
    }
    await addToFavorites(itemId, itemType, metadata);
    return true;
  } catch (error) {
    console.error('Error toggling favorite:', error);
    throw error;
  }
};

export { addToFavorites, removeFromFavorites, getUserFavorites, isItemFavorited, getFavoritesByType, toggleFavorite };
