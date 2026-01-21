import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// Tipos básicos
interface User {
    username: string;
    isAdmin?: boolean;
}

interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => Promise<boolean>;
    register: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Cargar sesión persistente
    useEffect(() => {
        const storedUser = localStorage.getItem('wedding_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const login = async (username: string, password: string): Promise<boolean> => {
        setIsLoading(true);
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 500));

        if (username === 'Admin' && password === 'Admin123') {
            const adminUser = { username: 'Admin', isAdmin: true };
            setUser(adminUser);
            localStorage.setItem('wedding_user', JSON.stringify(adminUser));
            setIsLoading(false);
            return true;
        }

        setIsLoading(false);
        return false;
    };

    const register = async (_username: string, _password: string): Promise<boolean> => {
        // Registro deshabilitado
        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('wedding_user');
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
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
