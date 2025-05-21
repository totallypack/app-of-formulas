/* eslint-disable @next/next/no-img-element */

import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import PropTypes from 'prop-types';

function UserProfileCard({ userProfile }) {
  return (
    <div className="card shadow-sm" style={{ maxWidth: '400px' }}>
      <div className="card-header bg-secondary text-white">
        <h5 className="card-title mb-0">User Profile</h5>
      </div>

      <div className="card-body text-center">
        {userProfile.photoURL && (
          <div className="mb-3">
            <img src={userProfile.photoURL} alt="Profile" width={100} height={100} className="rounded-circle border shadow-sm" />
          </div>
        )}

        <div className="card-text">
          <div className="list-group list-group-flush">
            <div className="list-group-item d-flex justify-content-between">
              <strong>Name:</strong>
              <span>{userProfile.name || 'N/A'}</span>
            </div>
            <div className="list-group-item d-flex justify-content-between">
              <strong>Email:</strong>
              <span>{userProfile.email || 'N/A'}</span>
            </div>
            <div className="list-group-item d-flex justify-content-between">
              <strong>Last Login:</strong>
              <span>{userProfile.lastLogin ? new Date(userProfile.lastLogin).toLocaleString() : 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

UserProfileCard.propTypes = {
  userProfile: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    lastLogin: PropTypes.string,
    photoURL: PropTypes.string,
  }).isRequired,
};

export default UserProfileCard;
