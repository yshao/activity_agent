# Family Activity Finder - Project Specification

## Overview
A web application that helps parents discover family-friendly activities based on their location, children's ages, availability, and preferences. Returns 5 curated recommendations with engaging descriptions.

## Requirements

### Core Features
1. **Input Collection**: Simple form to gather:
   - City/location
   - Kids' ages
   - Availability (e.g., "Saturday afternoon")
   - Travel distance (miles willing to drive)
   - Other preferences (optional text input)

2. **Activity Recommendations**: Display 5 activities with:
   - Emoji icon
   - Bold title
   - 2-4 sentence description (location, age-appropriateness, practical details)

### Non-Functional Requirements
- Mobile-responsive design
- Fast response time (<5 seconds)
- Simple, family-friendly interface

## Tech Stack

### Frontend
- **React** - UI components and state management
- **CSS** - Styling (keep it simple, no framework required initially)

### Backend
- **Node.js + Express** - API server
- **Claude Messages API** - AI-powered activity recommendations
- **Web Search Tool** - Real-time activity data (Claude's built-in web search)

### Development
- **Vite** - Fast development build tool for React
- **npm** - Package management

## Design Guidelines

### Visual Style
- Clean, minimal interface
- Family-friendly color palette (warm, inviting colors)
- Large, easy-to-read text
- Clear visual hierarchy

### UX Principles
- Single-page experience (no complex navigation)
- Progressive disclosure (show results after form submission)
- Mobile-first design
- Clear error messages and loading states

### Accessibility
- Semantic HTML
- Sufficient color contrast
- Keyboard navigation support
- Screen reader friendly

## Milestones

### Milestone 1: UI Setup with Dummy Data
**Goal**: Build functional UI with mock recommendations

**Deliverables**:
- React app initialized with Vite
- Input form with all 5 fields
- Results display component
- 5 hardcoded dummy activities for testing
- Basic styling and layout
- Responsive design for mobile and desktop

**Success Criteria**: Users can fill out form and see dummy recommendations displayed properly

---

### Milestone 2: Claude API Integration
**Goal**: Connect to Claude Messages API with web search tool

**Deliverables**:
- Express backend API server
- `/api/activities` endpoint
- Claude Messages API integration
- Web search tool enabled for real-time data
- Prompt engineering for quality recommendations
- Frontend-backend connection
- Loading and error states

**Success Criteria**: App returns 5 real, relevant activity recommendations based on user input

---

### Milestone 3: Polish and Deployment
**Goal**: Production-ready application

**Deliverables**:
- Error handling and validation
- Loading animations
- Improved styling and UX polish
- Environment variable management
- API rate limiting
- Deploy frontend (Vercel/Netlify)
- Deploy backend (Railway/Render)
- Documentation and README

**Success Criteria**: App is live, stable, and ready for real users

## Future Enhancements (Post-MVP)
- Save favorite activities
- Share recommendations via link
- Filter by activity type (indoor/outdoor, free/paid)
- Weather-aware suggestions
- User accounts and history
