import React, { useState } from 'react';

/**
 * ActivityForm Component
 *
 * Learning Note: This is a "controlled component" - React controls the form values.
 * We use "useState" to store each input field's value in memory. When users type,
 * we update the state, which causes React to re-render the component with new values.
 *
 * Props:
 * - onSearch: Function to call when form is submitted (passed from parent)
 * - disabled: Boolean to disable form during API loading
 */
function ActivityForm({ onSearch, disabled }) {
  // State for each form field
  const [city, setCity] = useState('');
  const [kidAges, setKidAges] = useState('');
  const [availability, setAvailability] = useState('');
  const [maxDistance, setMaxDistance] = useState(10);
  const [preferences, setPreferences] = useState('');

  /**
   * handleSubmit: Prevents default form behavior (page reload)
   * and calls the parent's onSearch function with all form data
   */
  const handleSubmit = (e) => {
    e.preventDefault(); // Stops the browser from reloading the page

    // Package all form data into an object
    const formData = {
      city,
      kidAges,
      availability,
      maxDistance,
      preferences
    };

    // Call the parent component's onSearch function
    onSearch(formData);
  };

  const fillExample = () => {
    setCity('San Francisco');
    setKidAges('7');
    setAvailability('this Saturday');
    setMaxDistance(15);
    setPreferences('outdoor activities, family-friendly');
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h2>Find Activities</h2>
        <p className="form-subtitle">Tell us about your family's preferences</p>
        <button type="button" className="example-btn" onClick={fillExample}>
          Try Example
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* City Input */}
        <div className="form-group">
          <label htmlFor="city">
            <span className="label-icon">📍</span> City
          </label>
          <input
            type="text"
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="San Francisco"
            required
          />
        </div>

        {/* Kid Ages Input */}
        <div className="form-group">
          <label htmlFor="kidAges">
            <span className="label-icon">👶</span> Kid Ages
          </label>
          <input
            type="text"
            id="kidAges"
            value={kidAges}
            onChange={(e) => setKidAges(e.target.value)}
            placeholder="7"
            required
          />
        </div>

        {/* Date & Time Availability */}
        <div className="form-group">
          <label htmlFor="availability">
            <span className="label-icon">🗓️</span> Date & Time Availability
          </label>
          <input
            type="text"
            id="availability"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            placeholder="sunday (tomorrow)"
            required
          />
        </div>

        {/* Maximum Distance Slider */}
        <div className="form-group">
          <label htmlFor="maxDistance">
            <span className="label-icon">🚗</span> Maximum Distance:{' '}
            <span className="distance-value">{maxDistance} miles</span>
          </label>
          <input
            type="range"
            id="maxDistance"
            min="1"
            max="50"
            value={maxDistance}
            onChange={(e) => setMaxDistance(e.target.value)}
            className="distance-slider"
          />
          <div className="slider-labels">
            <span>1 mile</span>
            <span>25 miles</span>
            <span>50 miles</span>
          </div>
        </div>

        {/* Optional Preferences */}
        <div className="form-group">
          <label htmlFor="preferences">
            <span className="label-icon">✨</span> Optional Preferences
          </label>
          <textarea
            id="preferences"
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            placeholder="e.g., indoor activities, educational, budget-friendly"
            rows="3"
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="search-button" disabled={disabled}>
          {disabled ? '⏳ Searching...' : '🔍 Search Activities'}
        </button>
      </form>
    </div>
  );
}

export default ActivityForm;
