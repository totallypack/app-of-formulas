import getSingleRecipe from './recipeData';

const viewRecipeDetails = (firebaseKey) =>
  new Promise((resolve, reject) => {
    Promise.all([getSingleRecipe(firebaseKey)])
      .then(([recipeObject]) => {
        resolve({
          ...recipeObject,
        });
      })
      .catch((error) => reject(error));
  });

export default viewRecipeDetails;
