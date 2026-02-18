import React, { createContext, useContext, useState, useEffect } from 'react';

// ---------------------------------------------------------------
// Auth Context with Local Storage Persistence
// ---------------------------------------------------------------

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for saved session on mount
        try {
            const saved = localStorage.getItem('moodwatch_user');
            if (saved) {
                setCurrentUser(JSON.parse(saved));
            }
        } catch (error) {
            console.error("Failed to parse user session", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const login = (email, password) => {
        // For demo purposes, we'll check against a "users" array in localStorage
        // In a real app, this would hit an API endpoint
        const users = JSON.parse(localStorage.getItem('moodwatch_users') || '[]');

        // Special Admin Backdoor
        if (email === 'admin@moodwatch.app' && password === 'admin123') {
            const adminUser = {
                name: 'Admin',
                email: 'admin@moodwatch.app',
                role: 'admin',
                id: 'admin-001'
            };
            setCurrentUser(adminUser);
            localStorage.setItem('moodwatch_user', JSON.stringify(adminUser));
            return adminUser;
        }

        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
            throw new Error('Invalid email or password.');
        }

        const { password: _, ...safeUser } = user;
        setCurrentUser(safeUser);
        localStorage.setItem('moodwatch_user', JSON.stringify(safeUser));
        return safeUser;
    };

    const signup = (name, email, password, age) => {
        const users = JSON.parse(localStorage.getItem('moodwatch_users') || '[]');

        if (users.find(u => u.email === email)) {
            throw new Error('Email already exists.');
        }

        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password, // In a real app, NEVER store plain text passwords
            age: parseInt(age),
            role: 'user',
            createdAt: new Date().toISOString()
        };

        const updatedUsers = [...users, newUser];
        localStorage.setItem('moodwatch_users', JSON.stringify(updatedUsers));

        // Auto-login after signup
        const { password: _, ...safeUser } = newUser;
        setCurrentUser(safeUser);
        localStorage.setItem('moodwatch_user', JSON.stringify(safeUser));
        return safeUser;
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('moodwatch_user');
    };

    return (
        <AuthContext.Provider value={{ currentUser, login, signup, logout, loading, isAdmin: currentUser?.role === 'admin' }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
}
