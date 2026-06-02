import React from 'react';
import { Outlet } from 'react-router-dom';
import PlatformSidebar from './PlatformSidebar';
import PlatformHeader from './PlatformHeader';
import MobileNavBar from './MobileNavBar';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const PlatformLayout: React.FC = () => {
    const { colors } = useTheme();
    const [isMobile, setIsMobile] = React.useState(window.innerWidth < 1024);
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(true);

    React.useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            if (!mobile) setIsSidebarOpen(false);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: colors.bg, transition: 'background-color 0.3s' }}>
            {/* Mobile Sidebar Handling */}
            {isMobile && <PlatformHeader toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />}

            {/* Fixed Sidebar */}
            <PlatformSidebar
                isOpen={!isMobile || isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                isMobile={isMobile}
                isCollapsed={isSidebarCollapsed}
                setIsCollapsed={setIsSidebarCollapsed}
            />

            {/* Main Content Area */}
            <main style={{
                flex: 1,
                marginLeft: isMobile ? '0' : (isSidebarCollapsed ? '80px' : '260px'), // Compensate for fixed sidebar
                marginTop: isMobile ? '60px' : '0', // Compensate for fixed header on mobile
                marginBottom: isMobile ? '65px' : '0', // Compensate for bottom nav on mobile
                width: isMobile ? '100%' : `calc(100% - ${isSidebarCollapsed ? '80px' : '260px'})`,
                minHeight: '100vh',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                padding: '0',
                backgroundColor: colors.bg,
                transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
            }}>
                <Outlet />
            </main>

            {/* Mobile Bottom Navigation */}
            {isMobile && <MobileNavBar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />}
        </div>
    );
};

export default PlatformLayout;
