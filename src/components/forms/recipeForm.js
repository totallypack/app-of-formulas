'use client';

/* eslint-disable react/no-unescaped-entities */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import { Form, Button, Container, Card, Row, Col } from 'react-bootstrap';
import { useAuth } from '@/utils/context/authContext';
import { createRecipe, updateRecipe } from '@/api/recipeData';
import Link from 'next/link';

const initialState = {
  description: '',
  image: '',
  favorite: '',
  title: '',
  category: '',
};

export default function RecipeForm({ obj = initialState }) {
  const [formInput, setFormInput] = useState(obj);
  const [validated, setValidated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (obj.firebaseKey) {
      console.log('Received object with data to edit:', obj);
      setFormInput(obj);
    }
  }, [obj]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const getButtonText = () => {
    if (isSubmitting) {
      return 'Saving...';
    }

    if (obj.firebaseKey) {
      return 'Update Recipe';
    }

    return 'Create Recipe';
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setIsSubmitting(true);

    if (formInput.firebaseKey) {
      // Update existing recipe
      updateRecipe(formInput)
        .then(() => {
          console.log('Recipe updated successfully');
          router.push(`/formulas/${formInput.firebaseKey}`);
        })
        .catch((error) => {
          console.error('Error updating recipe:', error);
          setIsSubmitting(false);
        });
    } else {
      const payload = {
        ...formInput,
        userId: user.uid,
        created_at: new Date().toISOString(),
      };

      createRecipe(payload)
        .then((createdRecipe) => {
          console.log('Recipe created successfully:', createdRecipe);
          router.push('/formulasMain');
        })
        .catch((error) => {
          console.error('Error creating recipe:', error);
          setIsSubmitting(false);
        });
    }
  };

  return (
    <div className="recipe-form-page">
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4">
                <div className="mb-4">
                  <h2 className="mb-1">{obj.firebaseKey ? 'Update' : 'Create New'} Recipe</h2>
                  <p className="text-muted">{obj.firebaseKey ? 'Update the information for your recipe below.' : 'Fill out the form below to add your recipe.'}</p>
                </div>

                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  <Row>
                    <Col md={12} className="mb-3">
                      <Form.Group controlId="formtitle">
                        <Form.Label>Recipe Title</Form.Label>
                        <Form.Control type="text" name="title" value={formInput.title} onChange={handleChange} placeholder="Enter Recipe Title" required />
                        <Form.Control.Feedback type="invalid">Please provide a recipe title.</Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col md={12} className="mb-3">
                      <Form.Group controlId="formimage">
                        <Form.Label>Recipe Logo/image</Form.Label>
                        <Form.Control type="url" name="image" value={formInput.image} onChange={handleChange} placeholder="Enter image URL" required />
                        <Form.Control.Feedback type="invalid">Please provide an image URL.</Form.Control.Feedback>
                        <Form.Text className="text-muted">Provide a direct link to an image of your recipe's logo or a representative image.</Form.Text>
                      </Form.Group>
                    </Col>

                    <Col md={12} className="mb-3">
                      <Form.Group controlId="formCategory">
                        <Form.Label>Category</Form.Label>
                        <Form.Select name="category" value={formInput.category || ''} onChange={handleChange} required>
                          <option value="">Select a category</option>
                          <option value="chemical">Chemical</option>
                          <option value="edible">Edible</option>
                          <option value="cleaner">Cleaner</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">Please select a category.</Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col md={12} className="mb-3">
                      <Form.Group controlId="formdescription">
                        <Form.Label>Recipe description</Form.Label>
                        <Form.Control as="textarea" rows={4} name="description" value={formInput.description} onChange={handleChange} placeholder="Describe your recipe" required />
                        <Form.Control.Feedback type="invalid">Please provide a description.</Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col md={12} className="d-flex justify-content-between">
                      <Link href="/formulasMain">
                        <Button variant="outline-secondary">Cancel</Button>
                      </Link>
                      <Button type="submit" variant="primary" disabled={isSubmitting}>
                        {getButtonText()}
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <footer className="text-white py-4">
        <Container className="text-center">
          <p className="mb-0">© 2025 App of Formulas. All rights reserved.</p>
        </Container>
      </footer>
    </div>
  );
}

RecipeForm.propTypes = {
  obj: PropTypes.shape({
    favorite: PropTypes.bool,
    description: PropTypes.string,
    image: PropTypes.string,
    title: PropTypes.string,
    uid: PropTypes.string,
    category: PropTypes.string,
  }),
};
