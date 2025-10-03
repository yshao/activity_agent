import React from 'react';

/**
 * ActivityCard Component
 *
 * Learning Note: This is a "presentational component" - it only displays data
 * passed to it via "props" (properties). It doesn't manage any state itself.
 *
 * Props:
 * - activity: Object containing emoji, title, description, location, distance
 * - index: Number for the ranking (#1, #2, etc.)
 */
function ActivityCard({ activity, index }) {
  return (
    <div className="activity-card">
      <div className="activity-number">#{index + 1}</div>
      <div className="activity-content">
        <div className="activity-header">
          <span className="activity-emoji">{activity.emoji}</span>
          <h3 className="activity-title">{activity.title}</h3>
        </div>
        <p className="activity-description">{activity.description}</p>
        <div className="activity-meta">
          <span className="activity-location">📍 {activity.location}</span>
          <span className="activity-distance">🚗 {activity.distance}</span>
        </div>
      </div>
    </div>
  );
}

export default ActivityCard;
