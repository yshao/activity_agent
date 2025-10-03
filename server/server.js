import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import cors from 'cors';
import dotenv from 'dotenv';
import { body, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Security middleware
app.use(helmet()); // Adds security headers
app.use(cors()); // Enable CORS
app.use(express.json({ limit: '10kb' })); // Limit body size to prevent large payloads

// Rate limiting: Max 10 requests per minute per IP
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Max 10 requests per minute
  message: {
    error: 'Too many requests',
    message: 'Please try again in a minute'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Prompt template substitution function
function buildPrompt(city, kidsAges, availability, milesRange, otherPreferences) {
  const preferences = otherPreferences || 'none specified';

  return `You are a family activity event finder. Your job is to find SPECIFIC EVENTS with dates/times, NOT generic venues.

🚨 MANDATORY REQUIREMENTS - DO NOT RETURN GENERIC VENUES:
You MUST search the web for actual events happening on "${availability}" in ${city}.

STEP 1 - SEARCH THE WEB FOR EVENTS:
Execute these exact searches and use ONLY results with specific dates/times:
1. "${city} events ${availability}"
2. "${city} family events ${availability}"
3. "${city} kids activities ${availability} ages ${kidsAges}"
4. "${city} weekend events" (if ${availability} is weekend)
5. "${city} Eventbrite ${availability}"

STEP 2 - VERIFY EACH RESULT HAS:
✅ Specific event name (e.g., "Exploratorium After Dark", "Lindy in the Park")
✅ Actual date or recurring schedule (e.g., "October 5th 6pm", "Every Saturday")
✅ NOT just a venue name (e.g., NOT "Exploratorium", NOT "Golden Gate Park")

STEP 3 - FILTERING RULES:
❌ REJECT: "Visit the California Academy of Sciences" (generic venue)
❌ REJECT: "Exploratorium" (no specific event)
❌ REJECT: "Golden Gate Park" (just a location)
✅ ACCEPT: "Exploratorium After Dark - October 5th 6-10pm" (specific event with date)
✅ ACCEPT: "Lindy in the Park - Free Swing Dancing Every Saturday 2-5pm" (recurring event with schedule)
✅ ACCEPT: "Children's Creativity Museum: Robot Building Workshop - Oct 7th 10am" (specific event)

Search criteria:
- Location: ${city} (within ${milesRange} miles)
- Kids' ages: ${kidsAges}
- When: ${availability}
- Preferences: ${preferences}

PRIORITY ORDER (must follow strictly):
1. **Special one-time events** on ${availability} (festivals, concerts, pop-ups)
2. **Recurring events** that happen on ${availability} (farmers markets, story times, dance classes)
3. **Limited-run exhibitions/shows** currently running (with end dates)
4. **Seasonal activities** if currently in season
5. **DO NOT include always-available venues** unless they have a special event

Format EXACTLY as follows:

**[Emoji] [Event Name] - [Date/Time]**
[What the specific EVENT is, where it's happening, why it's great for ages ${kidsAges}, cost/registration details]

GOOD Examples (include date/time):
✅ **🎨 Exploratorium After Dark: 18+ Night - Oct 5th 6-10pm**
✅ **💃 Lindy in the Park - Every Saturday 2-5pm**
✅ **🎭 Children's Fairyland: Fall Festival - Oct 7-8th 10am-4pm**
✅ **🎪 SF Circus Arts: Youth Open Gym - Fridays 4-6pm**
✅ **🏊 Yerba Buena Ice Skating: Family Skate Night - Saturdays 7-9pm**

BAD Examples (NO date/time, just venues):
❌ **🎨 Exploratorium** (WHERE IS THE EVENT? WHEN?)
❌ **🌳 Golden Gate Park** (WHAT EVENT? WHAT TIME?)
❌ **🏛️ California Academy of Sciences** (GENERIC VENUE!)

🚨 CRITICAL: If you cannot find 5 events with specific dates/times, search harder or look at neighboring cities within ${milesRange} miles. DO NOT fall back to generic venues.

Return ONLY 5 formatted recommendations with dates/times.`;
}

// Parse Gemini's response into structured JSON
function parseGeminiResponse(text) {
  const activities = [];

  // First, remove markdown bold ** markers
  text = text.replace(/\*\*/g, '');

  // Split by lines to find activities starting with emoji
  const lines = text.split('\n').map(line => line.trim()).filter(line => line);

  let currentActivity = null;

  for (const line of lines) {
    // Check if line starts with emoji (indicates start of new activity)
    const emojiMatch = line.match(/^(\p{Emoji}+)\s*(.+)/u);

    if (emojiMatch) {
      // Save previous activity if exists
      if (currentActivity) {
        activities.push(currentActivity);
      }

      // Start new activity
      const emoji = emojiMatch[1];
      let titleAndDesc = emojiMatch[2];

      // Try to split title from description
      // Title usually ends with a date pattern or before the first sentence
      const titleMatch = titleAndDesc.match(/^(.+?)(?:\s{2,}|\.\s+)(.+)?$/);

      if (titleMatch) {
        currentActivity = {
          emoji: emoji,
          title: titleMatch[1].trim(),
          description: titleMatch[2] ? titleMatch[2].trim() : ''
        };
      } else {
        currentActivity = {
          emoji: emoji,
          title: titleAndDesc.trim(),
          description: ''
        };
      }
    } else if (currentActivity && line && !line.match(/^(Here|Okay|I will|Note:)/i)) {
      // Add continuation lines to description (skip preamble)
      if (currentActivity.description) {
        currentActivity.description += ' ' + line;
      } else {
        currentActivity.description = line;
      }
    }
  }

  // Add the last activity
  if (currentActivity) {
    activities.push(currentActivity);
  }

  // Clean up descriptions
  activities.forEach(activity => {
    // Remove excessive whitespace
    activity.description = activity.description.replace(/\s+/g, ' ').trim();
    activity.title = activity.title.replace(/\s+/g, ' ').trim();
  });

  // Limit to 5 activities
  return activities.slice(0, 5);
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Input validation rules
const validateActivitiesRequest = [
  body('city')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('City must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s\-,]+$/)
    .withMessage('City can only contain letters, spaces, hyphens, and commas'),

  body('kidsAges')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Kids ages must be between 1 and 50 characters')
    .matches(/^[\d\s,\-]+$/)
    .withMessage('Kids ages must contain only numbers, spaces, commas, and hyphens'),

  body('availability')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Availability must be between 2 and 100 characters')
    .matches(/^[a-zA-Z0-9\s\-,:]+$/)
    .withMessage('Availability contains invalid characters'),

  body('milesRange')
    .isInt({ min: 1, max: 500 })
    .withMessage('Miles range must be between 1 and 500'),

  body('otherPreferences')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Preferences must be less than 500 characters')
];

// Main activities endpoint
app.post('/api/activities', validateActivitiesRequest, async (req, res) => {
  try {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array().map(err => ({
          field: err.path,
          message: err.msg
        }))
      });
    }

    // Sanitized inputs (trimmed and validated)
    const { city, kidsAges, availability, milesRange, otherPreferences } = req.body;

    // Build prompt with user inputs
    const prompt = buildPrompt(city, kidsAges, availability, milesRange, otherPreferences);

    // Get Gemini model with grounding (Google Search)
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      tools: [{
        googleSearch: {}
      }]
    });

    // Call Gemini API with grounding enabled
    const result = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 1.0,
        maxOutputTokens: 2000,
      }
    });

    const response = await result.response;
    const responseText = response.text();

    // Parse response into structured activities
    const activities = parseGeminiResponse(responseText);

    // Validate we got activities
    if (activities.length === 0) {
      return res.status(500).json({
        error: 'Failed to parse activities from Gemini response',
        rawResponse: responseText
      });
    }

    // Return structured activities
    res.json({
      activities,
      metadata: {
        city,
        kidsAges,
        availability,
        milesRange,
        searchedAt: new Date().toISOString(),
        model: 'gemini-2.0-flash-exp'
      }
    });

  } catch (error) {
    console.error('Error calling Gemini API:', error);

    // Handle specific error types
    if (error.message?.includes('API key')) {
      return res.status(401).json({
        error: 'Invalid API key',
        message: 'Please check your GOOGLE_API_KEY environment variable'
      });
    }

    if (error.status === 429) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        message: 'Please try again in a moment'
      });
    }

    // Generic error response
    res.status(500).json({
      error: 'Internal server error',
      message: error.message || 'Failed to fetch activities'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📍 API endpoint: http://localhost:${PORT}/api/activities`);
  console.log(`🤖 Using Gemini 2.0 Flash with Google Search`);

  // Warn if API key is missing
  if (!process.env.GOOGLE_API_KEY) {
    console.warn('⚠️  WARNING: GOOGLE_API_KEY not set in environment variables');
  }
});
