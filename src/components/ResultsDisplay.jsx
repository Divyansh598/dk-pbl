import React from 'react';
import { motion } from 'framer-motion';
import { BookmarkPlus } from 'lucide-react';

const ResultsDisplay = ({ results, onReset, onSave }) => {
    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">We Found These For You!</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((item, index) => (
                    <motion.div
                        key={item.id || index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 hover:border-purple-500 transition-colors relative group"
                    >
                        {/* Image Placeholder */}
                        <div className="h-48 bg-gray-700 flex items-center justify-center relative">
                            <span className="text-gray-500">{item.type} Image</span>
                            <button
                                onClick={() => onSave(item)}
                                className="absolute top-2 right-2 p-2 bg-black/50 rounded-full hover:bg-purple-600 transition-colors opacity-0 group-hover:opacity-100"
                                title="Save to Watchlist"
                            >
                                <BookmarkPlus size={20} />
                            </button>
                        </div>

                        <div className="p-4">
                            <h3 className="text-xl font-semibold mb-1 text-white">{item.title}</h3>
                            <span className="inline-block bg-purple-900 text-purple-200 text-xs px-2 py-1 rounded-full mb-2">
                                {item.type}
                            </span>
                            <p className="text-gray-400 text-sm">{item.description}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-8 text-center">
                <button
                    onClick={onReset}
                    className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-full transition-colors"
                >
                    Start Over
                </button>
            </div>
        </div>
    );
};

export default ResultsDisplay;
