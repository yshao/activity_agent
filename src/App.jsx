import React, { useState } from 'react';
import ActivityForm from './components/ActivityForm';
import ActivityResults from './components/ActivityResults';
import './App.css';

/**
 * App Component - Main Application Container
 *
 * Learning Note: This is the "parent component" that coordinates between
 * the form and results. It now includes API integration with Claude backend:
 * - Loading state (shows spinner while waiting)
 * - Error state (shows error messages if API fails)
 * - Success state (displays real activity recommendations)
 */
function App() {
  const [showResults, setShowResults] = useState(false);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * handleSearch: Called when user submits the form
   *
   * Learning Note: This function now makes a real API call to our backend server.
   * The backend calls Claude's API with web search to find real activities.
   * We use async/await to handle the asynchronous network request.
   *
   * @param {Object} formData - The form values from ActivityForm
   */
  const handleSearch = async (formData) => {
    console.log('Form submitted with:', formData);

    // Reset states
    setLoading(true);
    setError(null);
    setShowResults(false);

    try {
      // Call backend API
      // Learning Note: fetch() is JavaScript's built-in function for making HTTP requests
      const response = await fetch('http://localhost:5000/api/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          city: formData.city,
          kidsAges: formData.kidAges,
          availability: formData.availability,
          milesRange: formData.maxDistance,
          otherPreferences: formData.preferences,
        }),
      });

      // Check if request was successful
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch activities');
      }

      // Parse JSON response
      const data = await response.json();

      // Update state with activities
      setActivities(data.activities);
      setShowResults(true);
    } catch (err) {
      console.error('Error fetching activities:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      // Learning Note: finally block runs whether try succeeds or fails
      setLoading(false);
    }
  };

  /**
   * handleNewSearch: Reset the form to start a new search
   */
  const handleNewSearch = () => {
    setShowResults(false);
    setActivities([]);
    setError(null);
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
          <ActivityForm onSearch={handleSearch} disabled={loading} />
        </div>

        <div className="right-column">
          {/* Loading State */}
          {loading && (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Finding perfect activities for your family...</p>
              <p className="loading-subtext">Using AI to search for real-time recommendations</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="error-container">
              <div className="error-icon">⚠️</div>
              <h3>Oops! Something went wrong</h3>
              <p className="error-message">{error}</p>
              <button className="retry-btn" onClick={handleNewSearch}>
                Try Again
              </button>
            </div>
          )}

          {/* Results */}
          {!loading && !error && (
            <ActivityResults activities={activities} show={showResults} />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
