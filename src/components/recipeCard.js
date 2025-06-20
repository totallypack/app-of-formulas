'use client';

/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import { deleteRecipe } from '@/api/recipeData';
import { toggleFavorite, isItemFavorited } from '@/api/favoritesData';
import { useAuth } from '@/utils/context/authContext';

export default function RecipeCard({ recipeObj, onUpdate }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [loadingFavoriteStatus, setLoadingFavoriteStatus] = useState(true);

  console.log('RecipeCard received object:', recipeObj);
  console.log('RecipeCard id:', recipeObj?.id);
  const { user } = useAuth();
  const isCreator = user?.uid === (recipeObj?.uid || recipeObj?.userId);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (recipeObj?.id) {
        setLoadingFavoriteStatus(true);
        try {
          const favoriteStatus = await isItemFavorited(recipeObj.id);
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
  }, [recipeObj?.id]);

  if (!recipeObj) {
    return (
      <div className="recipe-card-analog">
        <div className="card-body analog-glow" style={{ textAlign: 'center', padding: '2rem' }}>
          <div className="loading-analog">
            <p style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Loading Formula...</p>
          </div>
        </div>
      </div>
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

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!recipeObj.id) {
      alert('Cannot favorite this recipe: Missing recipe ID');
      return;
    }

    setIsUpdating(true);
    try {
      console.log('Toggling favorite for recipe:', recipeObj.id, 'Current status:', isFavorited);

      const newFavoriteStatus = await toggleFavorite(recipeObj.id, 'recipe', {
        category: recipeObj.category,
        title: recipeObj.title,
      });

      setIsFavorited(newFavoriteStatus);
      console.log('Recipe favorite status updated successfully:', newFavoriteStatus);

      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error updating favorite status:', error);
      alert('An error occurred while updating favorite status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="recipe-card-analog" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Card Header */}
      <div
        className="card-header"
        style={{
          background: 'var(--mint-green)',
          borderBottom: '2px solid var(--charcoal)',
          padding: '1rem',
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h5
            className="card-title"
            style={{
              margin: 0,
              fontSize: '14px',
              lineHeight: '1.2',
              flex: 1,
            }}
          >
            {recipeObj.title}
          </h5>

          {/* Badge */}
          <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0, marginLeft: '0.5rem' }}>
            <div className={`category-badge category-${recipeObj.category}`}>{recipeObj.category}</div>
          </div>
        </div>
      </div>

      {/* Image Section */}
      <div
        style={{
          height: '160px',
          overflow: 'hidden',
          position: 'relative',
          background: 'var(--light-gray)',
          borderBottom: '1px solid var(--charcoal)',
        }}
      >
        {recipeObj.image ? (
          <img
            src={recipeObj.image}
            alt={recipeObj.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'sepia(20%) contrast(1.1)',
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
              fontSize: '2rem',
            }}
          >
            {recipeObj.category === 'chemical' && '⚗️'}
            {recipeObj.category === 'edible' && '🍽️'}
            {recipeObj.category === 'cleaner' && '🧽'}
            {!recipeObj.category && '📄'}
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

      {/* Card Body */}
      <div
        className="card-body"
        style={{
          padding: '1rem',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--warm-white)',
        }}
      >
        {/* Description */}
        <div style={{ flex: 1, marginBottom: '1rem' }}>
          <p
            style={{
              fontSize: '12px',
              color: 'var(--warm-gray)',
              margin: 0,
              lineHeight: '1.4',
            }}
          >
            {recipeObj.description?.substring(0, 120)}
            {recipeObj.description?.length > 120 ? '...' : ''}
          </p>
        </div>

        {/* Control Panel */}
        <div style={{ marginTop: 'auto' }}>
          {/* Primary Action - View Formula */}
          <Link href={`/formulas/${recipeObj.id}`} passHref>
            <Button
              variant="primary"
              className="btn-analog btn-analog-primary"
              style={{
                width: '100%',
                marginBottom: '0.5rem',
                fontSize: '10px',
              }}
            >
              📖 VIEW FORMULA
            </Button>
          </Link>

          {/* Secondary Actions Row */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Button
              variant={isFavorited ? 'warning' : 'outline-secondary'}
              className={`btn-analog ${isFavorited ? 'btn-analog-primary' : 'btn-analog-secondary'}`}
              onClick={handleToggleFavorite}
              disabled={isUpdating || loadingFavoriteStatus}
              style={{
                flex: 1,
                fontSize: '10px',
                background: isFavorited ? 'var(--golden-yellow)' : 'var(--light-gray)',
                color: isFavorited ? 'var(--deep-black)' : 'var(--charcoal)',
              }}
              type="button"
            >
              {(() => {
                if (loadingFavoriteStatus) return '⏳ ...';
                if (isFavorited) return '⭐ FAV';
                return '☆ FAV';
              })()}
            </Button>

            {/* Creator Actions */}
            {isCreator && (
              <>
                <Link href={`/formulas/edit/${recipeObj.id}`} passHref style={{ flex: 1 }}>
                  <Button
                    variant="outline-secondary"
                    className="btn-analog btn-analog-secondary"
                    style={{
                      width: '100%',
                      fontSize: '10px',
                    }}
                    type="button"
                  >
                    ✏️ EDIT
                  </Button>
                </Link>
                <Button
                  variant="outline-danger"
                  className="btn-analog btn-analog-danger"
                  onClick={deleteThisRecipe}
                  style={{
                    flex: 1,
                    fontSize: '10px',
                  }}
                  type="button"
                >
                  🗑️ DELETE
                </Button>
              </>
            )}
          </div>

          {/* Status Indicators */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Creator Badge */}
            {isCreator && (
              <div
                style={{
                  fontSize: '8px',
                  color: 'var(--mint-green)',
                  fontFamily: 'var(--font-mono)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                ● Your Formula
              </div>
            )}

            {/* Favorite Status */}
            <div
              style={{
                fontSize: '8px',
                color: 'var(--warm-gray)',
                fontFamily: 'var(--font-mono)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginLeft: 'auto',
              }}
            >
              {!loadingFavoriteStatus && isFavorited ? '⭐ Favorited' : ''}
            </div>
          </div>
        </div>
      </div>

      {/* Border Effect */}
      <div
        style={{
          position: 'absolute',
          top: '4px',
          left: '4px',
          right: '4px',
          bottom: '4px',
          border: '1px solid rgba(116, 180, 155, 0.3)',
          borderRadius: 'var(--border-radius)',
          pointerEvents: 'none',
        }}
      />
    </div>
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
    userId: PropTypes.string,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
};
