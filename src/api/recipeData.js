// https://firebase.google.com/docs/database/web/read-and-write

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
          id: key,
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
          id: key,
        }));

        console.log(`Retrieved ${recipes.length} recipes with keys`);
        return resolve(recipes);
      })
      .catch((error) => {
        console.error('Error in getEveryRecipe:', error);
        return resolve([]);
      });
  });

const getSingleRecipe = (id) =>
  new Promise((resolve) => {
    fetch(`${endpoint}/formula/${id}.json`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          return resolve({ ...data, id });
        }
        return resolve(null);
      })
      .catch((error) => {
        console.error(`Error fetching recipe ${id}:`, error);
        return resolve(null);
      });
  });

const deleteRecipe = (id) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/formula/${id}.json`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(`Successfully deleted recipe with key: ${id}`);
        return resolve(data);
      })
      .catch((error) => {
        console.error(`Error deleting recipe ${id}:`, error);
        return reject(error);
      });
  });

const updateRecipe = (payload) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/formula/${payload.id}.json`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(`Successfully updated recipe: ${payload.id}`);
        return resolve(data);
      })
      .catch((error) => {
        console.error(`Error updating recipe ${payload.id}:`, error);
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
      .then(async (data) => {
        if (data && data.name) {
          const id = data.name;
          const recipeWithKey = { ...payload, id };

          await updateRecipe(recipeWithKey);
          return resolve(recipeWithKey);
        }
        throw new Error('Failed to get Firebase key');
      })
      .catch((error) => {
        console.error('Error creating recipe:', error);
        return reject(error);
      });
  });

export { getRecipe, createRecipe, deleteRecipe, getSingleRecipe, updateRecipe, getEveryRecipe };
