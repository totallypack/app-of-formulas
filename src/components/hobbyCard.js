import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import PropTypes from 'prop-types';

function HobbyCard({ userHobby }) {
  return (
    <div className="card shadow-sm" style={{ maxWidth: '400px' }}>
      <div className="card-header bg-secondary text-white">
        <h5 className="card-title mb-0">User Hobby</h5>
      </div>

      <div className="card-body text-center">
        <div className="card-text">
          <div className="list-group list-group-flush">
            <div className="list-group-item d-flex justify-content-between">
              <strong>Title:</strong>
              <span>{userHobby.title || 'N/A'}</span>
            </div>
            <div className="list-group-item d-flex justify-content-between">
              <strong>Desciption:</strong>
              <span>{userHobby.desciption || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

HobbyCard.propTypes = {
  userHobby: PropTypes.shape({
    title: PropTypes.string,
    desciption: PropTypes.string,
  }).isRequired,
};

export default HobbyCard;
