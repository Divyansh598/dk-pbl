import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MoodSelector from '../components/MoodSelector';
import RecommendationForm from '../components/RecommendationForm';
import ResultsDisplay from '../components/ResultsDisplay';
import { getRecommendations } from '../services/aiService';

import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { currentUser } = useAuth();
    // ------------------------------------------------------------------
    // State Management
    // ------------------------------------------------------------------
    const [step, setStep] = useState('mood'); // Controls the main view flow
    const [preferences, setPreferences] = useState({ mood: '', category: '', favorites: '' });
    const [results, setResults] = useState([]);
    const [watchlist, setWatchlist] = useState(() => {
        // Load saved watchlist from local storage on initial mount (lazy initialization)
        const saved = localStorage.getItem('watchlist');
        return saved ? JSON.parse(saved) : [];
    });

    // ------------------------------------------------------------------
    // Handlers
    // ------------------------------------------------------------------

    const handleMoodSelect = (mood) => {
        // User picked a mood, move to fine-tuning form
        setPreferences((prev) => ({ ...prev, mood }));
        setStep('form');
    };

    const handleFormSubmit = async (data) => {
        // Form submitted, combine data and fetch recommendations
        setPreferences((prev) => ({ ...prev, ...data }));
        setStep('loading');

        // Add a small artificial delay so the user feels the "thinking" process
        setTimeout(async () => {
            const recs = await getRecommendations({
                ...preferences,
                ...data,
                userAge: currentUser?.age
            });
            setResults(recs);
            setStep('results');
        }, 1500);
    };

    const handleReset = () => {
        // Start the flow over, clearing current search state but keeping watchlist
        setStep('mood');
        setPreferences({ mood: '', category: '', favorites: '' });
        setResults([]);
    };

    const handleSave = (item) => {
        const exists = watchlist.find(w => w.id === item.id);

        if (!exists) {
            const updated = [...watchlist, item];
            setWatchlist(updated);
            localStorage.setItem('watchlist', JSON.stringify(updated));
            // In a real app, we might use a toast notification here
            alert(`Saved "${item.title}" to your watchlist!`);
        } else {
            alert(`"${item.title}" is already in your watchlist.`);
        }
    };

    return (
        <div className="py-8">
            <AnimatePresence mode='wait'>
                {step === 'mood' && (
                    <motion.div
                        key="mood"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="text-center"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-2">How are you feeling today?</h2>
                        <p className="text-gray-400 mb-8">Select your mood to get started.</p>
                        <MoodSelector onSelect={handleMoodSelect} />
                    </motion.div>
                )}

                {step === 'form' && (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                    >
                        <RecommendationForm onSubmit={handleFormSubmit} selectedMood={preferences.mood} />
                        <button
                            onClick={() => setStep('mood')}
                            className="mt-4 block mx-auto text-gray-500 hover:text-gray-300 underline"
                        >
                            Back
                        </button>
                    </motion.div>
                )}

                {step === 'loading' && (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center mt-20"
                    >
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
                        <p className="text-xl">Consulting the AI Oracle...</p>
                    </motion.div>
                )}

                {step === 'results' && (
                    <motion.div
                        key="results"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <ResultsDisplay results={results} onReset={handleReset} onSave={handleSave} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Watchlist Preview (Optional) */}
            {watchlist.length > 0 && step === 'mood' && (
                <div className="mt-12 border-t border-gray-800 pt-8">
                    <h3 className="text-xl font-bold mb-4 text-center">Your Watchlist ({watchlist.length})</h3>
                    <div className="flex flex-wrap justify-center gap-2">
                        {watchlist.slice(0, 5).map((item, idx) => (
                            <span key={idx} className="bg-gray-800 px-3 py-1 rounded-full text-sm text-gray-300">
                                {item.title}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
