import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Heart, Bell, ChevronDown } from 'lucide-react';

const GlobalPlatformNav: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const colors = {
        primary: "#E6BEAE", // Dusty Blush
        text: "#4A4A4A",
        border: "#E5E7EB",
        hover: "#F9FAFB"
    };

    return (
        <nav style={{
            backgroundColor: 'white',
            borderBottom: `1px solid ${colors.border}`,
            padding: '0 2rem',
            height: '70px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 50
        }}>
            {/* Left: Brand & Main Links */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                <div
                    onClick={() => navigate('/dashboard')}
                    style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '1.4rem',
                        fontWeight: 700,
                        color: colors.text,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        cursor: 'pointer'
                    }}
                >
                    <div style={{ backgroundColor: colors.primary, borderRadius: '50%', padding: '5px', display: 'flex' }}>
                        <Heart size={16} fill="white" color="white" />
                    </div>
                    BodaDigital
                </div>

                <div style={{ display: 'flex', gap: '2rem' }}>
                    <button
                        onClick={() => navigate('/dashboard')}
                        style={{
                            background: 'none', border: 'none',
                            fontWeight: 600, color: colors.text,
                            cursor: 'pointer', fontSize: '0.9rem',
                            borderBottom: `2px solid ${colors.primary}`,
                            padding: '1.45rem 0'
                        }}
                    >
                        Mis Eventos
                    </button>
                    <button
                        style={{
                            background: 'none', border: 'none',
                            fontWeight: 500, color: '#9CA3AF',
                            cursor: 'pointer', fontSize: '0.9rem',
                            padding: '1.45rem 0',
                            transition: 'color 0.2s'
                        }}
                    >
                        Contactos
                    </button>
                    <button
                        style={{
                            background: 'none', border: 'none',
                            fontWeight: 500, color: '#9CA3AF',
                            cursor: 'pointer', fontSize: '0.9rem',
                            padding: '1.45rem 0',
                            transition: 'color 0.2s'
                        }}
                    >
                        Inspiración
                    </button>
                </div>
            </div>

            {/* Right: User Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}>
                    <Bell size={20} />
                </button>
                <div style={{ height: '24px', width: '1px', backgroundColor: colors.border }}></div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer' }}>
                    <div style={{
                        width: '32px', height: '32px', borderRadius: '50%',
                        backgroundColor: colors.primary, color: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: '0.9rem'
                    }}>
                        {user?.username.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontSize: '0.9rem', fontWeight: 500, color: colors.text }}>{user?.username}</span>
                    <ChevronDown size={16} color="#9CA3AF" />
                </div>

                <button
                    onClick={handleLogout}
                    title="Cerrar sesión"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', marginLeft: '0.5rem' }}
                >
                    <LogOut size={18} />
                </button>
            </div>
        </nav>
    );
};

export default GlobalPlatformNav;
