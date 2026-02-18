// ------------------------------------------------------------------
// AI Service Configuration
// ------------------------------------------------------------------
// This service handles the connection to Google's Gemini API.
// If no API key is provided, it gracefully falls back to a mock data system.

import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Helper to log search terms for Admin Dashboard
const logSearchTerm = (term) => {
    if (!term) return;
    try {
        const history = JSON.parse(localStorage.getItem('moodwatch_search_history') || '[]');
        history.push({ term, timestamp: new Date().toISOString() });
        // Keep only last 100 searches to save space
        if (history.length > 100) history.shift();
        localStorage.setItem('moodwatch_search_history', JSON.stringify(history));
    } catch (e) {
        console.error("Failed to log search term", e);
    }
};

/**
 * Fallback data used when the API is unavailable or unconfigured.
 */
const MOCK_DATA = [
    { id: 1, title: "Inception", type: "Movie", description: "A mind-bending thriller that fits an adventurous mood." },
    { id: 2, title: "Spirited Away", type: "Anime", description: "A magical journey perfect for a whimsical or chill mood." },
    { id: 3, title: "The Midnight Library", type: "Book", description: "A thoughtful story about choices and regrets." },
    { id: 4, title: "Stranger Things", type: "Series", description: "Nostalgic sci-fi horror that keeps you on the edge of your seat." },
    { id: 5, title: "Cowboy Bebop", type: "Anime", description: "Cool, jazz-infused space western for a chill vibe." },
];

/**
 * Fetches recommendations based on user preferences.
 * @param {Object} preferences - includes mood, category, favorites, userAge
 * @returns {Promise<Array>} - Array of recommendation objects
 */
export const getRecommendations = async (preferences) => {
    const { mood, category, favorites, userAge } = preferences;

    // Log the mood as a "search term" for analytics
    logSearchTerm(`${mood} ${category || ''}`);

    const isMinor = userAge && parseInt(userAge) < 18;

    // 1. Check for API Key
    if (!API_KEY) {
        console.warn("⚠️ No API Key found in .env. Switching to Mock Mode.");
        return new Promise((resolve) => {
            setTimeout(() => {
                const filtered = MOCK_DATA.filter(item =>
                    item.type === category || !category
                );
                resolve(filtered.length > 0 ? filtered : MOCK_DATA);
            }, 800);
        });
    }

    // 2. Call Google Gemini API
    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Construct a natural language prompt
        const prompt = `
      Act as a world-class media concierge. Your goal is to provide the perfect ${category} recommendations.
      
      USER PROFILE:
      - Mood: "${mood}"
      - Category: ${category}
      - Age: ${userAge ? userAge + ' years old' : 'Unknown'}
      - Favorites: ${favorites || 'None provided'}
      - Preference: ${preferences.criticallyAcclaimed ? 'Strictly highly-rated (IMDb 8.0+, Rotten Tomatoes 90%+) or currently trending.' : 'Hidden gems or popular hits.'}

      CONSTRAINTS:
      1. **Age Appropriateness**: ${isMinor ? ' STRICTLY PG-13 OR LOWER. NO R-RATED CONTENT.' : 'Any rating is fine, but flag extreme content.'}
      2. **Relevance**: Recommendations MUST match the detailed mood described. If they say "Happy", give uplifting content. If "Adventurous", give high-stakes action.
      3. **Variety**: Provide 5 distinct choices (e.g., one classic, one modern hit, one indie/niche).
      4. **Logic**: If the user lists specific favorites, recommend similar items in terms of tone, director, or genre, but DO NOT recommend the favorites themselves.

      OUTPUT FORMAT:
      - Return ONLY a raw JSON array.
      - No markdown blocks.
      - Schema:
        [
          {
            "id": 1,
            "title": "Exact Title",
            "type": "${category}",
            "year": "YYYY",
            "description": "A compelling 1-sentence pitch explaining WHY this matches their mood/favorites."
          }
        ]
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Safety: Remove any potential markdown formatting
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(cleanText);

    } catch (error) {
        console.error("❌ Request Failed:", error);
        return MOCK_DATA;
    }
};
