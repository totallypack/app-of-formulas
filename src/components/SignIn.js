import React from 'react';
import { Button } from 'react-bootstrap';
import { signIn } from '@/utils/auth';

function Signin() {
  return (
    <div className="vintage-paper" style={{ minHeight: '100vh', position: 'relative' }}>
      {/* Vintage Background Pattern */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
          radial-gradient(circle at 20% 20%, rgba(116, 180, 155, 0.1) 2px, transparent 2px),
          radial-gradient(circle at 80% 80%, rgba(74, 111, 165, 0.1) 1px, transparent 1px),
          linear-gradient(45deg, transparent 49%, rgba(44, 44, 44, 0.05) 50%, transparent 51%)
        `,
          backgroundSize: '60px 60px, 40px 40px, 20px 20px',
          zIndex: 0,
        }}
      />

      <div className="vintage-container" style={{ position: 'relative', zIndex: 1 }}>
        <div
          className="analog-card text-center"
          style={{
            maxWidth: '450px',
            margin: '0 auto',
            marginTop: '15vh',
            background: 'var(--warm-white)',
            position: 'relative',
          }}
        >
          {/* Header */}
          <div style={{ marginBottom: '3rem' }}>
            <div
              style={{
                background: 'var(--mint-green)',
                margin: '-1.5rem -1.5rem 2rem -1.5rem',
                padding: '1.5rem',
                border: '2px solid var(--charcoal)',
                borderBottom: 'none',
              }}
            >
              <h1
                style={{
                  color: 'var(--deep-black)',
                  margin: 0,
                  fontSize: '1.8rem',
                  fontWeight: '700',
                }}
              >
                THE FORMULA APP
              </h1>
              <div
                style={{
                  height: '2px',
                  background: 'var(--charcoal)',
                  margin: '0.5rem auto',
                  width: '80%',
                }}
              />
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  color: 'var(--charcoal)',
                  margin: 0,
                }}
              >
                LEARNING & DEVELOPMENT SYSTEM
              </p>
            </div>

            {/* Vintage Icons */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem',
                margin: '2rem 0',
                fontSize: '2rem',
              }}
            >
              <div style={{ textAlign: 'center' }}>🔨</div>
              <div style={{ textAlign: 'center' }}>🔬</div>
              <div style={{ textAlign: 'center' }}>🍳</div>
            </div>
          </div>

          {/* Access Control Panel */}
          <div
            className="analog-glow"
            style={{
              padding: '2rem',
              background: 'var(--cream)',
              border: '2px dashed var(--steel-blue)',
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
              ACCESS CONTROL
            </div>

            <h2
              style={{
                color: 'var(--charcoal)',
                fontSize: '1.1rem',
                marginBottom: '1rem',
              }}
            >
              Access Required
            </h2>
            <p
              style={{
                color: 'var(--warm-gray)',
                margin: '1rem 0',
                fontSize: '13px',
              }}
            >
              Authenticate to access formula database and research tools
            </p>

            {/* Indicators */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '0.5rem',
                margin: '1.5rem 0',
              }}
            >
              <div className="category-badge category-chemical" style={{ fontSize: '9px' }}>
                Chemicals
              </div>
              <div className="category-badge category-edible" style={{ fontSize: '9px' }}>
                Foods
              </div>
              <div className="category-badge category-cleaner" style={{ fontSize: '9px' }}>
                Trade Secrets
              </div>
            </div>
          </div>

          {/* Access Button */}
          <Button
            type="button"
            size="lg"
            className="btn-analog btn-analog-primary"
            onClick={signIn}
            style={{
              width: '100%',
              fontSize: '14px',
              fontWeight: '600',
              padding: '1rem',
            }}
          >
            REQUEST ACCESS
          </Button>

          {/* Footer Note */}
          <p
            style={{
              marginTop: '2rem',
              fontSize: '10px',
              color: 'var(--warm-gray)',
              fontFamily: 'var(--font-mono)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Est. 1950 • Authorized Personnel Only
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, var(--mint-green) 0%, var(--steel-blue) 50%, var(--golden-yellow) 100%)',
          zIndex: 10,
        }}
      />
    </div>
  );
}

export default Signin;
