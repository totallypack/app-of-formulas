'use client';

/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/utils/context/authContext';
import { ref, get } from 'firebase/database';
import { database } from '@/utils/client';
import Link from 'next/link';
import UpdateUserData from '@/api/userData';
import { Row, Col, Button } from 'react-bootstrap';

export default function UserComponent() {
  const [userProfile, setUserProfile] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { user, userLoading } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (user && !userLoading) {
        if (typeof window !== 'undefined') {
          UpdateUserData({
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
          });
        }

        setIsLoading(true);
        try {
          const userRef = ref(database, `user/${user.uid}`);
          const snapshot = await get(userRef);

          if (snapshot.exists()) {
            setUserProfile(snapshot.val());
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setIsLoading(false);
        }
      } else if (!userLoading) {
        setIsLoading(false);
      }
    };

    fetchData();
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
          <h3 style={{ color: 'var(--vintage-red)' }}>🔒 Access Denied</h3>
          <p>Please authenticate to view researcher profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="vintage-container">
      <div className="analog-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
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

          <h1 style={{ color: 'var(--deep-black)', margin: 0, fontSize: '1.5rem' }}>RESEARCHER PROFILE</h1>
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
            Personnel Record
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
                    Researcher Name
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: 'var(--charcoal)',
                    }}
                  >
                    {userProfile.name || 'Unknown'}
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
                    Last Access
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--charcoal)',
                    }}
                  >
                    {userProfile.lastLogin ? new Date(userProfile.lastLogin).toLocaleString() : 'No previous sessions'}
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
                Tools
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
                    🧰 Create Formula
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
                    🧭 Browse Formulas
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
                    🔭 Browse Hobbies
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
                Active Researcher
              </div>
              <div
                style={{
                  fontSize: '8px',
                  color: 'var(--warm-gray)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                Clearance Level: FULL ACCESS
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}
