import React from 'react';
import ActivityCard from './ActivityCard';

/**
 * ActivityResults Component
 *
 * Learning Note: This component uses .map() to transform an array of activities
 * into an array of ActivityCard components. The "key" prop is required by React
 * to efficiently track which items changed.
 *
 * Props:
 * - activities: Array of activity objects
 * - show: Boolean to control visibility
 */
function ActivityResults({ activities, show }) {
  if (!show || !activities || activities.length === 0) {
    return null;
  }

  return (
    <div className="results-container">
      <div className="results-header">
        <h2>Top 5 Recommendations</h2>
        <p className="results-subtitle">Perfect matches for your family</p>
      </div>
      <div className="activities-list">
        {activities.map((activity, index) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}

export default ActivityResults;
