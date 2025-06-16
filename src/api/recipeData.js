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

const getRecipe = async (uid) => {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('User not authenticated');
    }

    const url = `${endpoint}/formula.json?auth=${token}`;

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

    if (!data) {
      return [];
    }

    const allRecipes = Object.entries(data).map(([key, value]) => ({
      ...value,
      id: key,
    }));

    const userRecipes = allRecipes.filter((recipe) => recipe.uid === uid || recipe.userId === uid);

    console.log(`Retrieved ${userRecipes.length} user recipes with keys`);
    return userRecipes;
  } catch (error) {
    console.error('Error in getRecipe:', error);
    return [];
  }
};

const getEveryRecipe = async () => {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('User not authenticated');
    }

    const url = `${endpoint}/formula.json?auth=${token}`;

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

    if (!data) {
      return [];
    }

    const recipes = Object.entries(data).map(([key, value]) => ({
      ...value,
      id: key,
    }));

    console.log(`Retrieved ${recipes.length} recipes with keys`);
    return recipes;
  } catch (error) {
    console.error('Error in getEveryRecipe:', error);
    return [];
  }
};

const getSingleRecipe = async (id) => {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('User not authenticated');
    }

    const url = `${endpoint}/formula/${id}.json?auth=${token}`;

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
    console.error(`Error fetching recipe ${id}:`, error);
    return null;
  }
};

const getRecipesByCategory = async (category) => {
  try {
    console.log('Fetching ALL recipes for category:', category, '(from all users)');

    const token = await getAuthToken();
    if (!token) {
      throw new Error('User not authenticated');
    }

    const url = `${endpoint}/formula.json?auth=${token}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Firebase Response status:', response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (!data) {
      console.log('No recipes found in database');
      return [];
    }
    const allRecipes = Object.entries(data).map(([key, value]) => ({
      ...value,
      id: key,
    }));

    console.log('All recipes loaded:', allRecipes.length, 'total recipes from all users');

    const filteredRecipes = allRecipes.filter((recipe) => recipe.category && recipe.category.toLowerCase() === category.toLowerCase());

    console.log('Filtered recipes:', filteredRecipes.length, 'recipes match category', category, 'from all users');

    const sortedRecipes = filteredRecipes.sort((a, b) => {
      const titleA = (a.title || '').toLowerCase();
      const titleB = (b.title || '').toLowerCase();
      return titleA.localeCompare(titleB);
    });

    console.log('Sorted recipes by date/title for better discovery');
    return sortedRecipes;
  } catch (error) {
    console.error('Error in getRecipesByCategory:', error);
    throw error;
  }
};

const deleteRecipe = async (id) => {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('User not authenticated');
    }

    const url = `${endpoint}/formula/${id}.json?auth=${token}`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`Successfully deleted recipe with key: ${id}`);
    return data;
  } catch (error) {
    console.error(`Error deleting recipe ${id}:`, error);
    throw error;
  }
};

const updateRecipe = async (payload) => {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('User not authenticated');
    }

    const url = `${endpoint}/formula/${payload.id}.json?auth=${token}`;

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`Successfully updated recipe: ${payload.id}`);
    return data;
  } catch (error) {
    console.error(`Error updating recipe ${payload.id}:`, error);
    throw error;
  }
};

const toggleRecipeFavorite = async (recipeId, metadata = {}) => {
  try {
    console.log('Toggling recipe favorite with new system...');

    const recipe = await getSingleRecipe(recipeId);
    if (!recipe) {
      throw new Error('Recipe not found');
    }

    const favoriteMetadata = {
      category: recipe.category,
      title: recipe.title,
      ...metadata,
    };

    const newFavoriteStatus = await toggleFavoriteStatus(recipeId, 'recipe', favoriteMetadata);

    console.log(`Successfully toggled favorite for recipe: ${recipeId} - Now favorited: ${newFavoriteStatus}`);

    return {
      updatedRecipe: {
        ...recipe,
        isFavorited: newFavoriteStatus,
      },
      data: recipe,
    };
  } catch (error) {
    console.error(`Error toggling favorite for recipe ${recipeId}:`, error);
    throw error;
  }
};

const getRecipesWithFavoriteStatus = async (uid = null) => {
  try {
    const recipes = uid ? await getRecipe(uid) : await getEveryRecipe();

    const recipesWithFavorites = await Promise.all(
      recipes.map(async (recipe) => {
        const isFavorited = await isItemFavorited(recipe.id);
        return {
          ...recipe,
          isFavorited,
        };
      }),
    );

    return recipesWithFavorites;
  } catch (error) {
    console.error('Error fetching recipes with favorite status:', error);
    return [];
  }
};

const createRecipe = async (payload) => {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('User not authenticated');
    }

    const url = `${endpoint}/formula.json?auth=${token}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (data && data.name) {
      const id = data.name;
      const recipeWithKey = { ...payload, id };

      await updateRecipe(recipeWithKey);
      return recipeWithKey;
    }
    throw new Error('Failed to get Firebase key');
  } catch (error) {
    console.error('Error creating recipe:', error);
    throw error;
  }
};

export { getRecipe, createRecipe, deleteRecipe, getSingleRecipe, updateRecipe, getEveryRecipe, toggleRecipeFavorite, getRecipesByCategory, getRecipesWithFavoriteStatus };
