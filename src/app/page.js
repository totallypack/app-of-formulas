'use client';

import { Button } from 'react-bootstrap';
import { signOut } from '@/utils/auth';
import { useAuth } from '@/utils/context/authContext';

function Home() {
  const { user } = useAuth();

  return (
    <div className="vintage-container">
      <div
        className="analog-card vintage-paper text-center"
        style={{
          maxWidth: '600px',
          margin: '0 auto',
          marginTop: '8vh',
        }}
      >
        {/* Header Section */}
        <div style={{ marginBottom: '2rem' }}>
          <div
            style={{
              background: 'var(--mint-green)',
              margin: '-1.5rem -1.5rem 1.5rem -1.5rem',
              padding: '1.5rem',
              border: '2px solid var(--charcoal)',
              borderBottom: 'none',
            }}
          >
            <h1 style={{ color: 'var(--deep-black)', margin: 0 }}>FORMULA APP</h1>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: 'var(--charcoal)',
                margin: '0.5rem 0 0 0',
              }}
            >
              ACTIVE SESSION ESTABLISHED
            </p>
          </div>
        </div>

        {/* Welcome Panel */}
        <div
          className="analog-glow"
          style={{
            padding: '2rem',
            background: 'var(--cream)',
            border: '2px solid var(--steel-blue)',
            marginBottom: '2rem',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-8px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'var(--cream)',
              padding: '0 1rem',
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              color: 'var(--steel-blue)',
            }}
          >
            RESEARCHER STATUS
          </div>

          <h2 style={{ color: 'var(--charcoal)', fontSize: '1.2rem' }}>Welcome, {user.displayName}!</h2>
          <p style={{ color: 'var(--warm-gray)', margin: '1rem 0' }}>Access Confirmed</p>

          {/* Quick Stats */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              marginTop: '2rem',
              padding: '1rem',
              background: 'var(--warm-white)',
              border: '1px solid var(--light-gray)',
              borderRadius: 'var(--border-radius)',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.2rem' }}>📚</div>
              <div style={{ fontSize: '10px', color: 'var(--warm-gray)' }}>FORMULAS</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.2rem' }}>🔬</div>
              <div style={{ fontSize: '10px', color: 'var(--warm-gray)' }}>RESEARCH</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.2rem' }}>📊</div>
              <div style={{ fontSize: '10px', color: 'var(--warm-gray)' }}>ANALYSIS</div>
            </div>
          </div>
        </div>

        <Button variant="danger" type="button" size="lg" className="btn-analog btn-analog-danger" onClick={signOut} style={{ width: '100%' }}>
          End Session
        </Button>
      </div>
    </div>
  );
}

export default Home;
