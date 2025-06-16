'use client';

/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Link from 'next/link';
import { getSingleRecipe } from '@/api/recipeData';
import { toggleFavorite, isItemFavorited } from '@/api/favoritesData';
import { useAuth } from '@/utils/context/authContext';

export default function ViewRecipe({ params }) {
  const [recipeDetails, setRecipeDetails] = useState({});
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingFavoriteStatus, setLoadingFavoriteStatus] = useState(true);
  const [isUpdatingFavorite, setIsUpdatingFavorite] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const { id } = params;

  useEffect(() => {
    const fetchRecipeAndFavoriteStatus = async () => {
      try {
        setLoading(true);

        const data = await getSingleRecipe(id);
        setRecipeDetails(data);

        if (data?.id) {
          setLoadingFavoriteStatus(true);
          const favoriteStatus = await isItemFavorited(data.id);
          setIsFavorited(favoriteStatus);
          setLoadingFavoriteStatus(false);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching recipe:', err);
        setError('Failed to load recipe details');
        setLoading(false);
        setLoadingFavoriteStatus(false);
      }
    };

    if (id) {
      fetchRecipeAndFavoriteStatus();
    }
  }, [id]);

  const isCreator = user?.uid === (recipeDetails?.uid || recipeDetails?.userId);

  if (loading) {
    return (
      <div className="vintage-container">
        <div className="loading-analog">
          <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: '1rem', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Loading Formula Documentation...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="vintage-container">
        <div className="analog-card text-center">
          <h3 style={{ color: 'var(--vintage-red)', marginBottom: '1rem' }}>Error Loading Formula</h3>
          <p style={{ color: 'var(--warm-gray)', marginBottom: '2rem' }}>{error}</p>
          <Link href="/formulasMain">
            <Button className="btn-analog btn-analog-primary">← Return to Database</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!recipeDetails) {
    return (
      <div className="vintage-container">
        <div className="analog-card text-center">
          <h3 style={{ color: 'var(--vintage-red)', marginBottom: '1rem' }}>Formula Not Found</h3>
          <p style={{ color: 'var(--warm-gray)', marginBottom: '2rem' }}>The requested formula does not exist in the database</p>
          <Link href="/formulasMain">
            <Button className="btn-analog btn-analog-primary">← Return to Database</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleToggleFavorite = async () => {
    if (!recipeDetails.id || isUpdatingFavorite) {
      return;
    }

    setIsUpdatingFavorite(true);
    try {
      console.log('Toggling favorite for recipe:', recipeDetails.id, 'Current status:', isFavorited);

      const newFavoriteStatus = await toggleFavorite(recipeDetails.id, 'recipe', {
        category: recipeDetails.category,
        title: recipeDetails.title,
      });

      setIsFavorited(newFavoriteStatus);
      console.log('Recipe favorite status updated successfully:', newFavoriteStatus);
    } catch (err) {
      console.error('Error updating favorite status:', err);
      alert('An error occurred while updating favorite status. Please try again.');
    } finally {
      setIsUpdatingFavorite(false);
    }
  };

  const getFavoriteButtonText = () => {
    if (isUpdatingFavorite) return '⏳ Updating...';
    if (loadingFavoriteStatus) return '⏳ Loading...';
    if (isFavorited) return '⭐ Remove from Favorites';
    return '☆ Add to Favorites';
  };

  return (
    <div className="vintage-paper" style={{ minHeight: '100vh' }}>
      <div className="vintage-container">
        {/* Header */}
        <div className="analog-card" style={{ marginBottom: '2rem' }}>
          <div
            style={{
              background: 'var(--mint-green)',
              margin: '-1.5rem -1.5rem 1.5rem -1.5rem',
              padding: '1.5rem',
              border: '2px solid var(--charcoal)',
              borderBottom: 'none',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h1
                  style={{
                    color: 'var(--deep-black)',
                    margin: 0,
                    fontSize: '1.5rem',
                  }}
                >
                  FORMULA DETAILS
                </h1>
                <p
                  style={{
                    fontSize: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    color: 'var(--charcoal)',
                    margin: '0.5rem 0 0 0',
                  }}
                >
                  Document Record
                </p>
              </div>
            </div>
          </div>
        </div>

        <Row>
          {/* Left Panel - Image and Classification */}
          <Col lg={4} className="mb-4">
            <div className="analog-card" style={{ height: 'fit-content' }}>
              {/* Formula Image */}
              <div
                style={{
                  height: '280px',
                  overflow: 'hidden',
                  position: 'relative',
                  background: 'var(--light-gray)',
                  border: '2px solid var(--charcoal)',
                  borderRadius: 'var(--border-radius)',
                  marginBottom: '1.5rem',
                }}
              >
                {recipeDetails.image ? (
                  <img
                    src={recipeDetails.image}
                    alt={recipeDetails.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: 'sepia(15%) contrast(1.1)',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                      background: 'var(--light-gray)',
                      color: 'var(--warm-gray)',
                      fontSize: '3rem',
                    }}
                  >
                    {recipeDetails.category === 'chemical' && '⚗️'}
                    {recipeDetails.category === 'edible' && '🍽️'}
                    {recipeDetails.category === 'cleaner' && '🧽'}
                    {!recipeDetails.category && '📄'}
                  </div>
                )}

                {/* Grid Overlay */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `
                    linear-gradient(rgba(44, 44, 44, 0.05) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(44, 44, 44, 0.05) 1px, transparent 1px)
                  `,
                    backgroundSize: '20px 20px',
                    pointerEvents: 'none',
                  }}
                />
              </div>

              {/* Classification Panel */}
              <div
                style={{
                  background: 'var(--cream)',
                  padding: '1.5rem',
                  border: '2px solid var(--charcoal)',
                  borderRadius: 'var(--border-radius)',
                  marginBottom: '1.5rem',
                }}
              >
                <h4
                  style={{
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    color: 'var(--charcoal)',
                    marginBottom: '1rem',
                    borderBottom: '1px solid var(--light-gray)',
                    paddingBottom: '0.5rem',
                  }}
                >
                  📊 Classification Data
                </h4>

                <div style={{ marginBottom: '1rem' }}>
                  <div
                    style={{
                      fontSize: '10px',
                      fontFamily: 'var(--font-mono)',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      color: 'var(--warm-gray)',
                      marginBottom: '0.25rem',
                    }}
                  >
                    Category
                  </div>
                  <div className={`category-badge category-${recipeDetails.category}`}>{recipeDetails.category?.toUpperCase() || 'UNCLASSIFIED'}</div>
                </div>

                {/* Updated favorite status display */}
                {!loadingFavoriteStatus && isFavorited && (
                  <div style={{ marginBottom: '1rem' }}>
                    <div
                      style={{
                        fontSize: '10px',
                        fontFamily: 'var(--font-mono)',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        color: 'var(--warm-gray)',
                        marginBottom: '0.25rem',
                      }}
                    >
                      Status
                    </div>
                    <div
                      style={{
                        background: 'var(--golden-yellow)',
                        color: 'var(--deep-black)',
                        padding: '0.25rem 0.5rem',
                        fontSize: '10px',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        borderRadius: 'var(--border-radius)',
                        border: '1px solid var(--charcoal)',
                        display: 'inline-block',
                      }}
                    >
                      ⭐ Favorite
                    </div>
                  </div>
                )}

                <div>
                  <div
                    style={{
                      fontSize: '10px',
                      fontFamily: 'var(--font-mono)',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      color: 'var(--warm-gray)',
                      marginBottom: '0.25rem',
                    }}
                  >
                    Access Level
                  </div>
                  <div
                    style={{
                      background: isCreator ? 'var(--mint-green)' : 'var(--steel-blue)',
                      color: 'var(--deep-black)',
                      padding: '0.25rem 0.5rem',
                      fontSize: '9px',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      borderRadius: 'var(--border-radius)',
                      border: '1px solid var(--charcoal)',
                      display: 'inline-block',
                    }}
                  >
                    {isCreator ? 'Full Access' : 'Read Only'}
                  </div>
                </div>
              </div>

              {/* Control Panel */}
              <div
                style={{
                  background: 'var(--light-gray)',
                  padding: '1.5rem',
                  border: '2px solid var(--charcoal)',
                  borderRadius: 'var(--border-radius)',
                }}
              >
                <h4
                  style={{
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    color: 'var(--charcoal)',
                    marginBottom: '1rem',
                    borderBottom: '1px solid var(--warm-gray)',
                    paddingBottom: '0.5rem',
                  }}
                >
                  🎛️ Control Panel
                </h4>

                {/* favorite button */}
                <Button
                  className={`btn-analog ${isFavorited ? 'btn-analog-primary' : 'btn-analog-secondary'}`}
                  onClick={handleToggleFavorite}
                  disabled={isUpdatingFavorite || loadingFavoriteStatus}
                  style={{
                    width: '100%',
                    fontSize: '11px',
                    marginBottom: '0.75rem',
                    background: isFavorited ? 'var(--golden-yellow)' : 'var(--light-gray)',
                    color: isFavorited ? 'var(--deep-black)' : 'var(--charcoal)',
                  }}
                >
                  {getFavoriteButtonText()}
                </Button>

                {isCreator ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <Link href={`/formulas/edit/${id}`} passHref>
                      <Button className="btn-analog btn-analog-secondary" style={{ width: '100%', fontSize: '11px' }}>
                        ✏️ Edit Formula
                      </Button>
                    </Link>
                    <Link href="/formulasMain" passHref>
                      <Button className="btn-analog btn-analog-primary" style={{ width: '100%', fontSize: '11px' }}>
                        ← Return to Database
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <Link href="/formulasMain" passHref>
                    <Button className="btn-analog btn-analog-primary" style={{ width: '100%', fontSize: '11px' }}>
                      ← Return to Database
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </Col>

          {/* Right Panel - Formula Details */}
          <Col lg={8}>
            <div className="analog-card" style={{ height: 'fit-content' }}>
              {/* Formula Title */}
              <div
                style={{
                  background: 'var(--steel-blue)',
                  margin: '-1.5rem -1.5rem 1.5rem -1.5rem',
                  padding: '1.5rem',
                  border: '2px solid var(--charcoal)',
                  borderBottom: 'none',
                }}
              >
                <h1
                  style={{
                    color: 'var(--warm-white)',
                    margin: 0,
                    fontSize: '1.8rem',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                  }}
                >
                  {recipeDetails.title}
                </h1>
              </div>

              {/* Documentation Section */}
              <div style={{ marginBottom: '2rem' }}>
                <h3
                  style={{
                    fontSize: '14px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    color: 'var(--charcoal)',
                    marginBottom: '1rem',
                    borderBottom: '2px solid var(--mint-green)',
                    paddingBottom: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  Documentation
                </h3>

                <div
                  style={{
                    background: 'var(--cream)',
                    padding: '1.5rem',
                    border: '1px solid var(--light-gray)',
                    borderRadius: 'var(--border-radius)',
                    borderLeft: '4px solid var(--mint-green)',
                  }}
                >
                  <p
                    style={{
                      fontSize: '14px',
                      lineHeight: '1.6',
                      color: 'var(--charcoal)',
                      margin: 0,
                      fontFamily: 'var(--font-sans)',
                    }}
                  >
                    {recipeDetails.description || 'No detailed documentation available for this formula.'}
                  </p>
                </div>
              </div>

              {/* Metadata */}
              <div
                style={{
                  background: 'var(--light-gray)',
                  padding: '1.5rem',
                  border: '2px solid var(--charcoal)',
                  borderRadius: 'var(--border-radius)',
                }}
              >
                <h3
                  style={{
                    fontSize: '14px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    color: 'var(--charcoal)',
                    marginBottom: '1rem',
                    borderBottom: '1px solid var(--warm-gray)',
                    paddingBottom: '0.5rem',
                  }}
                >
                  Metadata
                </h3>

                <Row>
                  <Col md={6}>
                    <div style={{ marginBottom: '1rem' }}>
                      <div
                        style={{
                          fontSize: '10px',
                          fontFamily: 'var(--font-mono)',
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                          color: 'var(--warm-gray)',
                          marginBottom: '0.25rem',
                        }}
                      >
                        Documentation Date
                      </div>
                      <div
                        style={{
                          fontSize: '12px',
                          fontFamily: 'var(--font-mono)',
                          color: 'var(--charcoal)',
                          fontWeight: '600',
                        }}
                      >
                        {recipeDetails.created_at
                          ? new Date(recipeDetails.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })
                          : 'Date Unknown'}
                      </div>
                    </div>
                  </Col>

                  <Col md={12}>
                    <div>
                      <div
                        style={{
                          fontSize: '10px',
                          fontFamily: 'var(--font-mono)',
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                          color: 'var(--warm-gray)',
                          marginBottom: '0.25rem',
                        }}
                      >
                        Notes
                      </div>
                      <div
                        style={{
                          fontSize: '11px',
                          fontFamily: 'var(--font-mono)',
                          color: 'var(--warm-gray)',
                          fontStyle: 'italic',
                          padding: '0.5rem',
                          background: 'var(--warm-white)',
                          border: '1px dashed var(--warm-gray)',
                          borderRadius: 'var(--border-radius)',
                        }}
                      >
                        Formula archived in laboratory database • Follow standard safety protocols • Refer to research documentation for complete methodology
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {/* Footer */}
      <footer className="footer-analog">
        <Container className="text-center">
          <p className="mb-0">© 1950-2025 Formula Laboratory Systems • Confidential Research Documentation</p>
        </Container>
      </footer>
    </div>
  );
}

ViewRecipe.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};
