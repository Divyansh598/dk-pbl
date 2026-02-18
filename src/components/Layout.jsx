import React from 'react';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans">
            <header className="p-4 border-b border-gray-800">
                <h1 className="text-2xl font-bold text-center text-purple-500">
                    AI Recommender
                </h1>
            </header>
            <main className="container mx-auto p-4">
                <Outlet />
            </main>
            <footer className="p-4 border-t border-gray-800 text-center text-gray-500 text-sm">
                Built with React, Tailwind & AI
            </footer>
        </div>
    );
};

export default Layout;
