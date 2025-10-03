# Family Activity Finder

A web application that helps parents discover family-friendly activities based on location, children's ages, availability, and travel preferences.

## Current Status: Milestone 2 Complete ✅

**Milestone 2**: Full-stack application with Claude API integration and web search

## Features

- 🔍 Location-based activity search
- 👶 Age-appropriate recommendations
- 📅 Availability-aware suggestions
- 🚗 Customizable travel range
- 🎯 Preference filtering

## Tech Stack

- **Frontend**: React + Vite
- **Backend**: Node.js + Express + Anthropic SDK
- **AI**: Claude Sonnet 4.5 with web search tool
- **Styling**: Vanilla CSS (mobile-first)

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Anthropic API key ([Get one here](https://console.anthropic.com/settings/keys))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd parent_app
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Set up environment variables**
   ```bash
   cd server
   cp .env.example .env
   # Edit .env and add your ANTHROPIC_API_KEY
   ```

### Running the Application

**Option 1: Run frontend and backend separately**

Terminal 1 (Backend):
```bash
npm run server
```

Terminal 2 (Frontend):
```bash
npm run dev
```

**Option 2: Run both together**
```bash
npm run dev:all
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

## Project Structure

```
parent_app/
├── src/                          # Frontend React application
│   ├── components/
│   │   ├── ActivityForm.jsx      # Input form with 5 fields
│   │   ├── ActivityResults.jsx   # Display activity recommendations
│   │   └── ActivityCard.jsx      # Individual activity card
│   ├── App.jsx                   # Main app component with API integration
│   ├── App.css                   # Styles including loading/error states
│   └── main.jsx                  # Entry point
├── server/                       # Backend Express server
│   ├── server.js                 # Express API + Claude integration
│   ├── .env.example              # Environment variables template
│   └── package.json              # Backend dependencies
├── CLAUDE.md                     # Claude Code project instructions
├── spec.md                       # Complete project specification
├── prompt.md                     # Claude API prompt template
└── todo.md                       # Milestone task checklist
```

## Milestones

- [x] **Milestone 1**: UI with dummy data
- [x] **Milestone 2**: Backend Express server + Claude Messages API integration
- [ ] **Milestone 3**: Production deployment and optimization

## How It Works

1. **User Input**: User fills out the form with city, kids' ages, availability, distance, and preferences
2. **API Call**: Frontend sends POST request to backend `/api/activities` endpoint
3. **Claude AI**: Backend calls Claude Sonnet 4.5 with web search tool enabled
4. **Web Search**: Claude searches the web for real-time, location-specific activities
5. **Response**: Claude returns 5 curated recommendations with emojis, titles, and descriptions
6. **Display**: Frontend parses and displays activities with loading and error states

## API Endpoints

### POST `/api/activities`

Request body:
```json
{
  "city": "San Francisco",
  "kidsAges": "5, 8",
  "availability": "Saturday afternoon",
  "milesRange": 15,
  "otherPreferences": "outdoor activities"
}
```

Response:
```json
{
  "activities": [
    {
      "emoji": "🎨",
      "title": "Activity Name",
      "description": "Detailed description..."
    }
  ],
  "metadata": {
    "city": "San Francisco",
    "searchedAt": "2025-10-02T..."
  }
}
```

## Security

This repository is configured to prevent accidental secret commits:
- `.gitignore` excludes `.env` files, API keys, and sensitive data
- No hardcoded secrets in source code
- Environment variables required for API access
- API key stored in `server/.env` (never committed)

## Documentation

- `CLAUDE.md` - Instructions for Claude Code development
- `spec.md` - Complete project specification
- `prompt.md` - Claude API prompt template
- `todo.md` - Detailed task checklist

## License

Private project for learning purposes.
