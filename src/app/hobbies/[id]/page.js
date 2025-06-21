'use client';

/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '@/utils/context/authContext';
import { getSingleHobby } from '@/api/hobbyData';
import { toggleFavorite, isItemFavorited } from '@/api/favoritesData';
import { getRecipesByCategory } from '@/api/recipeData';
import { Row, Col, Button, Badge } from 'react-bootstrap';
import Link from 'next/link';

export default function HobbyDetails({ params }) {
  const [hobby, setHobby] = useState(null);
  const [relatedFormulas, setRelatedFormulas] = useState([]);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingFavoriteStatus, setLoadingFavoriteStatus] = useState(true);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const [error, setError] = useState(null);
  const { user, userLoading } = useAuth();

  const { id } = params;

  const getCategoryColor = (category) => {
    const categoryColors = {
      Physical: 'var(--steel-blue)',
      Creative: 'var(--mint-green)',
      Mental: 'var(--vintage-red)',
      Social: 'var(--warm-gray)',
      Outdoor: 'var(--charcoal)',
    };
    return categoryColors[category] || 'var(--light-gray)';
  };

  const getFavoriteButtonText = () => {
    if (isTogglingFavorite) return '⏳ Updating...';
    if (loadingFavoriteStatus) return '⏳ Loading...';
    if (isFavorited) return '⭐ Favorited';
    return '☆ Add to Favorites';
  };

  useEffect(() => {
    const fetchHobby = async () => {
      if (userLoading) return;

      if (!user) {
        setError('Authentication required');
        setIsLoading(false);
        return;
      }

      try {
        console.log('Fetching hobby details for ID:', id);
        setIsLoading(true);
        setError(null);

        const hobbyData = await getSingleHobby(id);

        if (hobbyData) {
          console.log('Hobby data loaded:', hobbyData);
          setHobby(hobbyData);

          setLoadingFavoriteStatus(true);
          const favoriteStatus = await isItemFavorited(hobbyData.id);
          setIsFavorited(favoriteStatus);
          setLoadingFavoriteStatus(false);

          if (hobbyData.category) {
            console.log('Fetching related formulas for category:', hobbyData.category);
            try {
              const formulasData = await getRecipesByCategory(hobbyData.category);
              if (formulasData && Array.isArray(formulasData)) {
                // Limit to first 5 related formulas
                setRelatedFormulas(formulasData.slice(0, 5));
                console.log('Related formulas loaded:', formulasData.slice(0, 5));
              }
            } catch (formulaErr) {
              console.warn('Could not load related formulas:', formulaErr);
            }
          }
        } else {
          console.log('Hobby not found');
          setError('Hobby not found');
        }
      } catch (err) {
        console.error('Error fetching hobby:', err);
        setError('Failed to load hobby details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHobby();
  }, [id, user, userLoading]);

  const handleFavoriteToggle = async () => {
    if (!hobby || isTogglingFavorite) return;

    setIsTogglingFavorite(true);
    try {
      console.log('Toggling favorite status for hobby:', hobby.id, 'Current status:', isFavorited);

      const newFavoriteStatus = await toggleFavorite(hobby.id, 'hobby', {
        category: hobby.category,
        title: hobby.title,
      });

      setIsFavorited(newFavoriteStatus);
      console.log('Hobby favorite status updated successfully:', newFavoriteStatus);
    } catch (err) {
      console.error('Error toggling favorite:', err);
      setError('Failed to update favorite status');
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  // Loading state
  if (userLoading || isLoading) {
    return (
      <div className="vintage-container">
        <div className="loading-analog">
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                marginBottom: '1rem',
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              Loading Subject Details...
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="vintage-container">
        <div className="analog-card text-center">
          <h3 style={{ color: 'var(--vintage-red)' }}>Error</h3>
          <p>{error}</p>
          <div style={{ marginTop: '1rem' }}>
            <Link href="/hobbiesMain" passHref>
              <Button className="btn-analog btn-analog-secondary">← Back to Subjects</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return (
      <div className="vintage-container">
        <div className="analog-card text-center">
          <h3 style={{ color: 'var(--vintage-red)' }}>Access Denied</h3>
          <p>Please authenticate to view subject details</p>
        </div>
      </div>
    );
  }

  // No hobby found
  if (!hobby) {
    return (
      <div className="vintage-container">
        <div className="analog-card text-center">
          <h3 style={{ color: 'var(--warm-gray)' }}>Subject Not Found</h3>
          <p>The requested Subject could not be located.</p>
          <div style={{ marginTop: '1rem' }}>
            <Link href="/hobbiesMain" passHref>
              <Button className="btn-analog btn-analog-secondary">← Back to Subjects</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="vintage-container">
      <div className="analog-card" style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header Section */}
        <div
          style={{
            background: 'var(--mint-green)',
            margin: '-1.5rem -1.5rem 2rem -1.5rem',
            padding: '2rem 1.5rem',
            border: '2px solid var(--charcoal)',
            borderBottom: 'none',
            textAlign: 'center',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <Button
              onClick={handleFavoriteToggle}
              disabled={isTogglingFavorite || loadingFavoriteStatus}
              className={`btn-analog ${isFavorited ? 'btn-analog-primary' : 'btn-analog-secondary'}`}
              style={{
                fontSize: '10px',
                padding: '0.5rem 1rem',
                background: isFavorited ? 'var(--golden-yellow)' : 'var(--steel-blue)',
                color: isFavorited ? 'var(--deep-black)' : 'var(--warm-white)',
              }}
            >
              {getFavoriteButtonText()}
            </Button>
          </div>

          <h1 style={{ color: 'var(--deep-black)', margin: 0, fontSize: '1.8rem', marginBottom: '0.5rem' }}>{hobby.title || 'Untitled'}</h1>

          <div
            style={{
              height: '2px',
              background: 'var(--charcoal)',
              margin: '0.5rem auto',
              width: '60%',
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
            <Badge
              style={{
                backgroundColor: getCategoryColor(hobby.category),
                color: 'var(--warm-white)',
                fontSize: '10px',
                textTransform: 'uppercase',
                padding: '0.5rem 1rem',
                border: '1px solid var(--charcoal)',
              }}
            >
              {hobby.category || 'Uncategorized'}
            </Badge>

            {/* Show favorite badge if favorited */}
            {!loadingFavoriteStatus && isFavorited && (
              <Badge
                style={{
                  backgroundColor: 'var(--golden-yellow)',
                  color: 'var(--deep-black)',
                  fontSize: '10px',
                  padding: '0.5rem 1rem',
                  border: '1px solid var(--charcoal)',
                }}
              >
                ⭐ Favorited
              </Badge>
            )}
          </div>
        </div>

        {/* Main Content */}
        <Row>
          <Col md={8}>
            {/* Image Section */}
            {hobby.image && (
              <div style={{ marginBottom: '2rem' }}>
                <div
                  style={{
                    border: '2px solid var(--charcoal)',
                    borderRadius: 'var(--border-radius)',
                    overflow: 'hidden',
                    backgroundColor: 'var(--light-gray)',
                  }}
                >
                  <img
                    src={hobby.image}
                    alt={hobby.title}
                    style={{
                      width: '100%',
                      height: 'auto',
                      maxHeight: '400px',
                      objectFit: 'cover',
                    }}
                  />
                </div>
              </div>
            )}

            {/* Description Section */}
            <div style={{ marginBottom: '2rem' }}>
              <h3
                style={{
                  fontSize: '14px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  color: 'var(--charcoal)',
                  marginBottom: '1rem',
                  borderBottom: '2px solid var(--steel-blue)',
                  paddingBottom: '0.5rem',
                }}
              >
                A little about this subject
              </h3>
              <div
                style={{
                  background: 'var(--cream)',
                  padding: '1.5rem',
                  border: '1px solid var(--light-gray)',
                  borderRadius: 'var(--border-radius)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                  lineHeight: '1.6',
                  color: 'var(--charcoal)',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {hobby.description || 'No details available for this log.'}
              </div>
            </div>
          </Col>

          <Col md={4}>
            {/* Related Formulas Panel */}
            <div style={{ marginBottom: '2rem' }}>
              <h3
                style={{
                  fontSize: '14px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  color: 'var(--charcoal)',
                  marginBottom: '1rem',
                  borderBottom: '2px solid var(--vintage-red)',
                  paddingBottom: '0.5rem',
                }}
              >
                Related Formulas
              </h3>

              {relatedFormulas.length > 0 ? (
                <div
                  style={{
                    background: 'var(--light-gray)',
                    padding: '1rem',
                    border: '2px solid var(--charcoal)',
                    borderRadius: 'var(--border-radius)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '10px',
                      fontFamily: 'var(--font-mono)',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      color: 'var(--warm-gray)',
                      marginBottom: '1rem',
                      textAlign: 'center',
                    }}
                  >
                    {hobby.category} Category Formulas
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {relatedFormulas.map((formula) => (
                      <Link key={formula.id} href={`/formulas/${formula.id}`} style={{ textDecoration: 'none' }}>
                        <div
                          style={{
                            background: 'var(--cream)',
                            padding: '0.75rem',
                            border: '1px solid var(--light-gray)',
                            borderRadius: 'var(--border-radius)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = 'var(--mint-green)';
                            e.target.style.borderColor = 'var(--charcoal)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = 'var(--cream)';
                            e.target.style.borderColor = 'var(--light-gray)';
                          }}
                        >
                          <div
                            style={{
                              fontSize: '12px',
                              fontWeight: '600',
                              color: 'var(--charcoal)',
                              marginBottom: '0.25rem',
                            }}
                          >
                            {formula.title || 'Untitled Formula'}
                          </div>
                          <div
                            style={{
                              fontSize: '10px',
                              color: 'var(--warm-gray)',
                              fontFamily: 'var(--font-mono)',
                            }}
                          >
                            {formula.description ? `${formula.description.slice(0, 50)}...` : 'No description'}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    background: 'var(--light-gray)',
                    padding: '1.5rem',
                    border: '2px solid var(--charcoal)',
                    borderRadius: 'var(--border-radius)',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'var(--warm-gray)',
                      marginBottom: '1rem',
                    }}
                  >
                    No related formulas found
                  </div>
                  <div
                    style={{
                      fontSize: '10px',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--charcoal)',
                    }}
                  >
                    Category: {hobby.category || 'Uncategorized'}
                  </div>
                  <div style={{ marginTop: '1rem' }}>
                    <Link href="/formulas/new" passHref>
                      <Button
                        className="btn-analog btn-analog-primary"
                        style={{
                          fontSize: '10px',
                          padding: '0.5rem 1rem',
                        }}
                      >
                        Create First Formula
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </Col>
        </Row>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          margin: '1.5rem',
        }}
      >
        <Link href="/hobbiesMain" passHref>
          <Button className="btn-analog btn-analog-secondary" style={{ fontSize: '11px', padding: '0.5rem 1rem' }}>
            ← Back to Browse Subjects
          </Button>
        </Link>
      </div>
    </div>
  );
}

HobbyDetails.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};
