import React from 'react';
import { motion } from 'framer-motion';
import { Smile, Frown, Compass, Coffee, Heart } from 'lucide-react';

// ------------------------------------------------------------------
// Mood Configuration
// ------------------------------------------------------------------
// predefined moods with icons and colors. 
// Easy to extend: just add a new object to this array.
const moods = [
    { id: 'happy', label: 'Happy', icon: Smile, color: 'bg-yellow-500' },
    { id: 'sad', label: 'Sad/Melancholic', icon: Frown, color: 'bg-blue-500' },
    { id: 'adventurous', label: 'Adventurous', icon: Compass, color: 'bg-green-500' },
    { id: 'chill', label: 'Chill/Relaxed', icon: Coffee, color: 'bg-teal-500' },
    { id: 'romantic', label: 'Romantic', icon: Heart, color: 'bg-pink-500' },
];

const MoodSelector = ({ onSelect }) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {moods.map((mood) => (
                <motion.button
                    key={mood.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onSelect(mood.id)}
                    className={`p-6 rounded-xl shadow-lg ${mood.color} text-white flex flex-col items-center justify-center gap-2 hover:opacity-90 transition-opacity`}
                >
                    <mood.icon size={32} />
                    <span className="font-semibold">{mood.label}</span>
                </motion.button>
            ))}
        </div>
    );
};

export default MoodSelector;
