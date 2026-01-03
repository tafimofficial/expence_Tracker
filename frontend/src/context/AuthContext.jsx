import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as apiLogin, signup as apiSignup } from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            // In a real app, you might fetch user info here
            setUser({ username: localStorage.getItem('username') || 'User' });
        }
        setLoading(false);
    }, [token]);

    const login = async (credentials) => {
        const { data } = await apiLogin(credentials);
        localStorage.setItem('token', data.access);
        localStorage.setItem('username', credentials.username);
        setToken(data.access);
        setUser({ username: credentials.username });
        return data;
    };

    const signup = async (userData) => {
        return await apiSignup(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, signup, logout, loading, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
