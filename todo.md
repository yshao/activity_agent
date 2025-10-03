# Milestone 1: UI Setup with Dummy Data - Task List ✅ COMPLETED

## Project Setup
- [x] Initialize React app with Vite (`npm create vite@latest`)
- [x] Install dependencies and verify dev server runs
- [x] Clean up default Vite template files
- [x] Set up basic project structure (components folder, styles)

## Component Structure
- [x] Create `App.jsx` main component
- [x] Create `ActivityForm.jsx` component for user inputs
- [x] Create `ActivityResults.jsx` component for displaying recommendations
- [x] Create `ActivityCard.jsx` component for individual activity display

## Input Form (`ActivityForm.jsx`)
- [x] Create form with proper HTML structure
- [x] Add input field: City (text input)
- [x] Add input field: Kids' ages (text input with placeholder "5, 8, 10")
- [x] Add input field: Availability (text input, e.g., "Saturday afternoon")
- [x] Add input field: Miles range (slider input)
- [x] Add input field: Other preferences (textarea, optional)
- [x] Add submit button
- [x] Implement form state management (useState)
- [x] Handle form submission (preventDefault, pass data to parent)

## Results Display (`ActivityResults.jsx`)
- [x] Accept array of activities as props
- [x] Map through activities and render ActivityCard for each
- [x] Show/hide based on whether results exist
- [x] Add heading "Top 5 Recommendations"

## Activity Card (`ActivityCard.jsx`)
- [x] Accept activity object as props (emoji, title, description)
- [x] Display emoji
- [x] Display bold title
- [x] Display description text
- [x] Style card with border, padding, margin
- [x] Add numbered badge (#1, #2, etc.)
- [x] Add location and distance metadata

## Dummy Data
- [x] Create `dummyData.js` with 5 hardcoded activities
- [x] Include emoji, title, and 2-4 sentence descriptions for each
- [x] Make activities realistic and varied (indoor/outdoor, active/creative)

## Styling
- [x] Add basic CSS reset/normalization
- [x] Style form inputs (padding, borders, labels)
- [x] Style submit button (colors, hover states)
- [x] Style activity cards (spacing, typography, borders)
- [x] Add responsive layout (mobile-first)
- [x] Ensure form and results stack properly on mobile
- [x] Add basic color scheme (blue accent, family-friendly)
- [x] Add header with logo and title
- [x] Implement two-column grid layout

## State Management
- [x] Implement state to store form input values
- [x] Implement state to toggle results visibility
- [x] Pass form data from ActivityForm to App component
- [x] Show dummy results when form is submitted

## Testing & Polish
- [x] Test form validation (required fields)
- [x] Test responsive design on mobile and desktop
- [x] Verify all dummy data displays correctly
- [x] Dev server running on localhost:3000

---

# Milestone 2: Claude API Integration - Task List

## Project Configuration
- [x] Create `.claude/settings.local/hooks.json` for auto-approved commands
- [ ] Create `.gitignore` file (exclude node_modules, .env, build files)
- [ ] Initialize git repository (`git init`)

## Backend Setup
- [ ] Create `server` directory for backend code
- [ ] Initialize Node.js project in server directory (`npm init -y`)
- [ ] Install backend dependencies (express, @anthropic-ai/sdk, cors, dotenv)
- [ ] Create `.env` file for API keys (add to .gitignore)
- [ ] Create `server.js` main server file
- [ ] Add `"type": "module"` to server/package.json for ES modules

## Express API Server
- [ ] Set up Express app with CORS middleware
- [ ] Create `/api/activities` POST endpoint
- [ ] Add request body validation (city, kidAges, availability, maxDistance, preferences)
- [ ] Add error handling middleware
- [ ] Test server runs on port 5000

## Claude API Integration
- [ ] Import Anthropic SDK in server
- [ ] Load API key from environment variables
- [ ] Implement Claude Messages API call with web search tool enabled
- [ ] Use prompt template from `prompt.md` with variable substitution
- [ ] Configure model: `claude-sonnet-4-5-20250929`
- [ ] Set max_tokens: 2000, temperature: 1.0
- [ ] Enable web search tool: `web_search_20250520`

## Prompt Engineering
- [ ] Load prompt template from `prompt.md`
- [ ] Create function to substitute variables in prompt (city, kidAges, etc.)
- [ ] Ensure prompt instructs Claude to use web search for real activities
- [ ] Test prompt produces 5 formatted recommendations

## Response Parsing
- [ ] Parse Claude API response to extract activity recommendations
- [ ] Validate response format (emoji, title, description)
- [ ] Handle cases where Claude doesn't return exactly 5 activities
- [ ] Convert Claude text response to structured JSON
- [ ] Add error handling for API failures

## Frontend-Backend Connection
- [ ] Update frontend `App.jsx` to call backend API instead of dummy data
- [ ] Add `fetch()` or axios call to `/api/activities`
- [ ] Add loading state during API call
- [ ] Add error state for API failures
- [ ] Display error messages to user if API fails

## Loading & Error States
- [ ] Add loading spinner/skeleton while waiting for results
- [ ] Disable search button during loading
- [ ] Add error message component for API errors
- [ ] Add retry button for failed requests
- [ ] Add timeout handling (if API takes >10 seconds)

## Testing & Validation
- [ ] Test end-to-end flow: form submission → API call → results display
- [ ] Test with different cities and preferences
- [ ] Verify web search tool is being used (check for real, current activities)
- [ ] Test error handling (invalid API key, network errors)
- [ ] Test edge cases (empty preferences, very large distance)

## Environment & Configuration
- [ ] Create `.env.example` file with variable names (no real keys)
- [ ] Add `.env` to `.gitignore`
- [ ] Document how to get Claude API key in README
- [ ] Add instructions for running both frontend and backend

## Documentation
- [ ] Create README.md with setup instructions
- [ ] Document API endpoint structure
- [ ] Add example API request/response
- [ ] Update CLAUDE.md with backend architecture notes
- [ ] Add npm scripts to root package.json (dev:server, dev:client, dev:all)

## Deployment Preparation (Optional)
- [ ] Add production build scripts
- [ ] Configure environment variables for production
- [ ] Test production build locally
- [ ] Add health check endpoint (`/api/health`)
- [ ] Document deployment steps for Vercel/Netlify (frontend) and Railway/Render (backend)
