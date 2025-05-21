'use client';

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getSingleRecipe } from '@/api/recipeData';
import RecipeForm from '@/components/forms/recipeForm';
import { Container } from 'react-bootstrap';

export default function EditRecipe({ params }) {
  const [editItem, setEditItem] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { firebaseKey } = params;

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        console.log(`Fetching recipe with key: ${firebaseKey}`);

        const recipeData = await getSingleRecipe(firebaseKey);
        console.log('Recipe data loaded:', recipeData);

        if (recipeData) {
          setEditItem(recipeData);
        } else {
          setError('Recipe not found');
        }
      } catch (err) {
        console.error('Error fetching recipe:', err);
        setError('Failed to load recipe details');
      } finally {
        setLoading(false);
      }
    };

    if (firebaseKey) {
      fetchRecipe();
    }
  }, [firebaseKey]);

  // Show loading state while fetching data
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <p>Loading recipe details...</p>
      </Container>
    );
  }

  // Show error message if there was a problem
  if (error) {
    return (
      <Container className="py-5 text-center">
        <p className="text-danger">{error}</p>
      </Container>
    );
  }

  // Only render the form when we have the data
  return <RecipeForm obj={editItem} />;
}

EditRecipe.propTypes = {
  params: PropTypes.shape({
    firebaseKey: PropTypes.string.isRequired,
  }).isRequired,
};
