'use client';

import React from 'react';
import Card from 'react-bootstrap/Card';
import Link from 'next/link';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import { deleteRecipe } from '@/api/recipeData';
import { useAuth } from '@/utils/context/authContext';

export default function RecipeCard({ recipeObj, onUpdate }) {
  console.log('RecipeCard received object:', recipeObj);
  console.log('RecipeCard id:', recipeObj?.id);
  const { user } = useAuth();
  const isCreator = user?.uid === (recipeObj?.uid || recipeObj?.userId);

  if (!recipeObj) {
    return (
      <Card className="h-100 border-0 shadow-sm overflow-hidden recipe-card">
        <Card.Body>
          <p>Loading recipe...</p>
        </Card.Body>
      </Card>
    );
  }

  const deleteThisRecipe = (e) => {
    e.preventDefault();

    console.log('Full recipe object:', recipeObj);
    console.log('Firebase key:', recipeObj.id);

    if (!recipeObj.id) {
      alert('Cannot delete this recipe: Missing recipe ID');
      return;
    }

    if (window.confirm(`Delete ${recipeObj.title}?`)) {
      deleteRecipe(recipeObj.id)
        .then(() => {
          console.log('Recipe deleted successfully');
          onUpdate();
        })
        .catch((error) => {
          console.error('Error deleting recipe:', error);
          alert('An error occurred while deleting the recipe. Please try again.');
        });
    }
  };

  return (
    <Card className="h-100 border-0 shadow-sm overflow-hidden recipe-card">
      <div style={{ height: '180px', overflow: 'hidden' }}>
        <Card.Img variant="top" src={recipeObj.image || '/placeholder-image.png'} className="recipe-image" />
      </div>
      <Card.Body className="d-flex flex-column">
        <Card.Title className="mb-2">{recipeObj.title}</Card.Title>
        <Card.Text className="text-muted small mb-2">{recipeObj.category}</Card.Text>
        <Card.Text className="flex-grow-1">
          {recipeObj.description?.substring(0, 100)}
          {recipeObj.description?.length > 100 ? '...' : ''}
        </Card.Text>
        <div className="mt-auto pt-3">
          <Link href={`/formulas/${recipeObj.id}`} passHref>
            <Button variant="primary" className="w-100 mb-2">
              View Details
            </Button>
          </Link>
          {isCreator && (
            <div className="d-flex gap-2">
              <Link href={`/formulas/edit/${recipeObj.id}`} passHref style={{ flex: 1 }}>
                <Button variant="outline-secondary" className="w-100" type="button">
                  Edit
                </Button>
              </Link>
              <Button variant="outline-danger" onClick={deleteThisRecipe} style={{ flex: 1 }} type="button">
                Delete
              </Button>
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}

RecipeCard.propTypes = {
  recipeObj: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    image: PropTypes.string,
    category: PropTypes.string,
    id: PropTypes.string,
    uid: PropTypes.string,
    hobbyId: PropTypes.string,
    favorite: PropTypes.bool,
    userId: PropTypes.string,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
};
