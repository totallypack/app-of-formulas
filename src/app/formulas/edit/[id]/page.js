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
  const { id } = params;

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        console.log(`Fetching recipe with key: ${id}`);

        const recipeData = await getSingleRecipe(id);
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

    if (id) {
      fetchRecipe();
    }
  }, [id]);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <p>Loading recipe details...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5 text-center">
        <p className="text-danger">{error}</p>
      </Container>
    );
  }

  return <RecipeForm obj={editItem} />;
}

EditRecipe.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};
