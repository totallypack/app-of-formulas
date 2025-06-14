'use client';

/* eslint-disable react/no-unescaped-entities */

import React, { useEffect, useState } from 'react';
import { getEveryRecipe, getRecipe } from '@/api/recipeData';
import RecipeCard from '@/components/recipeCard';
import { useAuth } from '@/utils/context/authContext';
import { Container, Row, Col, Form, InputGroup, Button, Tabs, Tab } from 'react-bootstrap';

export default function FormulaMain() {
  const [recipes, setRecipes] = useState([]);
  const [userRecipes, setUserRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const { user } = useAuth();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const allRecipes = await getEveryRecipe();
        console.log('FormulaMain received recipes:', allRecipes);

        const missingKeys = allRecipes.filter((recipe) => !recipe.id);
        if (missingKeys.length > 0) {
          console.warn('Some formulas are missing id:', missingKeys);
        }

        setRecipes(allRecipes);

        const myRecipes = await getRecipe(user.uid);
        console.log('FormulaMain received user recipes:', myRecipes);
        setUserRecipes(myRecipes);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [user.uid]);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      console.log('Refreshing recipes after update/delete');

      const [allRecipes, myRecipes] = await Promise.all([getEveryRecipe(), getRecipe(user.uid)]);

      setRecipes(allRecipes || []);
      setUserRecipes(myRecipes || []);
      console.log(`Fetched ${allRecipes?.length || 0} total recipes and ${myRecipes?.length || 0} user recipes`);
    } catch (error) {
      console.error('Error updating recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecipes = recipes.filter((formula) => formula?.title?.toLowerCase().includes(searchTerm.toLowerCase()) || formula?.description?.toLowerCase().includes(searchTerm.toLowerCase()));

  const displayedRecipes = activeTab === 'all' ? filteredRecipes : userRecipes;

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-5">
          <p>Loading Formulas...</p>
        </div>
      );
    }

    if (displayedRecipes.length === 0) {
      if (activeTab === 'all') {
        return (
          <div className="text-center py-5">
            <p>No Formulas found matching your search.</p>
          </div>
        );
      }
      return (
        <div className="text-center py-5">
          <p>You haven't created any formulas yet.</p>
          <Button variant="primary" as="a" href="formula/new" className="mt-3">
            Create Your First Formula
          </Button>
        </div>
      );
    }

    return (
      <Row>
        {displayedRecipes.map((formula) => (
          <Col key={formula?.id || Math.random()} md={4} className="mb-4">
            <RecipeCard recipeObj={formula} onUpdate={handleUpdate} />
          </Col>
        ))}
      </Row>
    );
  };

  return (
    <div className="formula-main-page">
      <Container className="py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>FORMULAS</h1>
          <Button variant="primary" as="a" href="/formulas/new">
            Create New Formula
          </Button>
        </div>

        <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4">
          <Tab eventKey="all" title="All Formulas">
            {/* Search Bar */}
            <div className="mb-4">
              <InputGroup>
                <Form.Control placeholder="Search Formulas..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                <Button variant="outline-secondary" onClick={() => setSearchTerm('')}>
                  Clear
                </Button>
              </InputGroup>
            </div>
          </Tab>
          <Tab eventKey="yours" title="Your Formulas">
            <p className="mb-4">Formulas you've created</p>
          </Tab>
        </Tabs>

        {renderContent()}
      </Container>

      {/* Footer */}
      <footer className="text-white py-4">
        <Container className="text-center">
          <p className="mb-0">© 2025 App of Formulas. All rights reserved.</p>
        </Container>
      </footer>
    </div>
  );
}
