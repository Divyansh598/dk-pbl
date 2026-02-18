# AI Recommender App Walkthrough

I have built a modern, AI-powered recommendation application for movies, series, books, and anime.

## Features
- **Mood-Based Selection**: Choose from visual, animated mood cards (Happy, Sad, Adventurous, etc.).
- **Custom Preferences**: Specify category (Movie/Series/Book/Anime) and existing favorites.
- **AI Integration**: Uses Google's Gemini API to generate personalized recommendations.
- **Mock Mode**: Works instantly without an API key using robust mock data.
- **Watchlist**: Save your favorite recommendations to a local watchlist.
- **Responsive Design**: Fully responsive UI with smooth Framer Motion animations.
- **Systematic Codebase**: Clean infrastructure with human-friendly comments and clear separation of concerns.

## Setup Instructions

### 1. Installation
The project is set up in `recommender-ai`.
```bash
cd recommender-ai
npm install
```

### 2. Configure AI (Optional)
To use real AI recommendations:
1. Copy `.env.example` to `.env`.
2. Add your Google Gemini API key:
   ```
   VITE_GEMINI_API_KEY=your_key_here
   ```
*If no key is provided, the app gracefully falls back to mock data.*

### 3. Run the App
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

## Verification
- **UI Flow**: Confirmed the flow from Mood -> Form -> Results works smoothly.
- **Responsiveness**: Layout adapts to mobile and desktop screens.
- **Error Handling**: Graceful fallback if AI service errors or is unconfigured.
