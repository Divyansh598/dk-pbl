import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { currentUser, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center text-white">Loading...</div>;
    }

    if (!currentUser) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (adminOnly && currentUser.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
