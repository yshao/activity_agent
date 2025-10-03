# Bug Fixes Summary

**Date**: October 3, 2025
**Branch**: `feat/gemini-migration`

## Issues Fixed

### 1. Field Name Mismatch Between Form and API
**Problem**: Frontend form was sending different field names than what the backend API expected, causing validation errors.

**Root Cause**:
- ActivityForm.jsx sends: `kidAges`, `maxDistance`, `preferences`
- Backend API expects: `kidsAges`, `milesRange`, `otherPreferences`
- App.jsx was not mapping field names correctly

**Fix**: Updated App.jsx to map form fields to backend API format
```javascript
// Before (broken)
kidsAges: formData.kidsAges,  // undefined
milesRange: formData.milesRange,  // undefined

// After (fixed)
kidsAges: formData.kidAges,  // ✅ correct
milesRange: formData.maxDistance,  // ✅ correct
otherPreferences: formData.preferences,  // ✅ correct
```

**File**: `src/App.jsx:46-52`

---

### 2. Gemini Response Parsing Failure
**Problem**: Gemini API returns markdown-formatted text with `**bold**` markers, which broke the parser and caused incorrect emoji/title/description extraction.

**Root Cause**:
- Gemini uses markdown formatting: `**🎨 Event Name**`
- Old parser expected plain text without `**` markers
- Parser was splitting on `**` and getting wrong content sections
- Gemini also adds preamble text like "Okay, I will find..." before actual events

**Example of broken output**:
```json
{
  "emoji": "**🎶",
  "title": "Hardly Strictly Bluegrass - Friday-Sunday...",
  "description": "**🧹Join the SF Clean-Up..."
}
```

**Fix**: Rewrote `parseGeminiResponse()` function to:
1. Strip all markdown `**` markers first
2. Parse line-by-line looking for emoji-starting lines
3. Skip Gemini's preamble text ("Here", "Okay", "Note:")
4. Split title from description intelligently
5. Clean up excessive whitespace

**New parser logic**:
```javascript
// Remove markdown bold markers
text = text.replace(/\*\*/g, '');

// Find lines starting with emoji
const emojiMatch = line.match(/^(\p{Emoji}+)\s*(.+)/u);

// Skip preamble
if (!line.match(/^(Here|Okay|I will|Note:)/i)) {
  // Process activity
}
```

**File**: `server/server.js:83-150`

---

### 3. Server Hot Reload Issues
**Problem**: Changes to server code weren't being picked up due to multiple running Node processes.

**Fix**:
- Killed all old server processes
- Restarted backend and frontend cleanly
- Ensured only one instance of each server running

---

## Test Results

### Before Fixes
❌ Frontend: "Something went wrong. Please try again."
❌ Backend: Returns data but with malformed JSON structure
❌ Parser: Extracts `**` characters and wrong content sections

### After Fixes
✅ Frontend: Sends correct field names
✅ Backend: Receives and validates requests properly
✅ Parser: Correctly extracts emoji, title, and description
✅ Results: Display properly formatted activities

### Example Output (Fixed)
```json
{
  "activities": [
    {
      "emoji": "🎈",
      "title": "Victorian-Era Car Sideshow & Film Shoot - Oct 4th 9am-5pm",
      "description": "A free event featuring Victorian-era cars with a film shoot. Good for ages 7, Free."
    },
    {
      "emoji": "🗑️",
      "title": "Join the SF Clean-Up: Free Lunch for Volunteers - Oct 4th 8:30am-12pm",
      "description": "A free event to clean up San Francisco with free lunch for volunteers. Great for teaching kids about civic responsibility."
    }
  ]
}
```

## Files Changed

### Modified
- `src/App.jsx` - Fixed field name mapping (lines 46-52)
- `server/server.js` - Rewrote response parser (lines 83-150)

### Debugging Files Created (can be deleted)
- `test-api.html` - Simple HTML test file for API testing

## How to Test

1. Start both servers:
   ```bash
   # Terminal 1
   npm run server

   # Terminal 2
   npm run dev
   ```

2. Open http://localhost:3000

3. Fill in form:
   - City: San Francisco
   - Kids ages: 7
   - Availability: Saturday
   - Miles: 15

4. Click "Search Activities"

5. Verify results display with:
   - Proper emoji icons
   - Event names with dates/times
   - Descriptive text

## Root Cause Analysis

### Why This Happened
1. **Field mismatch**: Form component was created in Milestone 1 with one naming scheme, but backend API (Milestone 2) used different naming. The mapping layer in App.jsx wasn't updated.

2. **Parser assumptions**: Original parser was designed for Claude's response format (clean text without markdown). Gemini returns markdown-formatted text, requiring different parsing logic.

3. **Hot reload confusion**: Multiple server restarts during debugging left orphan processes running, making it unclear which code version was executing.

### Prevention
- Add integration tests that verify field name compatibility
- Document expected API request/response formats
- Test with actual AI model responses during development
- Use process management to ensure clean server restarts

## Performance Impact

- No performance degradation
- Parser is more robust and handles edge cases
- Response time remains <5 seconds for API calls

## Breaking Changes

None - These are bug fixes only.

---

**Status**: ✅ All bugs fixed and tested
