import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, Users, Menu, Plus } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface MobileNavBarProps {
    toggleSidebar: () => void;
    style?: React.CSSProperties;
}

const MobileNavBar: React.FC<MobileNavBarProps> = ({ toggleSidebar, style }) => {
    const { colors } = useTheme();
    // const { t } = useLanguage(); 
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    const navItems = [
        { label: 'Inicio', icon: <LayoutDashboard size={24} />, path: '/dashboard' },
        { label: 'Mensajes', icon: <MessageSquare size={24} />, path: '/messages' },
        { label: 'Crear', icon: <Plus size={32} />, path: '/create', isPrimary: true },
        { label: 'Invitados', icon: <Users size={24} />, path: '/guests' },
    ];

    return (
        <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: '65px',
            backgroundColor: colors.cardBg,
            borderTop: `1px solid ${colors.border}`,
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            zIndex: 1000,
            boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
            paddingBottom: 'safe-area-inset-bottom', // Support for iPhone X+ home bar
            ...style
        }}>
            {navItems.map((item) => (
                <div
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: isActive(item.path) ? colors.primary : colors.muted,
                        flex: 1,
                        height: '100%',
                    }}
                >
                    {item.isPrimary ? (
                        <div style={{
                            backgroundColor: colors.primary,
                            borderRadius: '50%',
                            width: '48px',
                            height: '48px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            marginBottom: '20px', // Push it up slightly
                            boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                        }}>
                            {item.icon}
                        </div>
                    ) : (
                        <>
                            {item.icon}
                            <span style={{ fontSize: '10px', marginTop: '2px', fontWeight: isActive(item.path) ? 600 : 400 }}>{item.label}</span>
                        </>
                    )}
                </div>
            ))}

            {/* Menu Toggle for Sidebar */}
            <div
                onClick={toggleSidebar}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: colors.muted,
                    flex: 1,
                    height: '100%',
                }}
            >
                <Menu size={24} />
                <span style={{ fontSize: '10px', marginTop: '2px' }}>Menú</span>
            </div>
        </div>
    );
};

export default MobileNavBar;
