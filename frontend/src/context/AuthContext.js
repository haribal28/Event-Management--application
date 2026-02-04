/**
 * Auth Context
 * 
 * Provides authentication state and methods throughout the app:
 * - User state
 * - Login/Logout/Register
 * - Role-based access
 * - Token management
 * 
 * Includes demo mode fallback when backend is unavailable
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

// Demo mode - set to true when backend isn't running
const DEMO_MODE = true;

// Create context
const AuthContext = createContext(null);

// Auth Provider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check if user is authenticated on mount
    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (token && storedUser) {
                try {
                    // In demo mode, trust localStorage
                    if (DEMO_MODE || token.startsWith('demo_token_')) {
                        setUser(JSON.parse(storedUser));
                        setLoading(false);
                        return;
                    }

                    // Verify token is still valid with backend
                    const response = await authAPI.getMe();
                    setUser(response.data.user || JSON.parse(storedUser));
                } catch (err) {
                    // In demo mode or if token starts with demo_, keep the user logged in
                    if (DEMO_MODE || token.startsWith('demo_token_')) {
                        setUser(JSON.parse(storedUser));
                    } else {
                        // Token invalid, clear storage
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        setUser(null);
                    }
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    // Login
    const login = async (email, password) => {
        setError(null);
        try {
            // Try backend first
            if (!DEMO_MODE) {
                const response = await authAPI.login({ email, password });
                const { token, user: userData } = response.data;

                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(userData));
                setUser(userData);

                return { success: true, user: userData };
            }
            throw new Error('Demo mode');
        } catch (err) {
            // Demo mode fallback - create mock user
            if (DEMO_MODE) {
                const mockUser = {
                    id: 'user_' + Date.now(),
                    name: email.split('@')[0],
                    email: email,
                    role: 'user',
                    avatar: null,
                };
                const mockToken = 'demo_token_' + Date.now();

                localStorage.setItem('token', mockToken);
                localStorage.setItem('user', JSON.stringify(mockUser));
                setUser(mockUser);

                return { success: true, user: mockUser };
            }

            const message = err.response?.data?.message || 'Login failed';
            setError(message);
            return { success: false, error: message };
        }
    };

    // Register
    const register = async (userData) => {
        setError(null);
        try {
            // Try backend first
            if (!DEMO_MODE) {
                const response = await authAPI.register(userData);
                const { token, user: newUser } = response.data;

                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(newUser));
                setUser(newUser);

                return { success: true, user: newUser };
            }
            throw new Error('Demo mode');
        } catch (err) {
            // Demo mode fallback - create mock user
            if (DEMO_MODE) {
                const mockUser = {
                    id: 'user_' + Date.now(),
                    name: userData.name,
                    email: userData.email,
                    role: 'user',
                    avatar: null,
                    createdAt: new Date().toISOString(),
                };
                const mockToken = 'demo_token_' + Date.now();

                localStorage.setItem('token', mockToken);
                localStorage.setItem('user', JSON.stringify(mockUser));
                setUser(mockUser);

                return { success: true, user: mockUser };
            }

            const message = err.response?.data?.message || 'Registration failed';
            setError(message);
            return { success: false, error: message };
        }
    };

    // Demo login for quick access
    const demoLogin = async (role = 'user') => {
        const mockUser = {
            id: role === 'admin' ? 'admin_1' : 'user_' + Date.now(),
            name: role === 'admin' ? 'Admin User' : 'Demo User',
            email: role === 'admin' ? 'admin@eventflow.com' : 'demo@eventflow.com',
            role: role,
            avatar: null,
        };
        const mockToken = 'demo_token_' + Date.now();

        localStorage.setItem('token', mockToken);
        localStorage.setItem('user', JSON.stringify(mockUser));
        setUser(mockUser);

        return { success: true, user: mockUser };
    };

    // Logout
    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('bookings');
        setUser(null);
        setError(null);
    }, []);

    // Update user profile
    const updateProfile = async (data) => {
        try {
            if (!DEMO_MODE) {
                const response = await authAPI.updateProfile(data);
                const updatedUser = response.data.user;
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser);
                return { success: true, user: updatedUser };
            }

            // Demo mode - update local user
            const updatedUser = { ...user, ...data };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            return { success: true, user: updatedUser };
        } catch (err) {
            const message = err.response?.data?.message || 'Update failed';
            return { success: false, error: message };
        }
    };

    // Check if user is admin
    const isAdmin = user?.role === 'admin';

    // Check if authenticated
    const isAuthenticated = !!user;

    const value = {
        user,
        loading,
        error,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
        updateProfile,
        demoLogin,
        setError,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Protected Route component
export const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { isAuthenticated, isAdmin, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading) {
            if (!isAuthenticated) {
                navigate('/login', { replace: true });
            } else if (adminOnly && !isAdmin) {
                navigate('/', { replace: true });
            }
        }
    }, [isAuthenticated, isAdmin, adminOnly, loading, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    if (!isAuthenticated || (adminOnly && !isAdmin)) {
        return null;
    }

    return children;
};

export default AuthContext;
