'use client';

/* eslint-disable react/no-unescaped-entities */

import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Link from 'next/link';

export default function FormulaInstructions() {
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
                  Formula Measurement Guide
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
                  Understanding the Parts System
                </div>
              </div>

              {/* Introduction */}
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
                  <p style={{ marginBottom: '1.5rem' }}>
                    It will be noticed that many of the formulas in this collection call for many <strong>parts</strong> of each ingredient rather than for so many ounces or other definite amounts. This system was designed for the practical worker who had but little equipment and needed flexibility in their preparations.
                  </p>

                  <div
                    style={{
                      background: 'var(--light-gray)',
                      padding: '1.5rem',
                      border: '1px dashed var(--charcoal)',
                      borderRadius: 'var(--border-radius)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '14px',
                      marginBottom: '1.5rem',
                    }}
                  >
                    <div style={{ fontWeight: '600', marginBottom: '0.5rem', color: 'var(--vintage-red)' }}>Example: Camphor Ice (Skin Balm)</div>
                    <div>
                      White Wax - <strong>16 parts</strong>
                    </div>
                    <div>
                      Benzoated Suet - <strong>48 parts</strong>
                    </div>
                    <div>
                      Camphor, Powdered - <strong>8 parts</strong>
                    </div>
                  </div>

                  <p style={{ marginBottom: '1.5rem' }}>Formulas stated in parts lend themselves more readily to variations in total quantity of finished product. As it may not always be necessary to make the exact quantity that a definite formula would produce, this system allows for easy scaling up or down.</p>

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
                      Formulas expressed in parts fall into three general classes based on the state of their ingredients.
                    </p>
                  </div>
                </div>
              </div>

              {/* Class 1: All Liquids */}
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
                  Class 1: All Ingredients are Liquid
                </h3>

                <div
                  style={{
                    background: 'var(--light-gray)',
                    padding: '1.5rem',
                    border: '1px solid var(--warm-gray)',
                    borderRadius: 'var(--border-radius)',
                    fontFamily: 'Georgia, serif',
                    fontSize: '14px',
                    lineHeight: '1.6',
                    color: 'var(--charcoal)',
                    marginBottom: '1rem',
                  }}
                >
                  <p style={{ marginBottom: '1rem' }}>The formula may call for parts and half parts as follows:</p>

                  <div
                    style={{
                      background: 'var(--cream)',
                      padding: '1rem',
                      border: '1px dashed var(--steel-blue)',
                      borderRadius: 'var(--border-radius)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '13px',
                      marginBottom: '1rem',
                    }}
                  >
                    <div>
                      Chromic acid - <strong>2½ parts</strong>
                    </div>
                    <div>
                      Ammonia - <strong>15 parts</strong>
                    </div>
                    <div>
                      Sulphuric acid - <strong>½ part</strong>
                    </div>
                    <div>
                      Cuprammonia sol. - <strong>30 parts</strong>
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'var(--mint-green)',
                      padding: '1rem',
                      border: '1px solid var(--charcoal)',
                      borderRadius: 'var(--border-radius)',
                      fontSize: '13px',
                      color: 'var(--deep-black)',
                    }}
                  >
                    <strong>💡 Scaling Guide:</strong> One part may be considered to mean <strong>one cupful</strong>
                    and 10 parts to mean <strong>10 cupfuls</strong>. For smaller quantities, substitute <strong>one spoonful</strong> for each part. For larger quantities, use <strong>one quart</strong>
                    for each part.
                  </div>
                </div>
              </div>

              {/* Class 2: All Solids */}
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
                  Class 2: All Ingredients are Solid
                </h3>

                <div
                  style={{
                    background: 'var(--light-gray)',
                    padding: '1.5rem',
                    border: '1px solid var(--warm-gray)',
                    borderRadius: 'var(--border-radius)',
                    fontFamily: 'Georgia, serif',
                    fontSize: '14px',
                    lineHeight: '1.6',
                    color: 'var(--charcoal)',
                    marginBottom: '1rem',
                  }}
                >
                  <p style={{ marginBottom: '1rem' }}>Where the ingredients are all solids, parts may be considered to mean ounces, pounds, or tons, depending upon the quantity desired as follows:</p>

                  <div
                    style={{
                      background: 'var(--cream)',
                      padding: '1rem',
                      border: '1px dashed var(--vintage-red)',
                      borderRadius: 'var(--border-radius)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '13px',
                      marginBottom: '1rem',
                    }}
                  >
                    <div>
                      Borax - <strong>2½ parts</strong> - <em>2½ ounces</em>
                    </div>
                    <div>
                      Glass - <strong>10 parts</strong> - <em>10 ounces</em>
                    </div>
                    <div>
                      Soda - <strong>3 parts</strong> - <em>3 ounces</em>
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'var(--mint-green)',
                      padding: '1rem',
                      border: '1px solid var(--charcoal)',
                      borderRadius: 'var(--border-radius)',
                      fontSize: '13px',
                      color: 'var(--deep-black)',
                    }}
                  >
                    <strong>⚖️ Weight Conversion:</strong> For solid ingredients, simply convert parts directly to your desired weight measurement (ounces, pounds, etc.) while maintaining the same ratios.
                  </div>
                </div>
              </div>

              {/* Class 3: Mixed */}
              <div style={{ marginBottom: '2rem' }}>
                <h3
                  style={{
                    fontSize: '14px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    color: 'var(--charcoal)',
                    marginBottom: '1rem',
                    borderBottom: '2px solid var(--charcoal)',
                    paddingBottom: '0.5rem',
                  }}
                >
                  Class 3: Combination of Liquids and Solids
                </h3>

                <div
                  style={{
                    background: 'var(--light-gray)',
                    padding: '1.5rem',
                    border: '1px solid var(--warm-gray)',
                    borderRadius: 'var(--border-radius)',
                    fontFamily: 'Georgia, serif',
                    fontSize: '14px',
                    lineHeight: '1.6',
                    color: 'var(--charcoal)',
                    marginBottom: '1rem',
                  }}
                >
                  <p style={{ marginBottom: '1rem' }}>The following formula calls for a certain number of parts of substances, some of which are solid and some liquid:</p>

                  <div
                    style={{
                      background: 'var(--cream)',
                      padding: '1rem',
                      border: '1px dashed var(--charcoal)',
                      borderRadius: 'var(--border-radius)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '13px',
                      marginBottom: '1rem',
                    }}
                  >
                    <div>
                      Beeswax - <strong>8 parts</strong> - <em>8 ounces avoirdupois (weight)</em>
                    </div>
                    <div>
                      Water - <strong>56 parts</strong> - <em>56 fluid ounces</em>
                    </div>
                    <div>
                      Potash Carbonate - <strong>4 parts</strong> - <em>4 ounces avoirdupois (weight)</em>
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'var(--mint-green)',
                      padding: '1rem',
                      border: '1px solid var(--charcoal)',
                      borderRadius: 'var(--border-radius)',
                      fontSize: '13px',
                      color: 'var(--deep-black)',
                    }}
                  >
                    <strong>⚠️ Special Note:</strong> In cases where liquids are of such nature that they cannot be measured in fluid ounces, it is necessary to weigh them just as solids are weighed. Thick tar would be such a substance, and in this case a vessel is counterbalanced on the scale and sufficient additional weights added to the pan to make up the required amount.
                  </div>
                </div>
              </div>

              {/* Historical Context */}
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
                  Historical Context
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
                    <strong>Origin:</strong> Henley's Formulas For Home and Workshop
                  </div>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <strong>Era:</strong> Early 20th Century (1900s-1920s)
                  </div>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <strong>Purpose:</strong> Practical measurements for everyday makers
                  </div>
                  <div>
                    <strong>Philosophy:</strong> Flexibility and resourcefulness in crafting
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

                  <Link href="/formulas/new" passHref>
                    <Button className="btn-analog btn-analog-secondary" style={{ fontSize: '12px', padding: '0.75rem 1.5rem' }}>
                      Create New Formula →
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
                    Master the Art of Measurement
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
