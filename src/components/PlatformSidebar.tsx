import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventsContext';
import {
    User, Search, MessageSquare, HelpCircle,
    Inbox, Globe, Smartphone, LogOut, ChevronDown, ChevronRight, Plus, Moon, Sun, Settings, LayoutDashboard, FolderOpen
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useState } from 'react';

const PlatformSidebar: React.FC = () => {
    const { user, logout } = useAuth();
    const { colors, theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const { events } = useEvents();
    const [isEventsExpanded, setIsEventsExpanded] = useState(true);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isActive = (path: string) => location.pathname === path;

    const navItems = [
        { path: '/explore', label: 'EXPLORAR DISEÑOS', icon: <Search size={18} /> },
        { path: '/messages', label: 'MIS MENSAJES', icon: <MessageSquare size={18} /> },
        { path: '/directory', label: 'DIRECTORIO', icon: <FolderOpen size={18} /> },
        { path: '/help', label: 'CENTRO DE AYUDA', icon: <HelpCircle size={18} /> },
        { path: '/received', label: 'ENVÍOS RECIBIDOS', icon: <Inbox size={18} /> },
    ];

    return (
        <div style={{
            width: '260px',
            backgroundColor: colors.cardBg,
            borderRight: `1px solid ${colors.border}`,
            color: colors.text,
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            zIndex: 100,
            fontFamily: "'Montserrat', sans-serif",
            transition: 'background-color 0.3s, border-color 0.3s, color 0.3s'
        }}>
            {/* Header / Brand Area */}
            <div style={{ padding: '1.5rem', borderBottom: `1px solid ${colors.border}` }}>
                <h2 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: colors.text,
                    margin: 0,
                    letterSpacing: '1px',
                    cursor: 'pointer'
                }} onClick={() => navigate('/dashboard')}>
                    BODA<span style={{ fontWeight: 400 }}>DIGITAL</span>
                </h2>
            </div>

            {/* Content Scrollable */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 0' }}>

                {/* User Section (Mini Profile) */}
                <div
                    onClick={() => navigate('/account')}
                    style={{
                        padding: '0 1.5rem', marginBottom: '2rem',
                        display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer'
                    }}
                >
                    <div style={{
                        width: '32px', height: '32px', borderRadius: '50%',
                        backgroundColor: colors.border,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: colors.muted
                    }}>
                        <User size={16} />
                    </div>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem', color: colors.text }}>{user?.username || 'Mi Cuenta'}</span>
                    <Settings size={14} color={colors.muted} style={{ marginLeft: 'auto', opacity: 0.7 }} />
                </div>

                {/* Section: Mis Envíos */}
                <div style={{ padding: '0 1.5rem', marginBottom: '0.5rem' }}>
                    <div
                        onClick={() => setIsEventsExpanded(!isEventsExpanded)}
                        style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1px', opacity: 0.8, marginBottom: '1rem',
                            color: colors.muted, cursor: 'pointer', userSelect: 'none'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {isEventsExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            <span>MIS ENVÍOS</span>
                        </div>
                        <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }} onClick={(e) => { e.stopPropagation(); navigate('/create'); }}>
                            NUEVO <Plus size={12} />
                        </span>
                    </div>

                    {/* Event List Items */}
                    {isEventsExpanded && (
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem', paddingLeft: '1rem' }}>
                            {events.length > 0 ? (
                                events.map((ev) => (
                                    <li
                                        key={ev.id}
                                        style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.8rem', opacity: 1, color: colors.text, cursor: 'pointer' }}
                                        onClick={() => navigate(`/dashboard/event/${ev.id}`)}
                                    >
                                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: colors.primary }}></div>
                                        <span style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '150px' }}>
                                            {ev.partner1} & {ev.partner2}
                                        </span>
                                    </li>
                                ))
                            ) : (
                                <li style={{ fontSize: '0.85rem', color: colors.muted, fontStyle: 'italic' }}>
                                    Sin eventos activos
                                </li>
                            )}
                        </ul>
                    )}
                </div>

                {/* Divider */}
                <div style={{ height: '1px', backgroundColor: colors.border, margin: '1.5rem 0' }}></div>

                {/* Main Navigation */}
                <nav>
                    <div
                        onClick={() => navigate('/dashboard')}
                        style={{
                            padding: '0.8rem 1.5rem',
                            display: 'flex', alignItems: 'center', gap: '1rem',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                            fontWeight: 600,
                            fontSize: '0.85rem',
                            letterSpacing: '0.5px',
                            color: isActive('/dashboard') ? colors.primary : colors.muted,
                            backgroundColor: isActive('/dashboard') ? (theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)') : 'transparent'
                        }}
                    >
                        <LayoutDashboard size={18} />
                        <span>INICIO</span>
                    </div>

                    {navItems.map((item) => (
                        <div
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            style={{
                                padding: '0.8rem 1.5rem',
                                display: 'flex', alignItems: 'center', gap: '1rem',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s',
                                fontWeight: 600,
                                fontSize: '0.85rem',
                                letterSpacing: '0.5px',
                                color: isActive(item.path) ? (theme === 'dark' ? '#34D399' : '#059669') : colors.muted,
                                backgroundColor: isActive(item.path) ? (theme === 'dark' ? 'rgba(52, 211, 153, 0.1)' : 'rgba(5, 150, 105, 0.05)') : 'transparent'
                            }}
                            onMouseEnter={(e) => {
                                if (!isActive(item.path)) {
                                    e.currentTarget.style.backgroundColor = theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
                                    e.currentTarget.style.color = colors.text;
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive(item.path)) {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.color = colors.muted;
                                }
                            }}
                        >
                            {/* Clone element to force size if needed, or just use as is */}
                            {item.icon}
                            <span>{item.label}</span>
                        </div>
                    ))}
                </nav>
            </div>

            {/* Footer Actions */}
            <div style={{ padding: '1.5rem', borderTop: `1px solid ${colors.border}`, fontSize: '0.85rem', color: colors.muted }}>
                <div
                    onClick={toggleTheme}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', cursor: 'pointer', opacity: 0.9, color: colors.text }}
                >
                    {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
                    {theme === 'dark' ? 'MODO NOCHE' : 'MODO DÍA'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', cursor: 'pointer', opacity: 0.9 }}>
                    <Globe size={16} /> ESPAÑOL <ChevronDown size={14} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', cursor: 'pointer', opacity: 0.9 }}>
                    <Smartphone size={16} /> VERSIÓN MÓVIL
                </div>
                <div
                    onClick={handleLogout}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', opacity: 0.9, color: '#EF4444' }}
                >
                    <LogOut size={16} /> SALIR
                </div>
            </div>
        </div>
    );
};

export default PlatformSidebar;
