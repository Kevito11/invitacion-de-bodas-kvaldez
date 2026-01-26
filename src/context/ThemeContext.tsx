import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    colors: {
        primary: string;
        secondary: string;
        bg: string;
        text: string;
        cardBg: string;
        border: string;
        muted: string;
    };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Check local storage or system preference
    const [theme, setTheme] = useState<Theme>(() => {
        const saved = localStorage.getItem('theme');
        return (saved as Theme) || 'light';
    });

    useEffect(() => {
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const colors = theme === 'dark' ? {
        primary: "#E6BEAE",
        secondary: "#B5C99A",
        bg: "#111827", // Dark Mode Background from Landing
        text: "#F3F4F6", // Dark Mode Text
        cardBg: "#1F2937",
        border: "#374151",
        muted: "#9CA3AF"
    } : {
        primary: "#E6BEAE",
        secondary: "#B5C99A",
        bg: "#FDFBF7", // Light Mode Background from Landing (Soft Antique White)
        text: "#4A4A4A",
        cardBg: "#FFFFFF",
        border: "#E5E7EB",
        muted: "#6B7280"
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within a ThemeProvider');
    return context;
};
