import React from 'react';
import { Menu, User, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

interface PlatformHeaderProps {
    toggleSidebar: () => void;
}
/* New component for mobile header navigation */

const PlatformHeader: React.FC<PlatformHeaderProps> = ({ toggleSidebar }) => {
    const { colors, theme, toggleTheme } = useTheme();
    const { language, toggleLanguage } = useLanguage();
    const navigate = useNavigate();

    return (
        <div style={{
            height: '60px',
            backgroundColor: colors.cardBg,
            borderBottom: `1px solid ${colors.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 1rem',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 90, // Below sidebar (100) but above content
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            transition: 'background-color 0.3s, border-color 0.3s'
        }}>
            {/* Left: Menu & Brand */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button
                    onClick={toggleSidebar}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: colors.text,
                        padding: '0.2rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Menu size={24} />
                </button>
                <h2 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: colors.text,
                    margin: 0,
                    letterSpacing: '1px'
                }}>
                    BODA<span style={{ fontWeight: 400 }}>DIGITAL</span>
                </h2>
            </div>

            {/* Right: Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.text, padding: '0.2rem' }}
                >
                    {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                </button>

                {/* Language Toggle */}
                <button
                    onClick={toggleLanguage}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: colors.text,
                        padding: '0.2rem',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.2rem'
                    }}
                >
                    {language === 'es' ? 'ES' : 'EN'}
                </button>

                {/* Account / Logout */}
                <div
                    onClick={() => navigate('/account')}
                    style={{
                        width: '32px', height: '32px', borderRadius: '50%',
                        backgroundColor: colors.border,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: colors.muted,
                        cursor: 'pointer'
                    }}
                >
                    <User size={18} />
                </div>
            </div>
        </div>
    );
};

export default PlatformHeader;
