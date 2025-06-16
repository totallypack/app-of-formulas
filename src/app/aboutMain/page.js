'use client';

/* eslint-disable react/no-unescaped-entities */

import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Link from 'next/link';

export default function About() {
  return (
    <div className="vintage-container">
      <Container>
        <Row className="justify-content-center">
          <Col lg={8} md={10}>
            <div className="analog-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
              {/* Header Section */}
              <div
                style={{
                  background: 'var(--steel-blue)',
                  margin: '-1.5rem -1.5rem 2.5rem -1.5rem',
                  padding: '2.5rem 1.5rem',
                  border: '2px solid var(--charcoal)',
                  borderBottom: 'none',
                  textAlign: 'center',
                }}
              >
                <h1
                  style={{
                    color: 'var(--warm-white)',
                    margin: 0,
                    fontSize: '2.2rem',
                    marginBottom: '0.5rem',
                    fontWeight: '600',
                  }}
                >
                  About This Collection
                </h1>

                <div
                  style={{
                    height: '2px',
                    background: 'var(--warm-white)',
                    margin: '1rem auto',
                    width: '50%',
                  }}
                />

                <div
                  style={{
                    fontSize: '12px',
                    fontFamily: 'var(--font-mono)',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    color: 'var(--warm-white)',
                    opacity: 0.9,
                  }}
                >
                  Ingenuity & Independence
                </div>
              </div>

              {/* Main Content */}
              <div style={{ marginBottom: '2rem' }}>
                <div
                  style={{
                    background: 'var(--cream)',
                    padding: '2rem',
                    border: '2px solid var(--light-gray)',
                    borderRadius: 'var(--border-radius)',
                    fontSize: '15px',
                    lineHeight: '1.8',
                    color: 'var(--charcoal)',
                    fontFamily: 'Georgia, serif',
                  }}
                >
                  <p style={{ marginBottom: '1.5rem' }}>Invention, ingenuity, and independence have been part of the American tradition from the earliest days of the republic. Working alone, with tools of their own manufacture and with little or no formal technical training, ordinary citizens overcame a wilderness and started what was to become the greatest industrial nation in history.</p>

                  <p style={{ marginBottom: '1.5rem' }}>
                    The formulas found here were taken from a book called <em style={{ fontWeight: '600', color: 'var(--vintage-red)' }}>"Henley's Formulas For Home and Workshop."</em> That book was written for people living in the early decades of the twentieth century, so they may have a concise reference when they needed to know how something worked or how it could be made.
                  </p>

                  <p style={{ marginBottom: '1.5rem' }}>It gives us a glimpse of a confident, no-nonsense world, in which people believed that, with energy and intelligence, an individual could be master of his/her own life.</p>

                  <div
                    style={{
                      background: 'var(--mint-green)',
                      padding: '1.5rem',
                      border: '2px solid var(--charcoal)',
                      borderRadius: 'var(--border-radius)',
                      marginTop: '2rem',
                      textAlign: 'center',
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontWeight: '600',
                        fontSize: '16px',
                        color: 'var(--deep-black)',
                      }}
                    >
                      The hope with this webapp is that people today could experience some of that independence for themselves.
                    </p>
                  </div>
                </div>
              </div>

              {/* Source Information */}
              <div style={{ marginBottom: '2rem' }}>
                <h3
                  style={{
                    fontSize: '14px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    color: 'var(--charcoal)',
                    marginBottom: '1rem',
                    borderBottom: '2px solid var(--vintage-red)',
                    paddingBottom: '0.5rem',
                  }}
                >
                  Historical Reference
                </h3>

                <div
                  style={{
                    background: 'var(--light-gray)',
                    padding: '1.5rem',
                    border: '1px solid var(--warm-gray)',
                    borderRadius: 'var(--border-radius)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '13px',
                    lineHeight: '1.6',
                    color: 'var(--charcoal)',
                  }}
                >
                  <div style={{ marginBottom: '0.5rem' }}>
                    <strong>Source:</strong> Henley's Formulas For Home and Workshop
                  </div>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <strong>Era:</strong> Early 20th Century (1900s-1920s)
                  </div>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <strong>Purpose:</strong> Practical reference for everyday makers and inventors
                  </div>
                  <div>
                    <strong>Legacy:</strong> Preserving the spirit of American self-reliance
                  </div>
                </div>
              </div>

              {/* Navigation Links */}
              <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Link href="/formulasMain" passHref>
                    <Button className="btn-analog btn-analog-primary" style={{ fontSize: '12px', padding: '0.75rem 1.5rem' }}>
                      Browse Formulas →
                    </Button>
                  </Link>

                  <Link href="/hobbiesMain" passHref>
                    <Button className="btn-analog btn-analog-secondary" style={{ fontSize: '12px', padding: '0.75rem 1.5rem' }}>
                      Explore Subjects →
                    </Button>
                  </Link>
                </div>

                <div style={{ marginTop: '1.5rem' }}>
                  <div
                    style={{
                      fontSize: '11px',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--warm-gray)',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                    }}
                  >
                    Start Your Journey of Discovery
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
