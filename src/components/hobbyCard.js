'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import { toggleFavorite, isItemFavorited } from '@/api/favoritesData';

function HobbyCard({ userHobby, onFavoriteUpdate }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isUpdatingFavorite, setIsUpdatingFavorite] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [loadingFavoriteStatus, setLoadingFavoriteStatus] = useState(true);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (userHobby?.id) {
        setLoadingFavoriteStatus(true);
        try {
          const favoriteStatus = await isItemFavorited(userHobby.id);
          setIsFavorited(favoriteStatus);
        } catch (error) {
          console.error('Error checking favorite status:', error);
          setIsFavorited(false);
        } finally {
          setLoadingFavoriteStatus(false);
        }
      } else {
        setLoadingFavoriteStatus(false);
      }
    };

    checkFavoriteStatus();
  }, [userHobby?.id]);

  if (!userHobby) {
    return (
      <div className="analog-card" style={{ marginBottom: '1rem' }}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div className="loading-analog">
            <p style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Loading Subject...</p>
          </div>
        </div>
      </div>
    );
  }

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userHobby.id) {
      alert('Cannot favorite this subject: Missing ID');
      return;
    }

    setIsUpdatingFavorite(true);
    try {
      console.log('Toggling favorite for hobby:', userHobby.id, 'Current status:', isFavorited);

      const newFavoriteStatus = await toggleFavorite(userHobby.id, 'hobby', {
        category: userHobby.category,
        title: userHobby.title,
      });

      setIsFavorited(newFavoriteStatus);
      console.log('Hobby favorite status updated successfully:', newFavoriteStatus);

      if (onFavoriteUpdate) {
        onFavoriteUpdate();
      }
    } catch (error) {
      console.error('Error updating favorite status:', error);
      alert('An error occurred while updating favorite status. Please try again.');
    } finally {
      setIsUpdatingFavorite(false);
    }
  };

  const getFavoriteButtonText = () => {
    if (isUpdatingFavorite) return '⏳ Updating...';
    if (loadingFavoriteStatus) return '⏳ Loading...';
    if (isFavorited) return '⭐ Remove Favorite';
    return '☆ Add Favorite';
  };

  return (
    <div
      className="analog-card vintage-paper"
      style={{
        marginBottom: '1.5rem',
        transition: 'all 0.3s ease',
        position: 'relative',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'var(--steel-blue)',
          margin: '-1.5rem -1.5rem 1rem -1.5rem',
          padding: '1rem 1.5rem',
          border: '2px solid var(--charcoal)',
          borderBottom: 'none',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ flex: 1 }}>
          <h5
            style={{
              color: 'var(--warm-white)',
              margin: 0,
              fontSize: '16px',
              fontFamily: 'var(--font-mono)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            {userHobby.title}
          </h5>
        </div>

        {/* Status Indicators */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Category Badge */}
          {userHobby.category && <div className={`category-badge category-${userHobby.category}`}>{userHobby.category.toUpperCase()}</div>}

          {/* Favorite Badge */}
          {!loadingFavoriteStatus && isFavorited && (
            <div
              style={{
                background: 'var(--golden-yellow)',
                color: 'var(--deep-black)',
                padding: '0.25rem 0.5rem',
                fontSize: '8px',
                fontFamily: 'var(--font-mono)',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                borderRadius: 'var(--border-radius)',
                border: '1px solid var(--charcoal)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              ⭐ FAV
            </div>
          )}

          <Button
            variant="link"
            onClick={toggleExpanded}
            style={{
              color: 'var(--cream)',
              textDecoration: 'none',
              padding: '0.25rem',
              fontSize: '12px',
            }}
          >
            {isExpanded ? '📖 COLLAPSE' : '📋 EXPAND'}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div
        onClick={toggleExpanded}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleExpanded();
          }
        }}
        role="button"
        tabIndex={0}
        style={{ cursor: 'pointer' }}
        aria-expanded={isExpanded}
        aria-label={`${isExpanded ? 'Collapse' : 'Expand'} details for ${userHobby.title}`}
      >
        <div style={{ marginBottom: '1rem' }}>
          {/* Description Preview/Full */}
          <div style={{ marginBottom: '1rem' }}>
            <div
              style={{
                fontSize: '10px',
                fontFamily: 'var(--font-mono)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: 'var(--warm-gray)',
                marginBottom: '0.5rem',
                borderBottom: '1px solid var(--light-gray)',
                paddingBottom: '0.25rem',
              }}
            >
              📝 Research Notes
            </div>

            <div
              style={{
                background: 'var(--cream)',
                padding: '1rem',
                border: '1px solid var(--light-gray)',
                borderRadius: 'var(--border-radius)',
                borderLeft: '4px solid var(--steel-blue)',
              }}
            >
              <p
                style={{
                  fontSize: '14px',
                  lineHeight: '1.5',
                  color: 'var(--charcoal)',
                  margin: 0,
                  fontFamily: 'var(--font-sans)',
                }}
              >
                {isExpanded ? userHobby.description || 'No detailed research notes available.' : `${(userHobby.description || 'No research notes available.').substring(0, 150)}${(userHobby.description || '').length > 150 ? '...' : ''}`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div
          style={{
            background: 'var(--light-gray)',
            padding: '1rem',
            border: '2px solid var(--charcoal)',
            borderRadius: 'var(--border-radius)',
            marginTop: '1rem',
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
            🎛️ Actions
          </h4>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {/* Favorite Toggle Button - Updated */}
            <Button
              className={`btn-analog ${isFavorited ? 'btn-analog-primary' : 'btn-analog-secondary'}`}
              onClick={handleToggleFavorite}
              disabled={isUpdatingFavorite || loadingFavoriteStatus}
              style={{
                fontSize: '11px',
                background: isFavorited ? 'var(--golden-yellow)' : 'var(--light-gray)',
                color: isFavorited ? 'var(--deep-black)' : 'var(--charcoal)',
                minWidth: '120px',
              }}
            >
              {getFavoriteButtonText()}
            </Button>

            {/* View Full Details */}
            <Link href={`/hobbies/${userHobby.id}`} passHref>
              <Button className="btn-analog btn-analog-primary" style={{ fontSize: '11px' }}>
                📖 View Details
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Border Effect */}
      <div
        style={{
          position: 'absolute',
          top: '4px',
          left: '4px',
          right: '4px',
          bottom: '4px',
          border: '1px solid rgba(74, 111, 165, 0.3)',
          borderRadius: 'var(--border-radius)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

HobbyCard.propTypes = {
  userHobby: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    category: PropTypes.string,
  }).isRequired,
  onFavoriteUpdate: PropTypes.func,
};

export default HobbyCard;
