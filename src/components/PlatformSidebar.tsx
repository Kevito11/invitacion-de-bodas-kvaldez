import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventsContext';
import {
    User,
    Inbox, Globe, LogOut, ChevronDown, Plus, Moon, Sun, Settings, LayoutDashboard, Search,
    MessageSquare, Users, HelpCircle, Pin, PinOff
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useState, useRef, useEffect } from 'react';

interface PlatformSidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
    isMobile?: boolean;
    isCollapsed?: boolean;
    setIsCollapsed?: (collapsed: boolean) => void;
}

const PlatformSidebar: React.FC<PlatformSidebarProps> = ({
    isOpen = true,
    onClose,
    isMobile = false,
    isCollapsed = false,
    setIsCollapsed
}) => {
    const { user, logout } = useAuth();
    const { colors, theme, toggleTheme } = useTheme();
    const { t, language, toggleLanguage } = useLanguage();
    const navigate = useNavigate();
    const location = useLocation();
    const { events } = useEvents();
    const [isEventsExpanded, setIsEventsExpanded] = useState(true);
    const eventsListRef = useRef<HTMLUListElement>(null);
    const [eventsHeight, setEventsHeight] = useState<string | number>('auto');
    const [isHovered, setIsHovered] = useState(false);

    // Calculate effective width based on state
    // On mobile, it's always full width (when open)
    // On desktop: 
    // - if NOT collapsed: 260px
    // - if collapsed AND hovered: 260px (expanded view)
    // - if collapsed AND NOT hovered: 80px (mini view)
    const effectiveWidth = isMobile ? '260px' : (isCollapsed && !isHovered ? '80px' : '260px');

    // Determine if we should show text labels
    // Show text if: Mobile OR Not Collapsed OR (Collapsed AND Hovered)
    const showText = isMobile || !isCollapsed || isHovered;

    useEffect(() => {
        if (isEventsExpanded) {
            setEventsHeight(eventsListRef.current?.scrollHeight || 'auto');
        } else {
            setEventsHeight(0);
        }
    }, [isEventsExpanded, events]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleNavigation = (path: string) => {
        navigate(path);
        // If on mobile, close the sidebar
        if (isMobile && onClose) {
            onClose();
        }
    };

    const isActive = (path: string) => location.pathname === path;

    const navItems: any[] = [
        { label: t('nav.messages'), icon: <MessageSquare size={24} />, path: '/messages' },
        { label: t('nav.directory'), icon: <Globe size={24} />, path: '/directory' },
        { label: t('nav.received'), icon: <Inbox size={24} />, path: '/received' },
        { label: t('nav.guests'), icon: <Users size={24} />, path: '/guests' },
        { label: t('nav.settings'), icon: <Settings size={24} />, path: '/settings' },
        { label: t('nav.help'), icon: <HelpCircle size={24} />, path: '/help' },
    ];

    return (
        <div
            onMouseEnter={() => !isMobile && setIsHovered(true)}
            onMouseLeave={() => !isMobile && setIsHovered(false)}
            style={{
                width: effectiveWidth,
                backgroundColor: colors.cardBg,
                borderRight: `1px solid ${colors.border}`,
                color: colors.text,
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                position: 'fixed',
                left: 0,
                top: 0,
                zIndex: 1100,
                fontFamily: "'Montserrat', sans-serif",
                transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s ease, background-color 0.3s, border-color 0.3s, color 0.3s',
                transform: isMobile && !isOpen ? 'translateX(-100%)' : 'translateX(0)',
                boxShadow: (isOpen && isMobile) || (isCollapsed && isHovered) ? '4px 0 15px rgba(0,0,0,0.05)' : 'none',
                overflowX: 'hidden',
                whiteSpace: 'nowrap'
            }}
        >
            {/* Overlay for mobile to close sidebar when clicking outside */}
            {isOpen && isMobile && (
                <div
                    onClick={onClose}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: '260px',
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        zIndex: 1050,
                        cursor: 'pointer'
                    }}
                />
            )}

            {/* Header / Brand Area */}
            <div style={{
                padding: '1.5rem',
                borderBottom: `1px solid ${colors.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: showText ? 'space-between' : 'center',
                height: '70px',
                boxSizing: 'border-box'
            }}>
                {showText ? (
                    <h2 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '1.2rem',
                        fontWeight: 700,
                        color: colors.text,
                        margin: 0,
                        letterSpacing: '1px',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                    }} onClick={() => handleNavigation('/dashboard')}>
                        BODA<span style={{ fontWeight: 400 }}>DIGITAL</span>
                    </h2>
                ) : (
                    <LayoutDashboard
                        size={32}
                        color={colors.primary}
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleNavigation('/dashboard')}
                    />
                )}

                {/* Pin Button - Only show if not mobile and (expanded OR hovered) */}
                {!isMobile && showText && setIsCollapsed && (
                    <div
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        style={{
                            cursor: 'pointer',
                            color: colors.muted,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '0.5rem',
                            borderRadius: '50%',
                            transition: 'background-color 0.2s, color 0.2s',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
                            e.currentTarget.style.color = colors.primary;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = colors.muted;
                        }}
                        title={isCollapsed ? t('nav.pin_sidebar') : t('nav.unpin_sidebar')}
                    >
                        {isCollapsed ? <Pin size={18} /> : <PinOff size={18} />}
                    </div>
                )}

                {/* Close button for mobile */}
                {isMobile && (
                    <div
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            top: '1.5rem',
                            right: '1rem',
                            padding: '0.5rem',
                            cursor: 'pointer'
                        }}
                    >
                        <ChevronDown size={20} style={{ transform: 'rotate(90deg)' }} />
                    </div>
                )}
            </div>

            {/* Content Scrollable */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                overflowX: 'hidden',
                padding: '1.5rem 0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: showText ? 'stretch' : 'center'
            }}>

                {/* User Section (Mini Profile) */}
                <div
                    onClick={() => handleNavigation('/account')}
                    style={{
                        padding: showText ? '0 1.5rem' : '0 1rem',
                        marginBottom: '2rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.8rem',
                        cursor: 'pointer',
                        justifyContent: showText ? 'flex-start' : 'center',
                        width: '100%',
                        boxSizing: 'border-box'
                    }}
                >
                    <div style={{
                        width: '40px', height: '40px', borderRadius: '50%',
                        backgroundColor: colors.border,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: colors.muted,
                        flexShrink: 0
                    }}>
                        <User size={20} />
                    </div>
                    {showText && (
                        <>
                            <span style={{ fontWeight: 600, fontSize: '0.9rem', color: colors.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {user?.username || t('profile.my_account')}
                            </span>
                            <Settings size={14} color={colors.muted} style={{ marginLeft: 'auto', opacity: 0.7 }} />
                        </>
                    )}
                </div>

                {/* Section: Mis Envíos */}
                <div style={{
                    padding: showText ? '0 1.5rem' : '0',
                    marginBottom: '0.5rem',
                    width: '100%',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: showText ? 'stretch' : 'center'
                }}>
                    {showText ? (
                        <div
                            onClick={() => setIsEventsExpanded(!isEventsExpanded)}
                            style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1px', opacity: 0.8, marginBottom: '1rem',
                                color: colors.muted, cursor: 'pointer', userSelect: 'none'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{
                                    transition: 'transform 0.3s ease',
                                    transform: isEventsExpanded ? 'rotate(0deg)' : 'rotate(-90deg)'
                                }}>
                                    <ChevronDown size={14} />
                                </div>
                                <span>{t('nav.my_events')}</span>
                            </div>
                            <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }} onClick={(e) => { e.stopPropagation(); handleNavigation('/create'); }}>
                                {t('nav.new')} <Plus size={12} />
                            </span>
                        </div>
                    ) : (
                        <div
                            onClick={(e) => { e.stopPropagation(); handleNavigation('/create'); }}
                            style={{
                                marginBottom: '1rem',
                                cursor: 'pointer',
                                color: colors.muted
                            }}
                            title={t('nav.new_event')}
                        >
                            <Plus size={24} />
                        </div>
                    )}

                    {/* Event List Items container with smooth height transition */}
                    {showText && (
                        <div style={{
                            maxHeight: isEventsExpanded ? eventsHeight : 0,
                            overflow: 'hidden',
                            transition: 'max-height 0.4s ease-in-out, opacity 0.4s ease-in-out',
                            opacity: isEventsExpanded ? 1 : 0
                        }}>
                            <ul ref={eventsListRef} style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem', paddingLeft: '1rem', paddingBottom: '0.5rem' }}>
                                {events.length > 0 ? (
                                    events.map((ev) => (
                                        <li
                                            key={ev.id}
                                            style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.8rem', opacity: 1, color: colors.text, cursor: 'pointer' }}
                                            onClick={() => handleNavigation(`/dashboard/event/${ev.id}`)}
                                        >
                                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: colors.primary }}></div>
                                            <span style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '150px' }}>
                                                {ev.partner1} & {ev.partner2}
                                            </span>
                                        </li>
                                    ))
                                ) : (
                                    <li style={{ fontSize: '0.85rem', color: colors.muted, fontStyle: 'italic' }}>
                                        {t('nav.no_events')}
                                    </li>
                                )}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Divider */}
                <div style={{ height: '1px', width: showText ? '100%' : '50%', backgroundColor: colors.border, margin: '1.5rem 0' }}></div>

                {/* Main Navigation */}
                <nav style={{ width: '100%' }}>
                    <div
                        onClick={() => handleNavigation('/dashboard')}
                        style={{
                            padding: showText ? '0.8rem 1.5rem' : '0.8rem 0',
                            display: 'flex', alignItems: 'center',
                            gap: '1rem',
                            justifyContent: showText ? 'flex-start' : 'center',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                            fontWeight: 600,
                            fontSize: '0.85rem',
                            letterSpacing: '0.5px',
                            color: isActive('/dashboard') ? colors.primary : colors.muted,
                            backgroundColor: isActive('/dashboard') ? (theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)') : 'transparent'
                        }}
                        title={!showText ? t('nav.home') : ''}
                    >
                        <LayoutDashboard size={24} />
                        {showText && <span>{t('nav.home')}</span>}
                    </div>

                    {navItems.map((item) => (
                        <div
                            key={item.path}
                            onClick={() => handleNavigation(item.path)}
                            style={{
                                padding: showText ? '0.8rem 1.5rem' : '0.8rem 0',
                                display: 'flex', alignItems: 'center',
                                gap: '1rem',
                                justifyContent: showText ? 'flex-start' : 'center',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s',
                                fontWeight: 600,
                                fontSize: '0.85rem',
                                letterSpacing: '0.5px',
                                color: isActive(item.path) ? (theme === 'dark' ? '#34D399' : '#059669') : colors.muted,
                                backgroundColor: isActive(item.path) ? (theme === 'dark' ? 'rgba(52, 211, 153, 0.1)' : 'rgba(5, 150, 105, 0.05)') : 'transparent'
                            }}
                            title={!showText ? item.label : ''}
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
                            {item.icon}
                            {showText && <span>{item.label}</span>}
                        </div>
                    ))}
                </nav>
            </div>

            {/* Footer Actions */}
            <div style={{
                padding: '1.5rem',
                borderTop: `1px solid ${colors.border}`,
                fontSize: '0.85rem',
                color: colors.muted,
                display: 'flex',
                flexDirection: 'column',
                alignItems: showText ? 'flex-start' : 'center',
                gap: '1rem'
            }}>
                <div
                    onClick={toggleTheme}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', opacity: 0.9, color: colors.text }}
                    title={theme === 'dark' ? t('footer.mode_night') : t('footer.mode_day')}
                >
                    {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                    {showText && (theme === 'dark' ? t('footer.mode_night') : t('footer.mode_day'))}
                </div>

                <div
                    onClick={toggleLanguage}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', opacity: 0.9 }}
                    title={language === 'es' ? t('footer.lang_es') : t('footer.lang_en')}
                >
                    <Globe size={20} />
                    {showText && (
                        <>
                            {language === 'es' ? t('footer.lang_es') : t('footer.lang_en')}
                            <ChevronDown size={14} />
                        </>
                    )}
                </div>


                <div
                    onClick={handleLogout}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', opacity: 0.9, color: '#EF4444' }}
                    title={t('footer.logout')}
                >
                    <LogOut size={20} />
                    {showText && t('footer.logout')}
                </div>
            </div>
        </div>
    );
};

export default PlatformSidebar;
