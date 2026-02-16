import React from 'react';
import { Outlet } from 'react-router-dom';
import PlatformSidebar from './PlatformSidebar';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const PlatformLayout: React.FC = () => {
    const { colors, theme } = useTheme(); // Added theme
    const { isMobileSimulation } = useLanguage();

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: colors.bg, transition: 'background-color 0.3s' }}>
            {/* Fixed Sidebar */}
            <PlatformSidebar />

            {/* Main Content Area */}
            <main style={{
                flex: 1,
                marginLeft: '260px', // Compensate for fixed sidebar
                width: 'calc(100% - 260px)',
                minHeight: '100vh',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: isMobileSimulation ? 'center' : 'stretch',
                padding: isMobileSimulation ? '2rem' : '0',
                backgroundColor: isMobileSimulation ? (theme === 'dark' ? '#111' : '#f0f2f5') : colors.bg,
                transition: 'all 0.3s ease'
            }}>
                {isMobileSimulation ? (
                    <div style={{
                        width: '375px',
                        height: '812px', // iPhone X height roughly, or just min-height
                        minHeight: '100%',
                        backgroundColor: colors.bg,
                        borderRadius: '40px',
                        border: `8px solid ${theme === 'dark' ? '#333' : '#fff'}`,
                        boxShadow: '0 0 0 2px #ccc, 0 20px 40px rgba(0,0,0,0.2)',
                        overflow: 'hidden',
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        {/* Mobile Status Bar Simulation (Optional) */}
                        <div style={{ height: '30px', width: '100%', backgroundColor: colors.cardBg, zIndex: 10, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <div style={{ width: '100px', height: '15px', backgroundColor: theme === 'dark' ? '#000' : '#ddd', borderRadius: '0 0 10px 10px' }}></div>
                        </div>

                        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
                            <Outlet />
                        </div>
                    </div>
                ) : (
                    <Outlet />
                )}
            </main>
        </div>
    );
};

export default PlatformLayout;
