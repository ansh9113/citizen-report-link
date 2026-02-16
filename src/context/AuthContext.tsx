import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, AuthResponse } from '@/services/authService';

interface User {
    id: string;
    name: string;
    email?: string;
    mobile?: string;
    role: 'citizen' | 'admin';
    address?: string;
    department?: string;
    designation?: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (data: any) => void;
    logout: () => void;
    updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initAuth = () => {
            const storedSession = authService.getCurrentUser();

            if (storedSession && storedSession.user) {
                setUser(storedSession.user);
            }
            setIsLoading(false);
        };
        initAuth();
    }, []);

    const login = (data: any) => {
        setUser(data.user);
    };

    const logout = async () => {
        await authService.logout();
        setUser(null);
    };

    const updateUser = (updatedUser: User) => {
        setUser(updatedUser);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
