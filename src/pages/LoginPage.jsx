import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Eye, EyeOff, User, Shield, ArrowRight, AlertCircle, Mail, Lock, Calendar } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        age: ''
    });
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login, signup } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                const user = login(formData.email, formData.password);
                toast.success(`Welcome back, ${user.name}! 👋`);
                navigate(user.role === 'admin' ? '/admin' : from, { replace: true });
            } else {
                if (formData.age < 13) {
                    throw new Error("You must be at least 13 years old to use this app.");
                }
                const user = signup(formData.name, formData.email, formData.password, formData.age);
                toast.success(`Account created! Welcome, ${user.name}! 🎉`);
                navigate(from, { replace: true });
            }
        } catch (err) {
            setError(err.message);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4 relative overflow-hidden font-sans">
            <Toaster position="top-center" />

            {/* Background Effects */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-pink-600/10 blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="w-full max-w-md relative z-10"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 shadow-2xl shadow-violet-500/40 mb-4"
                    >
                        <Sparkles size={30} className="text-white" />
                    </motion.div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">
                        Mood<span className="text-violet-400">watch</span>
                    </h1>
                    <p className="text-gray-500 text-sm mt-2">
                        {isLogin ? 'Sign in to access your dashboard' : 'Join the most intelligent discovery platform'}
                    </p>
                </div>

                {/* Main Card */}
                <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">

                    {/* Mode Switcher */}
                    <div className="flex bg-white/5 rounded-2xl p-1 mb-7">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${isLogin ? 'bg-white text-gray-900 shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            Log In
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${!isLogin ? 'bg-white text-gray-900 shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            Sign Up
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        <AnimatePresence mode='popLayout'>
                            {!isLogin && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-4 overflow-hidden"
                                >
                                    <div>
                                        <label className="block text-gray-400 text-xs uppercase font-bold tracking-wider mb-1.5 ml-1">Full Name</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="John Doe"
                                                required={!isLogin}
                                                className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                                            />
                                            <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-gray-400 text-xs uppercase font-bold tracking-wider mb-1.5 ml-1">Age</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                name="age"
                                                value={formData.age}
                                                onChange={handleChange}
                                                placeholder="25"
                                                min="1"
                                                max="120"
                                                required={!isLogin}
                                                className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                                            />
                                            <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div>
                            <label className="block text-gray-400 text-xs uppercase font-bold tracking-wider mb-1.5 ml-1">Email Address</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    required
                                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                                />
                                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-400 text-xs uppercase font-bold tracking-wider mb-1.5 ml-1">Password</label>
                            <div className="relative">
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    required
                                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 pl-10 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                                />
                                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                >
                                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="flex items-center gap-2 text-red-400 text-sm p-3 bg-red-900/10 border border-red-900/20 rounded-xl"
                                >
                                    <AlertCircle size={16} />
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-violet-500/30 transition-all flex items-center justify-center gap-2 mt-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    {isLogin ? 'Sign In' : 'Create Account'}
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </motion.button>
                    </form>
                </div>

                <div className="mt-8 text-center text-sm text-gray-600">
                    <p>Protected by ReCAPTCHA and subject to the Privacy Policy.</p>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
