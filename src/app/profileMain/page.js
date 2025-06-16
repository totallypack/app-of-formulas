'use client';

/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/utils/context/authContext';
import Link from 'next/link';
import { UpdateUserData, getUserData } from '@/api/userData';
import { getFavoritesByType } from '@/api/favoritesData';
import { getSingleHobby } from '@/api/hobbyData';
import { getSingleRecipe } from '@/api/recipeData';
import { Row, Col, Button, Badge } from 'react-bootstrap';

export default function UserComponent() {
  const [userProfile, setUserProfile] = useState({});
  const [favoritedSubjects, setFavoritedSubjects] = useState([]);
  const [favoritedFormulas, setFavoritedFormulas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [favoritesLoading, setFavoritesLoading] = useState(true);
  const { user, userLoading } = useAuth();

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

  const formatLastLogin = (lastLogin) => {
    if (!lastLogin) {
      return 'No previous sessions';
    }

    if (typeof lastLogin === 'string' && lastLogin.includes('T')) {
      return new Date(lastLogin).toLocaleString();
    }

    return lastLogin;
  };

  useEffect(() => {
    const fetchData = async () => {
      if (user && !userLoading) {
        setIsLoading(true);

        try {
          console.log('Updating user login data...');
          await UpdateUserData({
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
          });

          console.log('Fetching user profile data...');
          const userData = await getUserData(user.uid);

          if (userData) {
            console.log('User profile loaded:', userData);
            setUserProfile(userData);
          } else {
            console.log('No user profile found, using auth data');
            setUserProfile({
              uid: user.uid,
              name: user.displayName || '',
              email: user.email || '',
              photoURL: user.photoURL || '',
              lastLogin: new Date().toISOString(),
            });
          }
        } catch (error) {
          console.error('Error handling user data:', error);
          setUserProfile({
            uid: user.uid,
            name: user.displayName || '',
            email: user.email || '',
            photoURL: user.photoURL || '',
            lastLogin: 'Error loading data',
          });
        } finally {
          setIsLoading(false);
        }
      } else if (!userLoading) {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, userLoading]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (user && !userLoading) {
        setFavoritesLoading(true);

        try {
          console.log('Fetching user favorites with new favorites system...');

          const favoriteHobbiesData = await getFavoritesByType('hobby');
          const favoriteRecipesData = await getFavoritesByType('recipe');

          console.log('Raw favorite hobbies data:', favoriteHobbiesData);
          console.log('Raw favorite recipes data:', favoriteRecipesData);

          const hobbiesWithDetails = await Promise.all(
            favoriteHobbiesData.map(async (favorite) => {
              try {
                const hobbyDetails = await getSingleHobby(favorite.itemId);
                if (hobbyDetails) {
                  return {
                    ...hobbyDetails,
                    favoriteTimestamp: favorite.timestamp,
                    isFavorited: true,
                  };
                }
                return null;
              } catch (error) {
                console.error(`Error fetching hobby details for ${favorite.itemId}:`, error);
                return null;
              }
            }),
          );

          const recipesWithDetails = await Promise.all(
            favoriteRecipesData.map(async (favorite) => {
              try {
                const recipeDetails = await getSingleRecipe(favorite.itemId);
                if (recipeDetails) {
                  return {
                    ...recipeDetails,
                    favoriteTimestamp: favorite.timestamp,
                    isFavorited: true,
                  };
                }
                return null;
              } catch (error) {
                console.error(`Error fetching recipe details for ${favorite.itemId}:`, error);
                return null;
              }
            }),
          );

          const validHobbies = hobbiesWithDetails.filter((hobby) => hobby !== null).sort((a, b) => (b.favoriteTimestamp || 0) - (a.favoriteTimestamp || 0));

          const validRecipes = recipesWithDetails.filter((recipe) => recipe !== null).sort((a, b) => (b.favoriteTimestamp || 0) - (a.favoriteTimestamp || 0));

          console.log('Processed favorite subjects:', validHobbies.length);
          console.log('Processed favorite formulas:', validRecipes.length);

          setFavoritedSubjects(validHobbies);
          setFavoritedFormulas(validRecipes);
        } catch (err) {
          console.error('Error fetching favorites:', err);
          setFavoritedSubjects([]);
          setFavoritedFormulas([]);
        } finally {
          setFavoritesLoading(false);
        }
      } else if (!userLoading) {
        setFavoritesLoading(false);
      }
    };

    fetchFavorites();
  }, [user, userLoading]);

  if (userLoading || isLoading) {
    return (
      <div className="vintage-container">
        <div className="loading-analog">
          <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: '1rem', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Loading Researcher Profile...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="vintage-container">
        <div className="analog-card text-center">
          <h3 style={{ color: 'var(--vintage-red)' }}>Access Denied</h3>
          <p>Please authenticate to view researcher profile</p>
        </div>
      </div>
    );
  }

  const hasFavorites = favoritedSubjects.length > 0 || favoritedFormulas.length > 0;

  return (
    <div className="vintage-container">
      <div className="analog-card" style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Profile Header */}
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
          {/* Profile Image */}
          <div style={{ marginBottom: '1rem' }}>
            {userProfile.photoURL ? (
              <img
                src={userProfile.photoURL}
                alt="Profile"
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  border: '3px solid var(--charcoal)',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'var(--steel-blue)',
                  color: 'var(--warm-white)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '2rem',
                  border: '3px solid var(--charcoal)',
                }}
              >
                {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'R'}
              </div>
            )}
          </div>

          <div
            style={{
              height: '2px',
              background: 'var(--charcoal)',
              margin: '0.5rem auto',
              width: '60%',
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
            Profile
          </p>
        </div>

        {/* Profile Information */}
        <Row>
          <Col md={8}>
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
                }}
              >
                Personal Information
              </h3>

              <div
                style={{
                  background: 'var(--cream)',
                  padding: '1.5rem',
                  border: '1px solid var(--light-gray)',
                  borderRadius: 'var(--border-radius)',
                }}
              >
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
                    Name
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: 'var(--charcoal)',
                    }}
                  >
                    {userProfile.name || 'Unknown Researcher'}
                  </div>
                </div>

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
                    Email
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--charcoal)',
                    }}
                  >
                    {userProfile.email || 'Not Available'}
                  </div>
                </div>

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
                    Last System Access
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--charcoal)',
                    }}
                  >
                    {formatLastLogin(userProfile.lastLogin)}
                  </div>
                </div>
              </div>
            </div>
          </Col>

          <Col md={4}>
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
                Discovery Tools
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <Link href="/formulas/new" passHref>
                  <Button
                    className="btn-analog btn-analog-primary"
                    style={{
                      width: '100%',
                      fontSize: '11px',
                      padding: '0.75rem',
                    }}
                  >
                    📝 Create New Formula
                  </Button>
                </Link>

                <Link href="/formulasMain" passHref>
                  <Button
                    className="btn-analog btn-analog-secondary"
                    style={{
                      width: '100%',
                      fontSize: '11px',
                      padding: '0.75rem',
                    }}
                  >
                    🔎 Browse Formula Library
                  </Button>
                </Link>

                <Link href="/hobbiesMain" passHref>
                  <Button
                    className="btn-analog btn-analog-secondary"
                    style={{
                      width: '100%',
                      fontSize: '11px',
                      padding: '0.75rem',
                    }}
                  >
                    📚 Browse Subjects
                  </Button>
                </Link>
              </div>
            </div>

            {/* Status Panel */}
            <div
              style={{
                background: 'var(--light-gray)',
                padding: '1rem',
                border: '2px solid var(--charcoal)',
                borderRadius: 'var(--border-radius)',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '10px',
                  fontFamily: 'var(--font-mono)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  color: 'var(--charcoal)',
                  marginBottom: '0.5rem',
                }}
              >
                Status
              </div>
              <div
                className="category-badge category-chemical"
                style={{
                  fontSize: '9px',
                  marginBottom: '0.5rem',
                }}
              >
                ✅ Active
              </div>
              <div
                style={{
                  fontSize: '8px',
                  color: 'var(--warm-gray)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                FULL ACCESS
              </div>
            </div>
          </Col>
        </Row>

        {/* Favorites Section */}
        <div style={{ borderTop: '2px solid var(--light-gray)', marginTop: '2rem', paddingTop: '2rem' }}>
          <div
            style={{
              background: 'var(--mint-green)',
              margin: '0 -1.5rem 2rem -1.5rem',
              padding: '1.5rem',
              border: '2px solid var(--charcoal)',
              borderLeft: 'none',
              borderRight: 'none',
              textAlign: 'center',
            }}
          >
            <h2
              style={{
                color: 'var(--charcoal)',
                margin: 0,
                fontSize: '1.2rem',
                fontWeight: '600',
              }}
            >
              ★ Your Favorites
            </h2>
            <div
              style={{
                fontSize: '10px',
                fontFamily: 'var(--font-mono)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: 'var(--charcoal)',
                opacity: 0.9,
                marginTop: '0.5rem',
              }}
            >
              Subjects & Formulas You've Starred
            </div>
          </div>

          {/* Favorites Loading State */}
          {favoritesLoading && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '12px', color: 'var(--warm-gray)' }}>Loading your favorites...</div>
            </div>
          )}

          {/* No Favorites State */}
          {!favoritesLoading && !hasFavorites && (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <div
                style={{
                  fontSize: '48px',
                  color: 'var(--light-gray)',
                  marginBottom: '1rem',
                }}
              >
                ☆
              </div>
              <h3 style={{ color: 'var(--warm-gray)', marginBottom: '1rem' }}>No Favorites Yet</h3>
              <p style={{ color: 'var(--warm-gray)', marginBottom: '2rem' }}>Start exploring and star items you want to reference later!</p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/hobbiesMain" passHref>
                  <Button className="btn-analog btn-analog-primary" style={{ fontSize: '12px' }}>
                    Browse Subjects
                  </Button>
                </Link>
                <Link href="/formulasMain" passHref>
                  <Button className="btn-analog btn-analog-secondary" style={{ fontSize: '12px' }}>
                    Browse Formulas
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Favorites Content */}
          {!favoritesLoading && hasFavorites && (
            <Row>
              {/* Favorited Subjects */}
              <Col md={6}>
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
                    Favorite Subjects ({favoritedSubjects.length})
                  </h3>

                  {favoritedSubjects.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '400px', overflowY: 'auto' }}>
                      {favoritedSubjects.map((subject) => (
                        <Link key={subject.id} href={`/hobbies/${subject.id}`} style={{ textDecoration: 'none' }}>
                          <div
                            style={{
                              background: 'var(--cream)',
                              padding: '1rem',
                              border: '2px solid var(--light-gray)',
                              borderRadius: 'var(--border-radius)',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'var(--mint-green)';
                              e.currentTarget.style.borderColor = 'var(--charcoal)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'var(--cream)';
                              e.currentTarget.style.borderColor = 'var(--light-gray)';
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                              <div
                                style={{
                                  fontSize: '14px',
                                  fontWeight: '600',
                                  color: 'var(--charcoal)',
                                }}
                              >
                                {subject.title || 'Untitled Subject'}
                              </div>
                              <div style={{ fontSize: '16px' }}>★</div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                              <Badge
                                style={{
                                  backgroundColor: getCategoryColor(subject.category),
                                  color: 'var(--warm-white)',
                                  fontSize: '9px',
                                  padding: '0.25rem 0.75rem',
                                  border: '1px solid var(--charcoal)',
                                }}
                              >
                                {subject.category || 'Uncategorized'}
                              </Badge>
                            </div>

                            {/* Add favorite timestamp */}
                            {subject.favoriteTimestamp && (
                              <div
                                style={{
                                  fontSize: '9px',
                                  color: 'var(--warm-gray)',
                                  fontFamily: 'var(--font-mono)',
                                  textAlign: 'right',
                                }}
                              >
                                Favorited: {new Date(subject.favoriteTimestamp).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {favoritedSubjects.length === 0 && (
                    <div
                      style={{
                        background: 'var(--light-gray)',
                        padding: '1.5rem',
                        border: '1px solid var(--warm-gray)',
                        borderRadius: 'var(--border-radius)',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: '12px', color: 'var(--warm-gray)' }}>No favorite subjects yet</div>
                    </div>
                  )}
                </div>
              </Col>

              {/* Favorited Formulas */}
              <Col md={6}>
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
                    Favorite Formulas ({favoritedFormulas.length})
                  </h3>

                  {favoritedFormulas.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '400px', overflowY: 'auto' }}>
                      {favoritedFormulas.map((formula) => (
                        <Link key={formula.id} href={`/formulas/${formula.id}`} style={{ textDecoration: 'none' }}>
                          <div
                            style={{
                              background: 'var(--cream)',
                              padding: '1rem',
                              border: '2px solid var(--light-gray)',
                              borderRadius: 'var(--border-radius)',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'var(--mint-green)';
                              e.currentTarget.style.borderColor = 'var(--charcoal)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'var(--cream)';
                              e.currentTarget.style.borderColor = 'var(--light-gray)';
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                              <div
                                style={{
                                  fontSize: '14px',
                                  fontWeight: '600',
                                  color: 'var(--charcoal)',
                                }}
                              >
                                {formula.title || 'Untitled Formula'}
                              </div>
                              <div style={{ fontSize: '16px' }}>★</div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                              <Badge
                                style={{
                                  backgroundColor: getCategoryColor(formula.category),
                                  color: 'var(--warm-white)',
                                  fontSize: '9px',
                                  padding: '0.25rem 0.75rem',
                                  border: '1px solid var(--charcoal)',
                                }}
                              >
                                {formula.category || 'Uncategorized'}
                              </Badge>
                            </div>

                            {/* Add favorite timestamp */}
                            {formula.favoriteTimestamp && (
                              <div
                                style={{
                                  fontSize: '9px',
                                  color: 'var(--warm-gray)',
                                  fontFamily: 'var(--font-mono)',
                                  textAlign: 'right',
                                }}
                              >
                                Favorited: {new Date(formula.favoriteTimestamp).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {favoritedFormulas.length === 0 && (
                    <div
                      style={{
                        background: 'var(--light-gray)',
                        padding: '1.5rem',
                        border: '1px solid var(--warm-gray)',
                        borderRadius: 'var(--border-radius)',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: '12px', color: 'var(--warm-gray)' }}>No favorite formulas yet</div>
                    </div>
                  )}
                </div>
              </Col>
            </Row>
          )}

          {/* Quick Actions for Favorites */}
          {hasFavorites && (
            <div style={{ borderTop: '2px solid var(--light-gray)', paddingTop: '1.5rem', textAlign: 'center' }}>
              <div
                style={{
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  color: 'var(--warm-gray)',
                  marginBottom: '1rem',
                }}
              >
                Quick Actions
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/hobbiesMain" passHref>
                  <Button className="btn-analog btn-analog-secondary" style={{ fontSize: '11px', padding: '0.5rem 1rem' }}>
                    Browse More Subjects
                  </Button>
                </Link>
                <Link href="/formulasMain" passHref>
                  <Button className="btn-analog btn-analog-secondary" style={{ fontSize: '11px', padding: '0.5rem 1rem' }}>
                    Browse More Formulas
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
