// src/context/AuthContext.jsx
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const login = async (email, password) => {
        // Implementasi login nanti
        console.log('Login:', email, password);
        return { success: false, message: 'Login belum diimplementasi' };
    };

    const register = async (userData) => {
        // Implementasi register nanti
        console.log('Register:', userData);
        return { success: false, message: 'Register belum diimplementasi' };
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
    };

    const value = {
        user,
        isAuthenticated,
        login,
        register,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};