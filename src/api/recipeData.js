import { clientCredentials } from '@/utils/client';

const endpoint = clientCredentials.databaseURL;

const getRecipe = (uid) =>
  new Promise((resolve) => {
    fetch(`${endpoint}/formula.json`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data) {
          return resolve([]);
        }

        const allRecipes = Object.entries(data).map(([key, value]) => ({
          ...value,
          firebaseKey: key,
        }));

        const userRecipes = allRecipes.filter((recipe) => recipe.uid === uid || recipe.userId === uid);

        console.log(`Retrieved ${userRecipes.length} user recipes with keys`);
        return resolve(userRecipes);
      })
      .catch((error) => {
        console.error('Error in getRecipe:', error);
        return resolve([]);
      });
  });

const getEveryRecipe = () =>
  new Promise((resolve) => {
    fetch(`${endpoint}/formula.json`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data) {
          return resolve([]);
        }

        const recipes = Object.entries(data).map(([key, value]) => ({
          ...value,
          firebaseKey: key,
        }));

        console.log(`Retrieved ${recipes.length} recipes with keys`);
        return resolve(recipes);
      })
      .catch((error) => {
        console.error('Error in getEveryRecipe:', error);
        return resolve([]);
      });
  });

const getSingleRecipe = (firebaseKey) =>
  new Promise((resolve) => {
    fetch(`${endpoint}/formula/${firebaseKey}.json`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          return resolve({ ...data, firebaseKey });
        }
        return resolve(null);
      })
      .catch((error) => {
        console.error(`Error fetching recipe ${firebaseKey}:`, error);
        return resolve(null);
      });
  });

const deleteRecipe = (firebaseKey) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/formula/${firebaseKey}.json`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(`Successfully deleted recipe with key: ${firebaseKey}`);
        return resolve(data);
      })
      .catch((error) => {
        console.error(`Error deleting recipe ${firebaseKey}:`, error);
        return reject(error);
      });
  });

const updateRecipe = (payload) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/formula/${payload.firebaseKey}.json`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(`Successfully updated recipe: ${payload.firebaseKey}`);
        return resolve(data);
      })
      .catch((error) => {
        console.error(`Error updating recipe ${payload.firebaseKey}:`, error);
        return reject(error);
      });
  });

const createRecipe = (payload) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/formula.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Server returned ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data && data.name) {
          const firebaseKey = data.name;
          const recipeWithKey = { ...payload, firebaseKey };

          return updateRecipe(recipeWithKey).then(() => resolve(recipeWithKey));
        }
        throw new Error('Failed to get Firebase key');
      })
      .catch((error) => {
        console.error('Error creating recipe:', error);
        return reject(error);
      });
  });

export const testFirebaseConnection = async () => {
  console.log('Testing Firebase connection...');
  try {
    const response = await fetch(`${endpoint}/.json?shallow=true`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('Firebase connection response:', response.status);
    const data = await response.json();
    console.log('Firebase root data:', data);
    return data;
  } catch (error) {
    console.error('Firebase connection test error:', error);
    return null;
  }
};

export { getRecipe, createRecipe, deleteRecipe, getSingleRecipe, updateRecipe, getEveryRecipe };
