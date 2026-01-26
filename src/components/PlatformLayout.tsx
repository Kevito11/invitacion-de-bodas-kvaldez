import React from 'react';
import { Outlet } from 'react-router-dom';
import PlatformSidebar from './PlatformSidebar';
import { useTheme } from '../context/ThemeContext';

const PlatformLayout: React.FC = () => {
    const { colors } = useTheme();

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
                position: 'relative'
            }}>
                <Outlet />
            </main>
        </div>
    );
};

export default PlatformLayout;
