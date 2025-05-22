'use client';

/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import Link from 'next/link';
import { getSingleRecipe } from '@/api/recipeData';
import { useAuth } from '@/utils/context/authContext';

export default function ViewRecipe({ params }) {
  const [recipeDetails, setRecipeDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const { id } = params;
  useEffect(() => {
    setLoading(true);
    getSingleRecipe(id)
      .then((data) => {
        setRecipeDetails(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching recipe:', err);
        setError('Failed to load recipe details');
        setLoading(false);
      });
  }, [id]);

  const isCreator = user?.uid === (recipeDetails?.uid || recipeDetails?.userId);

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
        <Link href="/formulasMain">
          <Button variant="primary">Back to Recipes</Button>
        </Link>
      </Container>
    );
  }

  if (!recipeDetails) {
    return (
      <Container className="py-5 text-center">
        <p>Recipe not found</p>
        <Link href="/formulasMain">
          <Button variant="primary">Back to Recipes</Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row>
        <Col lg={4} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <div style={{ height: '300px', overflow: 'hidden' }}>
              <Card.Img variant="top" src={recipeDetails.image || '/placeholder-image.png'} alt={recipeDetails.title} className="h-100 object-fit-cover" />
            </div>
            <Card.Body>
              <Badge bg="secondary" className="mb-2">
                {recipeDetails.category}
              </Badge>
              {recipeDetails.favorite && (
                <Badge bg="warning" className="ms-2 mb-2">
                  Favorite
                </Badge>
              )}

              {isCreator && (
                <div className="d-flex gap-2 mt-3">
                  <Link href={`/formulas/edit/${id}`} passHref style={{ flex: 1 }}>
                    <Button variant="outline-secondary" className="w-100">
                      Edit
                    </Button>
                  </Link>
                  <Link href="/formulasMain" passHref style={{ flex: 1 }}>
                    <Button variant="primary" className="w-100">
                      Back
                    </Button>
                  </Link>
                </div>
              )}

              {!isCreator && (
                <Link href="/formulasMain" passHref className="d-block mt-3">
                  <Button variant="primary" className="w-100">
                    Back to Recipes
                  </Button>
                </Link>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <h1 className="mb-4">{recipeDetails.title}</h1>

              <h5 className="text-muted mb-3">Description</h5>
              <p className="mb-4">{recipeDetails.description || 'No description available.'}</p>

              <hr className="my-4" />

              <div className="text-muted small">
                <p>Created: {new Date(recipeDetails.created_at).toLocaleDateString()}</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

ViewRecipe.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};
