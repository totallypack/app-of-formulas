'use client';

/* eslint-disable react/no-unescaped-entities */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
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
    if (obj.id) {
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

    if (obj.id) {
      return 'Update Formula';
    }

    return 'Create Formula';
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

    if (formInput.id) {
      // Update existing formula
      updateRecipe(formInput)
        .then(() => {
          console.log('Formula updated successfully');
          router.push(`/formulas/${formInput.id}`);
        })
        .catch((error) => {
          console.error('Error updating formula:', error);
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
          console.log('Formula created successfully:', createdRecipe);
          router.push('/formulasMain');
        })
        .catch((error) => {
          console.error('Error creating formula:', error);
          setIsSubmitting(false);
        });
    }
  };

  return (
    <div className="recipe-form-page vintage-paper">
      <div className="vintage-container">
        <div className="analog-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* Form Header */}
          <div className="mb-4 text-center">
            <div
              style={{
                background: 'var(--mint-green)',
                margin: '-1.5rem -1.5rem 2rem -1.5rem',
                padding: '1.5rem',
                border: '2px solid var(--charcoal)',
                borderBottom: 'none',
              }}
            >
              <h1 style={{ color: 'var(--deep-black)', margin: 0 }}>{obj.id ? '📝 UPDATE' : '📝 NEW'} FORMULA</h1>
              <div
                style={{
                  height: '2px',
                  background: 'var(--charcoal)',
                  margin: '0.5rem auto',
                  width: '40%',
                }}
              />
              <p
                style={{
                  fontSize: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  color: 'var(--charcoal)',
                  margin: 0,
                }}
              >
                {obj.id ? 'Modify Formula' : 'New Formula'}
              </p>
            </div>
          </div>

          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row>
              {/* Title Field */}
              <Col md={12} className="form-analog mb-3">
                <label htmlFor="formtitle">Formula Designation</label>
                <input type="text" name="title" value={formInput.title} onChange={handleChange} placeholder="Enter descriptive formula name" required />
                <small style={{ fontSize: '10px', color: 'var(--warm-gray)' }}>Provide a designation for this formula</small>
              </Col>

              {/* Image Field */}
              <Col md={12} className="form-analog mb-3">
                <label htmlFor="formimage">Image</label>
                <input type="url" name="image" value={formInput.image} onChange={handleChange} placeholder="Enter laboratory image URL" required />
                <small
                  style={{
                    fontSize: '10px',
                    color: 'var(--warm-gray)',
                    display: 'block',
                    marginTop: '0.25rem',
                  }}
                >
                  📷 Provide an image for reference
                </small>
              </Col>

              {/* Category Field */}
              <Col md={12} className="form-analog mb-3">
                <label htmlFor="formCategory">Research Category</label>
                <select name="category" value={formInput.category || ''} onChange={handleChange} required style={{ appearance: 'none', cursor: 'pointer' }}>
                  <option value="">-- Select Classification --</option>
                  <option value="chemical">⚗️ Chemical Compounds</option>
                  <option value="edible">🍽️ Edible Recipes</option>
                  <option value="cleaner">🧽 Cleaning Solutions</option>
                </select>
                <small style={{ fontSize: '10px', color: 'var(--warm-gray)' }}>Classify formula by primary application type</small>
              </Col>

              {/* Description Field */}
              <Col md={12} className="form-analog mb-4">
                <label htmlFor="formdescription">Documentation</label>
                <textarea rows={6} name="description" value={formInput.description} onChange={handleChange} placeholder="Document formula composition, methodology, and observations..." required style={{ resize: 'vertical', minHeight: '120px' }} />
                <small style={{ fontSize: '10px', color: 'var(--warm-gray)' }}>📝 Include ingredients, measurements, procedures, and/or safety notes</small>
              </Col>

              {/* Control Panel */}
              <Col md={12}>
                <div
                  style={{
                    background: 'var(--light-gray)',
                    padding: '1.5rem',
                    margin: '0 -1.5rem -1.5rem -1.5rem',
                    border: '2px solid var(--charcoal)',
                    borderTop: 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Link href="/formulasMain">
                    <Button variant="outline-secondary" className="btn-analog btn-analog-secondary">
                      ← CANCEL
                    </Button>
                  </Link>

                  <div
                    style={{
                      fontSize: '10px',
                      fontFamily: 'var(--font-mono)',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      color: 'var(--warm-gray)',
                      textAlign: 'center',
                    }}
                  >
                    {obj.id ? 'Updating Formula Record' : 'Creating New Entry'}
                  </div>

                  <Button type="submit" variant="primary" className="btn-analog btn-analog-primary" disabled={isSubmitting} style={{ minWidth: '120px' }}>
                    {getButtonText()}
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </div>
      </div>

      <footer className="footer-analog">
        <Container className="text-center">
          <p className="mb-0">© 1950-2025 Formula Laboratory Systems • All Rights Reserved</p>
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
