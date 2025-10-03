# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Family Activity Finder** - A web application that helps parents discover family-friendly activities based on location, children's ages, availability, and travel preferences. Returns 5 AI-curated recommendations using Claude's Messages API with web search capabilities.

## Architecture

### Frontend (React + Vite)
- Single-page application with minimal navigation
- Component hierarchy: `App.jsx` → `ActivityForm.jsx` + `ActivityResults.jsx` → `ActivityCard.jsx`
- State management using React hooks (useState for form inputs and results)
- Mobile-first responsive design with vanilla CSS

### Backend (Node.js + Express)
- Express API server with single endpoint: `/api/activities`
- Claude Messages API integration with web search tool enabled
- Receives 5 user inputs (city, kids' ages, availability, miles range, preferences)
- Returns 5 formatted activity recommendations

### Claude API Integration
- **Model**: `claude-sonnet-4-5-20250929`
- **Web Search Tool**: `web_search_20250520` (critical for finding real-time, location-specific activities)
- **Prompt Template**: See `prompt.md` for the exact prompt structure and variables
- **Output Format**: Each activity must include emoji + bold title + 2-4 sentence description

## Development Workflow

### Milestones
This project follows a 3-milestone approach:

1. **Milestone 1** (Current): UI with dummy data - Build React frontend with hardcoded activities
2. **Milestone 2**: Claude API integration - Add Express backend and connect to Claude Messages API
3. **Milestone 3**: Polish and deployment - Error handling, loading states, production deployment

See `todo.md` for detailed Milestone 1 task breakdown.

### Project Initialization
```bash
# Frontend setup (Milestone 1)
npm create vite@latest
npm install
npm run dev

# Backend setup (Milestone 2)
npm init -y
npm install express @anthropic-ai/sdk cors dotenv
node server.js
```

### Running the Application
```bash
# Development (after setup)
npm run dev              # Frontend dev server (Vite)
node server.js           # Backend API server (Milestone 2+)
```

## Key Technical Details

### Required Input Fields
1. City/location (text)
2. Kids' ages (comma-separated, e.g., "5, 8, 10")
3. Availability (freeform text, e.g., "Saturday afternoon")
4. Miles range (number)
5. Other preferences (optional textarea)

### Activity Recommendation Format
Each recommendation must follow this structure:
- Emoji icon (relevant to activity type: 🎨 🌳 ⚽ 🎭 🏊)
- Bold title with specific venue/event name
- 2-4 sentences covering: what it is, location, age-appropriateness, practical details (cost/hours)

### Design Constraints
- Simple, family-friendly interface with warm colors
- <5 second response time requirement
- Progressive disclosure (results shown after form submission)
- Accessible (semantic HTML, keyboard navigation, screen reader support)

## Special Instructions for Claude Code

**Learning Mode**: This project is being developed by a product manager learning to become more technical.

When implementing features or making changes:
1. **Explain the "why"**: Share reasoning behind architectural decisions
2. **Define technical terms**: Explain concepts like "state management", "API endpoints", "props", etc.
3. **Show connections**: Explain how frontend and backend communicate
4. **Teach best practices**: Point out why certain patterns are used (e.g., why we use environment variables for API keys)
5. **Provide context**: When adding dependencies or tools, explain what they do and why they're needed

Example: Instead of just adding `useState`, explain: "We're using React's `useState` hook here to store the form input values in memory. This allows the form to be interactive - when users type, React re-renders the component with the updated values."

## Important Files
- `spec.md` - Complete project specification and requirements
- `prompt.md` - Claude API prompt template with exact formatting requirements
- `todo.md` - Milestone 1 task checklist (update as tasks are completed)
