'use client';

/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/utils/context/authContext';
import { ref, get } from 'firebase/database';
import { database } from '@/utils/client';
import Link from 'next/link';
import UpdateUserData from '@/api/userData';
import Loading from '@/components/Loading';
import { Row, Col, Card } from 'react-bootstrap';

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
    return <Loading />;
  }

  if (!user) {
    return <div>Please log in to view your profile</div>;
  }

  return (
    <div>
      <div>{userProfile.photoURL && <img src={userProfile.photoURL} alt="Profile" width={100} height={100} className="rounded-full" />}</div>
      <h1>User Profile</h1>
      <div>Name: {userProfile.name || 'N/A'}</div>
      <div>Email: {userProfile.email || 'N/A'}</div>
      <div>Last Login: {userProfile.lastLogin ? new Date(userProfile.lastLogin).toLocaleString() : 'N/A'}</div>
      <Card className="border-0 shadow-sm mt-4">
        <Card.Body>
          <Row>
            <Col xs={6} className="text-center mb-3">
              <Link href="/formulas/new" passHref>
                Create Your Own Formula
              </Link>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
}
