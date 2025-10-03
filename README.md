# Family Activity Finder

A web application that helps parents discover family-friendly activities based on location, children's ages, availability, and travel preferences.

## Current Status: Milestone 1 Complete ✅

**Milestone 1**: UI with dummy data - React frontend with hardcoded activities

## Features

- 🔍 Location-based activity search
- 👶 Age-appropriate recommendations
- 📅 Availability-aware suggestions
- 🚗 Customizable travel range
- 🎯 Preference filtering

## Tech Stack

- **Frontend**: React + Vite
- **Styling**: Vanilla CSS (mobile-first)
- **Future Backend**: Node.js + Express + Claude Messages API

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Visit `http://localhost:5173` to see the app.

## Project Structure

```
parent_app/
├── src/
│   ├── components/
│   │   ├── ActivityForm.jsx      # Input form with 5 fields
│   │   ├── ActivityResults.jsx   # Display activity recommendations
│   │   └── ActivityCard.jsx      # Individual activity card
│   ├── dummyData.js              # Hardcoded activities (Milestone 1)
│   ├── App.jsx                   # Main app component
│   └── main.jsx                  # Entry point
├── CLAUDE.md                     # Claude Code project instructions
├── spec.md                       # Complete project specification
├── prompt.md                     # Claude API prompt template
└── todo.md                       # Milestone task checklist
```

## Milestones

- [x] **Milestone 1**: UI with dummy data
- [ ] **Milestone 2**: Backend Express server + Claude Messages API integration
- [ ] **Milestone 3**: Error handling, loading states, production deployment

## Security

This repository is configured to prevent accidental secret commits:
- `.gitignore` excludes `.env` files, API keys, and sensitive data
- No hardcoded secrets in source code
- Environment variables required for API access (Milestone 2+)

## Documentation

- `CLAUDE.md` - Instructions for Claude Code development
- `spec.md` - Complete project specification
- `prompt.md` - Claude API prompt template
- `todo.md` - Detailed task checklist

## License

Private project for learning purposes.
