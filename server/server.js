import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Middleware
app.use(cors());
app.use(express.json());

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

  // Split by double asterisks to find activity blocks
  const blocks = text.split('**').filter(block => block.trim());

  for (let i = 0; i < blocks.length; i += 2) {
    if (i + 1 < blocks.length) {
      const title = blocks[i].trim();
      const description = blocks[i + 1].trim();

      // Extract emoji (first character is usually emoji)
      const emojiMatch = title.match(/^(\p{Emoji}+)/u);
      const emoji = emojiMatch ? emojiMatch[1] : '🎯';
      const activityTitle = title.replace(/^(\p{Emoji}+\s*)/u, '').trim();

      activities.push({
        emoji,
        title: activityTitle,
        description: description.trim()
      });
    }
  }

  return activities;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Main activities endpoint
app.post('/api/activities', async (req, res) => {
  try {
    // Validate request body
    const { city, kidsAges, availability, milesRange, otherPreferences } = req.body;

    if (!city || !kidsAges || !availability || !milesRange) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['city', 'kidsAges', 'availability', 'milesRange']
      });
    }

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
