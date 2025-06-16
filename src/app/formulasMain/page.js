'use client';

/* eslint-disable react/no-unescaped-entities */

import React, { useEffect, useState } from 'react';
import { getEveryRecipe, getRecipe } from '@/api/recipeData';
import { getUserFavorites } from '@/api/favoritesData';
import RecipeCard from '@/components/recipeCard';
import { useAuth } from '@/utils/context/authContext';
import { Container, Row, Col, Form, InputGroup, Button, Tabs, Tab } from 'react-bootstrap';

export default function FormulaMain() {
  const [recipes, setRecipes] = useState([]);
  const [userRecipes, setUserRecipes] = useState([]);
  const [userFavorites, setUserFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const { user } = useAuth();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const allRecipes = await getEveryRecipe();
        console.log('FormulaMain received recipes:', allRecipes);

        const missingKeys = allRecipes.filter((recipe) => !recipe.id);
        if (missingKeys.length > 0) {
          console.warn('Some formulas are missing id:', missingKeys);
        }

        setRecipes(allRecipes);

        if (user?.uid) {
          const myRecipes = await getRecipe(user.uid);
          console.log('FormulaMain received user recipes:', myRecipes);
          setUserRecipes(myRecipes);

          const favorites = await getUserFavorites();
          const recipeFavorites = favorites.filter((fav) => fav.itemType === 'recipe');
          setUserFavorites(recipeFavorites);
          console.log('User recipe favorites:', recipeFavorites);
        }
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.uid) {
      fetchRecipes();
    } else {
      setLoading(false);
    }
  }, [user?.uid]);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      console.log('Refreshing recipes and favorites after update/delete');

      if (user?.uid) {
        const [allRecipes, myRecipes] = await Promise.all([getEveryRecipe(), getRecipe(user.uid)]);

        setRecipes(allRecipes || []);
        setUserRecipes(myRecipes || []);

        const favorites = await getUserFavorites();
        const recipeFavorites = favorites.filter((fav) => fav.itemType === 'recipe');
        setUserFavorites(recipeFavorites);

        console.log(`Fetched ${allRecipes?.length || 0} total recipes and ${myRecipes?.length || 0} user recipes`);
      }
    } catch (error) {
      console.error('Error updating recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecipes = recipes.filter((formula) => {
    const matchesSearch = formula?.title?.toLowerCase().includes(searchTerm.toLowerCase()) || formula?.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || formula?.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const filteredUserRecipes = userRecipes.filter((formula) => {
    const matchesSearch = formula?.title?.toLowerCase().includes(searchTerm.toLowerCase()) || formula?.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || formula?.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const displayedRecipes = activeTab === 'all' ? filteredRecipes : filteredUserRecipes;

  const getCategoryCount = (category) => {
    const targetRecipes = activeTab === 'all' ? recipes : userRecipes;
    return targetRecipes.filter((recipe) => recipe.category === category).length;
  };

  const getFavoriteCount = () => userFavorites.length;

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-5">
          <div className="loading-analog">
            <p style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Loading Formula Database...</p>
          </div>
        </div>
      );
    }

    if (displayedRecipes.length === 0) {
      if (activeTab === 'all') {
        return (
          <div className="analog-card text-center vintage-paper">
            <h3 style={{ color: 'var(--mint-green)' }}>No Formulas Found</h3>
            <p>No formulas match your search criteria.</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
              <div className="category-badge category-chemical" style={{ fontSize: '9px' }}>
                Try different search terms
              </div>
              <div className="category-badge category-edible" style={{ fontSize: '9px' }}>
                Clear filters
              </div>
            </div>
          </div>
        );
      }
      return (
        <div className="analog-card text-center vintage-paper">
          <h3 style={{ color: 'var(--mint-green)' }}>No Personal Formulas</h3>
          <p>You haven't created any formulas yet.</p>
          <Button variant="primary" as="a" href="/formulas/new" className="btn-analog btn-analog-primary mt-3" style={{ fontSize: '12px' }}>
            📝 Create Your First Formula
          </Button>
        </div>
      );
    }

    return (
      <Row>
        {displayedRecipes.map((formula) => (
          <Col key={formula?.id || Math.random()} md={4} className="mb-4">
            <RecipeCard recipeObj={formula} onUpdate={handleUpdate} />
          </Col>
        ))}
      </Row>
    );
  };

  if (!user) {
    return (
      <div className="formula-main-page vintage-paper">
        <div className="vintage-container">
          <div className="analog-card text-center">
            <h3 style={{ color: 'var(--mint-green)' }}>Authentication Required</h3>
            <p>Please log in to access the Formula Database.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="formula-main-page vintage-paper">
      <div className="vintage-container">
        {/* Laboratory Header */}
        <div className="analog-card" style={{ marginBottom: '2rem' }}>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 style={{ margin: 0, color: 'var(--charcoal)' }}>Formula Database</h1>
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '12px' }}>
                Discover proven formulas and recipes • {recipes.length} Total Formulas • {getFavoriteCount()} Favorited
              </p>
            </div>
            <Button variant="primary" as="a" href="/formulas/new" className="btn-analog btn-analog-primary" style={{ fontSize: '12px' }}>
              📝 Create New Formula
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="analog-card" style={{ marginBottom: '2rem' }}>
          <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4" style={{ borderBottom: '2px solid var(--mint-green)' }}>
            <Tab eventKey="all" title={`All Formulas (${recipes.length})`}>
              {/* Search and Filter Panel */}
              <div style={{ marginTop: '1rem' }}>
                {/* Search Bar */}
                <div className="search-analog" style={{ marginBottom: '1rem' }}>
                  <InputGroup>
                    <Form.Control placeholder="Search formulas by title or description..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ paddingRight: '60px' }} />
                    <Button variant="outline-secondary" onClick={() => setSearchTerm('')} className="btn-analog btn-analog-secondary" style={{ fontSize: '10px' }}>
                      Clear
                    </Button>
                  </InputGroup>
                </div>

                {/* Category Filters */}
                <div>
                  <div
                    style={{
                      fontSize: '10px',
                      fontFamily: 'var(--font-mono)',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      color: 'var(--warm-gray)',
                      marginBottom: '0.5rem',
                    }}
                  >
                    Filter by Category
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => setCategoryFilter('all')}
                      className={`category-badge ${categoryFilter === 'all' ? 'category-active' : 'category-inactive'}`}
                      style={{
                        cursor: 'pointer',
                        border: 'none',
                        fontSize: '9px',
                        background: categoryFilter === 'all' ? 'var(--mint-green)' : 'var(--light-gray)',
                      }}
                    >
                      All ({recipes.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setCategoryFilter('chemical')}
                      className={`category-badge category-chemical ${categoryFilter === 'chemical' ? 'category-active' : ''}`}
                      style={{
                        cursor: 'pointer',
                        border: 'none',
                        fontSize: '9px',
                        opacity: categoryFilter === 'chemical' ? 1 : 0.7,
                      }}
                    >
                      Chemical ({getCategoryCount('chemical')})
                    </button>
                    <button
                      type="button"
                      onClick={() => setCategoryFilter('edible')}
                      className={`category-badge category-edible ${categoryFilter === 'edible' ? 'category-active' : ''}`}
                      style={{
                        cursor: 'pointer',
                        border: 'none',
                        fontSize: '9px',
                        opacity: categoryFilter === 'edible' ? 1 : 0.7,
                      }}
                    >
                      Edible ({getCategoryCount('edible')})
                    </button>
                    <button
                      type="button"
                      onClick={() => setCategoryFilter('cleaner')}
                      className={`category-badge category-cleaner ${categoryFilter === 'cleaner' ? 'category-active' : ''}`}
                      style={{
                        cursor: 'pointer',
                        border: 'none',
                        fontSize: '9px',
                        opacity: categoryFilter === 'cleaner' ? 1 : 0.7,
                      }}
                    >
                      Cleaner ({getCategoryCount('cleaner')})
                    </button>
                  </div>
                </div>

                {/* Active Filters Display */}
                {(searchTerm || categoryFilter !== 'all') && (
                  <div
                    style={{
                      marginTop: '1rem',
                      padding: '0.75rem',
                      background: 'var(--warm-white)',
                      border: '1px dashed var(--mint-green)',
                      borderRadius: 'var(--border-radius)',
                      fontSize: '10px',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        color: 'var(--mint-green)',
                        marginBottom: '0.25rem',
                      }}
                    >
                      Active Filters:
                    </div>
                    <div style={{ color: 'var(--charcoal)' }}>
                      {searchTerm && `Search: "${searchTerm}"`}
                      {searchTerm && categoryFilter !== 'all' && ' • '}
                      {categoryFilter !== 'all' && `Category: ${categoryFilter}`}
                      {' • '}
                      Showing {filteredRecipes.length} of {recipes.length} formulas
                    </div>
                  </div>
                )}
              </div>
            </Tab>
            <Tab eventKey="yours" title={`Your Formulas (${userRecipes.length})`}>
              <div style={{ marginTop: '1rem' }}>
                <p className="mb-4" style={{ fontSize: '12px', color: 'var(--warm-gray)' }}>
                  Formulas you've created and can edit
                </p>

                {/* Search for user recipes */}
                <div className="search-analog" style={{ marginBottom: '1rem' }}>
                  <InputGroup>
                    <Form.Control placeholder="Search your formulas..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    <Button variant="outline-secondary" onClick={() => setSearchTerm('')} className="btn-analog btn-analog-secondary" style={{ fontSize: '10px' }}>
                      Clear
                    </Button>
                  </InputGroup>
                </div>
              </div>
            </Tab>
          </Tabs>
        </div>

        {/* Formula Content */}
        <div className="analog-card">
          <div style={{ marginBottom: '1rem' }}>
            <h3
              style={{
                fontSize: '14px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: 'var(--charcoal)',
                marginBottom: '0.5rem',
                borderBottom: '2px solid var(--mint-green)',
                paddingBottom: '0.5rem',
              }}
            >
              🧪 {activeTab === 'all' ? 'All Formulas' : 'Your Formulas'}
            </h3>
            <p
              style={{
                fontSize: '11px',
                color: 'var(--warm-gray)',
                margin: 0,
              }}
            >
              {activeTab === 'all' ? 'Browse community formulas • Click to view details • Favorite for quick access' : 'Manage your personal formulas • Edit or delete your creations'}
            </p>
          </div>

          {renderContent()}
        </div>
      </div>

      {/* Footer */}
      <footer className="footer-analog">
        <Container className="text-center">
          <p className="mb-0">© 1950-2025 App of Formulas • All Rights Reserved</p>
        </Container>
      </footer>
    </div>
  );
}
