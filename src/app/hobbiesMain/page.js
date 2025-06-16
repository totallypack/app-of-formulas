'use client';

import React, { useEffect, useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import { useAuth } from '@/utils/context/authContext';
import HobbyCard from '@/components/hobbyCard';
import { getEveryHobby } from '@/api/hobbyData';
import { getUserFavorites } from '@/api/favoritesData';

export default function HobbiesMain() {
  const [hobbies, setHobbies] = useState([]);
  const [userFavorites, setUserFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const { user } = useAuth();

  useEffect(() => {
    const fetchHobbies = async () => {
      try {
        setLoading(true);

        const allHobbies = await getEveryHobby();
        console.log('Fetched hobbies:', allHobbies);
        setHobbies(allHobbies || []);

        if (user) {
          const favorites = await getUserFavorites();
          const hobbyFavorites = favorites.filter((fav) => fav.itemType === 'hobby');
          setUserFavorites(hobbyFavorites);
          console.log('User hobby favorites:', hobbyFavorites);
        }
      } catch (error) {
        console.error('Error fetching hobbies:', error);
        setHobbies([]);
        setUserFavorites([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchHobbies();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleFavoriteUpdate = async () => {
    try {
      console.log('Refreshing hobbies and favorites after toggle...');

      const allHobbies = await getEveryHobby();
      setHobbies(allHobbies || []);

      if (user) {
        const favorites = await getUserFavorites();
        const hobbyFavorites = favorites.filter((fav) => fav.itemType === 'hobby');
        setUserFavorites(hobbyFavorites);
      }
    } catch (error) {
      console.error('Error refreshing hobbies:', error);
    }
  };

  const filteredHobbies = hobbies.filter((hobby) => {
    const matchesSearch = hobby?.title?.toLowerCase().includes(searchTerm.toLowerCase()) || hobby?.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || hobby?.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const renderContent = () => {
    if (loading) {
      return (
        <div className="loading-analog">
          <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: '1rem', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Loading Research Database...</div>
          </div>
        </div>
      );
    }

    if (filteredHobbies.length === 0) {
      return (
        <div className="analog-card text-center vintage-paper">
          <h3 style={{ color: 'var(--steel-blue)' }}>No Research Found</h3>
          <p>No research logs match your search criteria.</p>
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
      <div>
        {filteredHobbies.map((hobby) => (
          <HobbyCard key={hobby?.id || `hobby-${Math.random()}`} userHobby={hobby} onFavoriteUpdate={handleFavoriteUpdate} />
        ))}
      </div>
    );
  };

  const getCategoryCount = (category) => hobbies.filter((hobby) => hobby.category === category).length;

  const getFavoriteCount = () => userFavorites.length;

  if (!user) {
    return (
      <div className="hobbies-main-page vintage-paper">
        <div className="vintage-container">
          <div className="analog-card text-center">
            <h3 style={{ color: 'var(--steel-blue)' }}>Authentication Required</h3>
            <p>Please log in to access the Research Database.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hobbies-main-page vintage-paper">
      <div className="vintage-container">
        {/* Laboratory Header */}
        <div className="analog-card" style={{ marginBottom: '2rem' }}>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 style={{ margin: 0, color: 'var(--charcoal)' }}>Special Interests</h1>
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '12px' }}>
                Find a hobby or subject you are already interested in or discover a new one! • {hobbies.length} Total Entries • {getFavoriteCount()} Favorited
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filter Panel */}
        <div className="analog-card" style={{ marginBottom: '2rem' }}>
          <div>
            {/* Search Bar */}
            <div className="search-analog" style={{ marginBottom: '1rem' }}>
              <input type="text" placeholder="Search by title or description..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="form-control" style={{ paddingRight: '60px' }} />
              {searchTerm && (
                <Button
                  variant="outline-secondary"
                  onClick={() => setSearchTerm('')}
                  className="btn-analog btn-analog-secondary"
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '10px',
                    padding: '0.25rem 0.5rem',
                  }}
                >
                  Clear
                </Button>
              )}
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
                  All ({hobbies.length})
                </button>
                <button
                  type="button"
                  onClick={() => setCategoryFilter('Physical')}
                  className={`category-badge category-Physical ${categoryFilter === 'Physical' ? 'category-active' : ''}`}
                  style={{
                    cursor: 'pointer',
                    border: 'none',
                    fontSize: '9px',
                    opacity: categoryFilter === 'Physical' ? 1 : 0.7,
                  }}
                >
                  Physical ({getCategoryCount('Physical')})
                </button>
                <button
                  type="button"
                  onClick={() => setCategoryFilter('Creative')}
                  className={`category-badge category-Creative ${categoryFilter === 'Creative' ? 'category-active' : ''}`}
                  style={{
                    cursor: 'pointer',
                    border: 'none',
                    fontSize: '9px',
                    opacity: categoryFilter === 'Creative' ? 1 : 0.7,
                  }}
                >
                  Creative ({getCategoryCount('Creative')})
                </button>
                <button
                  type="button"
                  onClick={() => setCategoryFilter('Mental')}
                  className={`category-badge category-Mental ${categoryFilter === 'Mental' ? 'category-active' : ''}`}
                  style={{
                    cursor: 'pointer',
                    border: 'none',
                    fontSize: '9px',
                    opacity: categoryFilter === 'Mental' ? 1 : 0.7,
                  }}
                >
                  Mental ({getCategoryCount('Mental')})
                </button>
                <button
                  type="button"
                  onClick={() => setCategoryFilter('Social')}
                  className={`category-badge category-Social ${categoryFilter === 'Social' ? 'category-active' : ''}`}
                  style={{
                    cursor: 'pointer',
                    border: 'none',
                    fontSize: '9px',
                    opacity: categoryFilter === 'Social' ? 1 : 0.7,
                  }}
                >
                  Social ({getCategoryCount('Social')})
                </button>
                <button
                  type="button"
                  onClick={() => setCategoryFilter('Outdoor')}
                  className={`category-badge category-Outdoor ${categoryFilter === 'Outdoor' ? 'category-active' : ''}`}
                  style={{
                    cursor: 'pointer',
                    border: 'none',
                    fontSize: '9px',
                    opacity: categoryFilter === 'Outdoor' ? 1 : 0.7,
                  }}
                >
                  Outdoor ({getCategoryCount('Outdoor')})
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
                  border: '1px dashed var(--steel-blue)',
                  borderRadius: 'var(--border-radius)',
                  fontSize: '10px',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    color: 'var(--steel-blue)',
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
                  Showing {filteredHobbies.length} of {hobbies.length} entries
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Research Content */}
        <div className="analog-card">
          <div style={{ marginBottom: '1rem' }}>
            <h3
              style={{
                fontSize: '14px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: 'var(--charcoal)',
                marginBottom: '0.5rem',
                borderBottom: '2px solid var(--steel-blue)',
                paddingBottom: '0.5rem',
              }}
            >
              📚 Major Subjects and Hobbies
            </h3>
            <p
              style={{
                fontSize: '11px',
                color: 'var(--warm-gray)',
                margin: 0,
              }}
            >
              Browse • Click to expand details • Favorite for quick access
            </p>
          </div>

          {renderContent()}
        </div>
      </div>

      {/* Footer */}
      <footer className="footer-analog">
        <Container className="text-center">
          <p className="mb-0">© 1950-2025 Research Laboratory Systems • All Rights Reserved</p>
        </Container>
      </footer>
    </div>
  );
}
