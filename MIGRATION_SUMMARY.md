# Migration Summary: Claude → Gemini with Event-Specific Search

**Date**: October 2, 2025
**Branch**: `feat/gemini-migration`

## What Changed

### 🔄 API Migration
- **Removed**: `@anthropic-ai/sdk` (Claude API)
- **Added**: `@google/generative-ai` (Gemini API)
- **Model**: `gemini-2.0-flash-exp` with Google Search grounding

### 🎯 Major Improvement: Event-Specific Results
**Problem**: App was returning generic venues like "Exploratorium" instead of specific events like "Exploratorium After Dark" or "Lindy in the Park"

**Solution**: Completely redesigned prompt with mandatory event verification:

#### New Prompt Features
1. **Step-by-step search instructions**
   - Forces specific searches: "{city} events {date}", "{city} Eventbrite {date}"
   - Requires web search for actual event calendars

2. **Strict filtering rules**
   - ❌ REJECT: Generic venues without dates
   - ✅ ACCEPT: Only events with specific dates/times

3. **Mandatory format with date/time**
   ```
   **[Emoji] [Event Name] - [Date/Time]**
   ```

4. **Explicit examples of good vs bad results**
   - GOOD: "🎨 Exploratorium After Dark - Oct 5th 6-10pm"
   - BAD: "🎨 Exploratorium" (rejected)

5. **Verification checklist**
   - Must have specific event name
   - Must have actual date or recurring schedule
   - Cannot be just a venue name

### 📝 Code Changes

#### server/server.js
- Replaced Anthropic SDK with Google Generative AI
- Updated `buildPrompt()` with aggressive event-specific instructions
- Changed API call to use Gemini's `googleSearch` tool
- Renamed `parseClaudeResponse()` → `parseGeminiResponse()`
- Updated error handling for Gemini-specific errors

#### server/.env.example
```diff
- ANTHROPIC_API_KEY=your_api_key_here
+ GOOGLE_API_KEY=your_api_key_here
```

#### server/package.json
```diff
- "@anthropic-ai/sdk": "^0.65.0"
+ "@google/generative-ai": "^0.24.1"
```

### 🔍 Prompt Engineering Details

**Before** (Generic):
```
Find 5 activities in {city}
```

**After** (Event-Specific):
```
STEP 1 - SEARCH THE WEB FOR EVENTS:
1. "{city} events {availability}"
2. "{city} family events {availability}"
3. "{city} kids activities {availability} ages {kidsAges}"
4. "{city} Eventbrite {availability}"

STEP 2 - VERIFY EACH RESULT HAS:
✅ Specific event name
✅ Actual date or recurring schedule
✅ NOT just a venue name

STEP 3 - FILTERING RULES:
❌ REJECT: Generic venues
✅ ACCEPT: Events with dates/times
```

## Why Gemini?

1. **Google Search Integration**: Built-in web grounding for real-time event search
2. **Better at Following Instructions**: More reliable with structured prompts
3. **Free Tier**: More generous free quota for testing
4. **Cost**: Generally cheaper than Claude for production use

## Testing Results

✅ Server starts successfully with Gemini integration
✅ Health check endpoint responds
✅ Request validation works
⚠️ **Requires user's GOOGLE_API_KEY for full E2E test**

## How to Get API Key

1. Visit: https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Copy key to `server/.env`:
   ```
   GOOGLE_API_KEY=your-key-here
   ```

## Expected Results Now

### Before (Generic)
```
🎨 Exploratorium
Located in San Francisco, this science museum...

🌳 Golden Gate Park
A large urban park with trails...
```

### After (Event-Specific)
```
🎨 Exploratorium After Dark: 18+ Night - Oct 5th 6-10pm
Adults-only evening with special exhibits, cash bar...

💃 Lindy in the Park - Every Saturday 2-5pm
Free swing dancing lessons and social dancing in...

🎭 Children's Fairyland: Fall Festival - Oct 7-8th 10am-4pm
Special weekend event with pumpkin decorating...
```

## Files Changed

### Modified
- `server/server.js` - Complete API migration + new prompt
- `server/.env.example` - Updated API key documentation
- `server/.env` - Updated for Gemini (user must add key)
- `server/package.json` - Dependency swap

### New
- `MIGRATION_SUMMARY.md` - This file

## Breaking Changes

⚠️ **Environment Variable Change**
- Old: `ANTHROPIC_API_KEY`
- New: `GOOGLE_API_KEY`

Users must update their `.env` file.

## Next Steps for User

1. Get Gemini API key from https://aistudio.google.com/app/apikey
2. Update `server/.env` with `GOOGLE_API_KEY`
3. Test with query: "San Francisco", "this Saturday", ages "7"
4. Verify results show specific events with dates/times

## Rollback Instructions (if needed)

```bash
git checkout main
cd server
npm uninstall @google/generative-ai
npm install @anthropic-ai/sdk
# Restore server.js from main branch
```

---

**Status**: ✅ Migration complete, ready for testing with user's API key
