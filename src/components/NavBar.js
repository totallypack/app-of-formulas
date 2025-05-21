/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import Link from 'next/link';
import { Navbar, Container, Nav, Button, Image } from 'react-bootstrap';
import { signOut } from '@/utils/auth';
import { useAuth } from '@/utils/context/authContext';

export default function NavBar() {
  const { user } = useAuth();

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <Link passHref href="/" className="navbar-brand">
          <div className="d-flex align-items-center">
            <span>Name</span>
          </div>
        </Link>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" />

        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Link className="nav-link" href="/aboutMain">
              About
            </Link>
            <Link className="nav-link" href="/profileMain">
              Profile
            </Link>
            <Link className="nav-link" href="/formulasMain">
              Formulas
            </Link>
            <Link className="nav-link" href="/hobbiesMain">
              Hobbies
            </Link>
            <Link className="nav-link" href="/instructionMain">
              Instruction
            </Link>
          </Nav>

          {user && (
            <div className="d-flex align-items-center">
              <div className="d-flex align-items-center me-3">
                {user.photoURL ? <Image src={user.photoURL} alt="Profile" width={36} height={36} roundedCircle className="navbar-profile-img" /> : <div className="navbar-profile-placeholder">{user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}</div>}
                <span className="text-white ms-2 d-none d-md-inline">{user.displayName}</span>
              </div>

              <Button variant="light" size="sm" onClick={signOut} className="btn-sign-out">
                Sign Out
              </Button>
            </div>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
