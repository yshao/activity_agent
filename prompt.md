# Claude API Prompt Template

## Context
This prompt will be sent to Claude Messages API to generate family activity recommendations. Claude will use the built-in web search tool to find real-time, relevant activities.

## Input Variables
- `{city}` - User's city/location
- `{kidsAges}` - Comma-separated ages (e.g., "5, 8, 10")
- `{availability}` - When they're free (e.g., "Saturday afternoon", "weekday evenings")
- `{milesRange}` - Maximum travel distance in miles
- `{otherPreferences}` - Optional additional preferences (e.g., "outdoor activities", "educational", "free or low-cost")

## Prompt Template

```
You are helping parents find family-friendly activities. Use web search to find current, real activities and events.

Search for activities matching these criteria:
- Location: {city} (within {milesRange} miles)
- Kids' ages: {kidsAges}
- Availability: {availability}
- Additional preferences: {otherPreferences}

Find 5 specific, real activities that are:
1. Age-appropriate for all children listed
2. Available during the specified time
3. Within the travel distance
4. Currently operating/scheduled (use web search to verify)

Format each recommendation EXACTLY as follows:

**[Emoji] [Activity Name]**
[2-4 sentences including: what it is, where it's located, why it's great for these ages, and any practical details like cost or booking requirements]

Requirements:
- Each activity must be a real, specific place or event (not generic suggestions)
- Include the actual name and location
- Use relevant emojis (🎨 🎭 🏛️ 🌳 ⚽ 🎪 🏊 etc.)
- Vary the types of activities (mix indoor/outdoor, active/creative, free/paid)
- Prioritize activities happening soon or regularly available

Return ONLY the 5 formatted recommendations, nothing else.
```

## Example Output Format

```
**🎨 The Children's Museum of Indianapolis**
Located in downtown Indianapolis, this interactive museum features hands-on exhibits perfect for ages 5-10. The Dinosphere and ScienceWorks areas are especially popular with elementary-age kids. Admission is $25 per person, open Saturday 10am-5pm.

**🌳 Eagle Creek Park Nature Center**
A 3,900-acre park just 20 minutes from downtown with hiking trails, a nature center, and a playground. The easy 2-mile Lilly Trail is perfect for young hikers, and the park offers free family nature programs on Saturday afternoons. Parking is $5 per vehicle.

**⚽ Topgolf Indianapolis**
Climate-controlled driving bays make this a fun choice for families, located in Fishers (15 miles north). Kids can play golf games while parents relax, and there's a full menu for lunch. Best for ages 6+ and costs around $30-50 per bay per hour.

**🎭 Indianapolis Children's Choir Saturday Workshop**
A drop-in music and movement workshop for kids ages 4-12, held Saturday afternoons at the Hilbert Circle Theatre. No experience necessary, and it's a great introduction to music and performance. Free admission, runs 2-4pm.

**🏊 Monon Community Center**
Indoor aquatic center in Carmel with a leisure pool, water slides, and splash pad perfect for all ages. The family swim sessions on Saturday afternoons are popular and affordable at $8 per person. Includes a lazy river and diving boards for older kids.
```

## API Configuration

### Model
- `claude-sonnet-4-5-20250929` (or latest Sonnet model)

### Parameters
```json
{
  "model": "claude-sonnet-4-5-20250929",
  "max_tokens": 2000,
  "temperature": 1.0,
  "messages": [
    {
      "role": "user",
      "content": "[prompt above with variables filled in]"
    }
  ]
}
```

### Web Search Tool
Enable the web search tool to allow Claude to find real-time activity information:

```json
{
  "model": "claude-sonnet-4-5-20250929",
  "max_tokens": 2000,
  "temperature": 1.0,
  "tools": [
    {
      "type": "web_search_20250520"
    }
  ],
  "messages": [
    {
      "role": "user",
      "content": "[prompt above]"
    }
  ]
}
```

## Notes
- The web search tool allows Claude to find current events, verify hours, and check if venues are open
- Temperature of 1.0 provides creative, varied recommendations
- Max tokens of 2000 ensures enough space for 5 detailed recommendations
- The prompt emphasizes finding REAL, SPECIFIC activities (not generic suggestions)
