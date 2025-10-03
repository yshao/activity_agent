import React, { useState } from 'react';
import ActivityForm from './components/ActivityForm';
import ActivityResults from './components/ActivityResults';
import { dummyActivities } from './dummyData';
import './App.css';

/**
 * App Component - Main Application Container
 *
 * Learning Note: This is the "parent component" that coordinates between
 * the form and results. It manages the application's main state:
 * - Whether to show results
 * - Which activities to display
 *
 * In software architecture, this is called "lifting state up" - we keep
 * the state in the parent so it can be shared between child components.
 */
function App() {
  const [showResults, setShowResults] = useState(false);
  const [activities, setActivities] = useState([]);

  /**
   * handleSearch: Called when user submits the form
   *
   * Learning Note: For Milestone 1, we're just using dummy data.
   * In Milestone 2, we'll replace this with an API call to Claude.
   *
   * @param {Object} formData - The form values from ActivityForm
   */
  const handleSearch = (formData) => {
    console.log('Form submitted with:', formData);

    // For now, just show the dummy data
    // In Milestone 2, this will make an API call to the backend
    setActivities(dummyActivities);
    setShowResults(true);
  };

  /**
   * handleNewSearch: Reset the form to start a new search
   */
  const handleNewSearch = () => {
    setShowResults(false);
    setActivities([]);
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="logo-container">
          <div className="logo">🎯</div>
          <div className="header-text">
            <h1>Family Activity Finder</h1>
            <p>Discover perfect activities for your family</p>
          </div>
        </div>
        {showResults && (
          <button className="new-search-btn" onClick={handleNewSearch}>
            New Search
          </button>
        )}
      </header>

      {/* Main Content - Two Column Layout */}
      <main className="app-main">
        <div className="left-column">
          <ActivityForm onSearch={handleSearch} />
        </div>

        <div className="right-column">
          <ActivityResults activities={activities} show={showResults} />
        </div>
      </main>
    </div>
  );
}

export default App;
