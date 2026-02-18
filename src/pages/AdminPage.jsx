import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    LayoutDashboard, Users, Bookmark, TrendingUp,
    Film, BookOpen, Tv, Star, LogOut, Shield,
    Activity, Eye, Search
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { getTypeConfig } from '../utils/helpers';

// ── Stat card ──────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, color, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.4 }}
        className="bg-white/[0.04] border border-white/10 rounded-2xl p-5 flex items-center gap-4"
    >
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
            <Icon size={22} className="text-white" />
        </div>
        <div>
            <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">{label}</p>
            <p className="text-2xl font-bold text-white mt-0.5">{value}</p>
        </div>
    </motion.div>
);

// ── Search Term Item ──────────────────────────────────────────
const SearchTermItem = ({ term, count, total }) => {
    const pct = total > 0 ? (count / total) * 100 : 0;
    return (
        <div className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
            <Search size={14} className="text-gray-500" />
            <span className="text-sm text-gray-300 flex-1">{term}</span>
            <div className="w-24 bg-white/5 rounded-full h-1.5 overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    className="h-full bg-violet-500 rounded-full"
                />
            </div>
            <span className="text-xs text-gray-500 w-6 text-right">{count}</span>
        </div>
    );
};

// ── Main AdminPage ──────────────────────────────────────────────
const AdminPage = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        userCount: 0,
        avgAge: 0,
        topSearch: 'None',
        totalSearches: 0
    });
    const [recentSearches, setRecentSearches] = useState([]);

    useEffect(() => {
        // Load data from localStorage simulation
        const users = JSON.parse(localStorage.getItem('moodwatch_users') || '[]');
        const history = JSON.parse(localStorage.getItem('moodwatch_search_history') || '[]');

        // Calculate Stats
        const validUsers = users.filter(u => u.role !== 'admin'); // Don't count admin
        const totalAge = validUsers.reduce((acc, u) => acc + (parseInt(u.age) || 0), 0);
        const avgAge = validUsers.length ? Math.round(totalAge / validUsers.length) : 0;

        // Count search frequency
        const searchCounts = history.reduce((acc, item) => {
            const term = item.term.trim();
            acc[term] = (acc[term] || 0) + 1;
            return acc;
        }, {});

        const sortedSearches = Object.entries(searchCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5); // Top 5

        const topSearchTerm = sortedSearches[0] ? sortedSearches[0][0] : 'None';

        setStats({
            userCount: validUsers.length,
            avgAge,
            topSearch: topSearchTerm,
            totalSearches: history.length
        });

        // Format for list
        setRecentSearches(sortedSearches.map(([term, count]) => ({ term, count })));

    }, []);

    const handleLogout = () => {
        logout();
        toast('Signed out successfully', { icon: '👋' });
        navigate('/login');
    };

    const statCards = [
        { icon: Users, label: 'Total Users', value: stats.userCount, color: 'bg-violet-600', delay: 0.05 },
        { icon: Activity, label: 'Avg User Age', value: `${stats.avgAge} yrs`, color: 'bg-pink-600', delay: 0.10 },
        { icon: TrendingUp, label: 'Top Search', value: stats.topSearch, color: 'bg-emerald-600', delay: 0.15 },
        { icon: Search, label: 'Total Queries', value: stats.totalSearches, color: 'bg-blue-600', delay: 0.20 },
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white font-sans">
            {/* Top bar */}
            <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-md">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
                            <Shield size={16} className="text-white" />
                        </div>
                        <div>
                            <span className="font-bold text-white tracking-tight">Admin<span className="text-violet-400">Panel</span></span>
                            <span className="ml-2 text-[10px] bg-violet-900/50 border border-violet-700/50 text-violet-300 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                                {currentUser?.name}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-gray-400 hover:text-white text-sm transition-colors"
                        >
                            <Eye size={14} />
                            Live App
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-red-900/10 border border-red-800/20 text-red-400 hover:bg-red-900/30 text-sm transition-all"
                        >
                            <LogOut size={14} />
                            Sign Out
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-10">
                {/* Page header */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
                        System Overview
                    </h1>
                    <p className="text-gray-500 text-sm max-w-2xl">
                        Monitor user activity, demographics, and search trends in real-time. Data is persisted locally for this demo environment.
                    </p>
                </motion.div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    {statCards.map((s) => (
                        <StatCard key={s.label} {...s} />
                    ))}
                </div>

                {/* Two-column section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Search Trends */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 }}
                        className="bg-white/[0.04] border border-white/10 rounded-2xl p-6"
                    >
                        <div className="flex items-center gap-2 mb-6">
                            <TrendingUp size={18} className="text-emerald-400" />
                            <h2 className="font-semibold text-white">Frequent Search Terms</h2>
                        </div>
                        {recentSearches.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 text-gray-600">
                                <Search size={32} className="mb-2 opacity-50" />
                                <p className="text-sm">No search data available yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recentSearches.map((item, i) => (
                                    <SearchTermItem
                                        key={i}
                                        term={item.term}
                                        count={item.count}
                                        total={stats.totalSearches}
                                    />
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* System Status / Notes */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-gradient-to-br from-violet-900/10 to-pink-900/10 border border-white/10 rounded-2xl p-6"
                    >
                        <div className="flex items-center gap-2 mb-6">
                            <Activity size={18} className="text-violet-400" />
                            <h2 className="font-semibold text-white">System Status</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400">Backend Connection</span>
                                <span className="text-emerald-400 flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    Active (Local)
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400">AI Model</span>
                                <span className="text-blue-400">Gemini 1.5 Flash</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400">Database</span>
                                <span className="text-orange-300">LocalStorage (Demo)</span>
                            </div>

                            <div className="mt-8 pt-6 border-t border-white/5">
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    <strong>Note for Admin:</strong> As this is a client-side demo, all data resides in the user's browser storage. In a production environment, this dashboard would connect to a centralized database.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default AdminPage;
