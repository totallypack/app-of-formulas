import React from 'react';
import Link from 'next/link';
import { Navbar, Container, Nav, Button, Image } from 'react-bootstrap';
import { signOut } from '@/utils/auth';
import { useAuth } from '@/utils/context/authContext';

export default function NavBar() {
  const { user } = useAuth();

  return (
    <Navbar collapseOnSelect expand="lg" className="navbar-analog">
      <Container>
        <Link passHref href="/" className="navbar-brand">
          <div className="d-flex align-items-center">
            <span>FORMULA APP</span>
          </div>
        </Link>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" />

        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Link className="nav-link" href="/aboutMain">
              About
            </Link>
            <Link className="nav-link" href="/instructionMain">
              Instruction
            </Link>
            <Link className="nav-link" href="/formulasMain">
              Formulas
            </Link>
            <Link className="nav-link" href="/hobbiesMain">
              Subjects
            </Link>
          </Nav>

          {user && (
            <div className="d-flex align-items-center">
              <div className="d-flex align-items-center me-3">
                <Link className="nav-link" href="/profileMain">
                  {user.photoURL ? (
                    <Image src={user.photoURL} alt="Profile" width={36} height={36} roundedCircle className="navbar-profile-img" style={{ border: '2px solid var(--mint-green)' }} />
                  ) : (
                    <div
                      className="navbar-profile-placeholder analog-glow"
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'var(--mint-green)',
                        color: 'var(--charcoal)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '600',
                        border: '2px solid var(--charcoal)',
                      }}
                    >
                      {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <span className="text-white ms-2 d-none d-md-inline" style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                    {user.displayName}
                  </span>
                </Link>
              </div>

              <Button variant="light" size="sm" onClick={signOut} className="btn-analog btn-analog-danger" style={{ fontSize: '10px' }}>
                Sign Out
              </Button>
            </div>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
