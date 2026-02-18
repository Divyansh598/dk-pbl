
// Returns color configuration based on media type
export const getTypeConfig = (type) => {
    switch (type) {
        case 'Movie':
            return { color: 'bg-purple-500', gradient: 'from-purple-500 to-indigo-600', emoji: '🎬' };
        case 'Series':
            return { color: 'bg-blue-500', gradient: 'from-blue-500 to-cyan-400', emoji: '📺' };
        case 'Book':
            return { color: 'bg-amber-500', gradient: 'from-amber-500 to-orange-400', emoji: '📚' };
        case 'Anime':
            return { color: 'bg-pink-500', gradient: 'from-pink-500 to-rose-400', emoji: '✨' };
        default:
            return { color: 'bg-gray-500', gradient: 'from-gray-500 to-gray-400', emoji: '❓' };
    }
};

export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};
