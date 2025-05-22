import getSingleRecipe from './recipeData';

const viewRecipeDetails = (id) =>
  new Promise((resolve, reject) => {
    Promise.all([getSingleRecipe(id)])
      .then(([recipeObject]) => {
        resolve({
          ...recipeObject,
        });
      })
      .catch((error) => reject(error));
  });

export default viewRecipeDetails;
