import React, { useState } from 'react';
import { Search, ChevronDown, HelpCircle, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
// import { useNavigate } from 'react-router-dom'; // Removed unused
import { useTheme } from '../context/ThemeContext';

const MessagesCenter: React.FC = () => {
    const { user } = useAuth();
    // const navigate = useNavigate(); // Removed unused
    const { colors, theme } = useTheme();
    const [activeTab, setActiveTab] = useState('inbox');

    return (
        <div style={{ padding: '2rem 3rem', fontFamily: "'Montserrat', sans-serif", maxWidth: '1400px', margin: '0 auto', height: 'calc(100vh - 4rem)', display: 'flex', flexDirection: 'column', color: colors.text }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.2rem', color: colors.text, margin: 0 }}>
                    Centro de mensajes
                </h1>

                <div style={{
                    border: `1px solid ${colors.border}`, padding: '0.5rem 1rem', borderRadius: '4px',
                    backgroundColor: colors.cardBg, display: 'flex', alignItems: 'center', gap: '0.5rem',
                    fontSize: '0.9rem', color: colors.text, cursor: 'pointer'
                }}>
                    Boda de {user?.username} <ChevronDown size={14} />
                </div>

                <HelpCircle size={20} color={colors.text} style={{ cursor: 'pointer' }} />
            </div>

            {/* Warning Alert */}
            <div style={{
                backgroundColor: theme === 'dark' ? 'rgba(252, 211, 77, 0.1)' : '#FFFBEB',
                border: `1px solid ${theme === 'dark' ? '#78350F' : '#FEF3C7'}`,
                borderRadius: '4px',
                padding: '1rem', display: 'flex', gap: '1rem', marginBottom: '2rem'
            }}>
                <div style={{
                    backgroundColor: '#FCD34D', borderRadius: '4px', width: '24px', height: '24px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <span style={{ color: 'white', fontWeight: 'bold' }}>!</span>
                </div>
                <div style={{ fontSize: '0.9rem', color: theme === 'dark' ? '#FDE68A' : '#92400E' }}>
                    <div style={{ fontWeight: 600, marginBottom: '0.2rem' }}>
                        Necesita verificar su dirección de correo electrónico antes de enviar.
                    </div>
                    <div style={{ textDecoration: 'underline', cursor: 'pointer', fontStyle: 'italic', color: theme === 'dark' ? '#34D399' : '#047857' }}>
                        Haga clic aquí para enviar el email de verificación.
                    </div>
                </div>
            </div>

            {/* Controls Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: `1px solid ${colors.border}` }}>
                <div style={{ display: 'flex' }}>
                    <TabButton active={activeTab === 'inbox'} label="Bandeja de entrada" onClick={() => setActiveTab('inbox')} colors={colors} theme={theme} />
                    <TabButton active={activeTab === 'sent'} label="Enviadas" onClick={() => setActiveTab('sent')} colors={colors} theme={theme} />
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                    <button style={{
                        border: `1px solid ${theme === 'dark' ? '#34D399' : '#10B981'}`,
                        color: theme === 'dark' ? '#34D399' : '#10B981',
                        background: colors.cardBg,
                        padding: '0.5rem 1rem', borderRadius: '4px', fontWeight: 600, fontSize: '0.8rem',
                        display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', letterSpacing: '1px'
                    }}>
                        <Plus size={14} /> MENSAJE NUEVO
                    </button>
                    <button style={{
                        backgroundColor: theme === 'dark' ? '#059669' : '#57B07B', color: 'white', border: 'none',
                        padding: '0.5rem 1rem', borderRadius: '4px', fontWeight: 600, fontSize: '0.8rem',
                        cursor: 'pointer', letterSpacing: '1px'
                    }}>
                        VOLVER A BODA DE {user?.username?.toUpperCase()}
                    </button>
                </div>
            </div>

            {/* Content Split View */}
            <div style={{ flex: 1, display: 'flex', border: `1px solid ${colors.border}`, borderTop: 'none', backgroundColor: colors.cardBg }}>

                {/* Left: List */}
                <div style={{ width: '350px', borderRight: `1px solid ${colors.border}`, padding: '1rem' }}>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', color: colors.text, margin: '0 0 1rem' }}>
                        Conversaciones activas
                    </h3>
                    <div style={{ position: 'relative' }}>
                        <input
                            type="text"
                            placeholder="Buscar en la Bandeja..."
                            style={{
                                width: '100%', padding: '0.6rem 2rem 0.6rem 0.8rem',
                                border: `1px solid ${colors.border}`, borderRadius: '2px', fontSize: '0.85rem',
                                backgroundColor: colors.bg, color: colors.text
                            }}
                        />
                        <Search size={14} style={{ position: 'absolute', right: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: colors.muted }} />
                    </div>
                </div>

                {/* Right: Empty State */}
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', color: colors.muted, opacity: 0.7 }}>
                        No hay mensajes seleccionados
                    </h3>
                </div>

            </div>
        </div>
    );
};

interface TabButtonProps {
    active: boolean;
    label: string;
    onClick: () => void;
    colors: any;
    theme: string;
}

const TabButton: React.FC<TabButtonProps> = ({ active, label, onClick, colors, theme }) => (
    <button
        onClick={onClick}
        style={{
            background: active ? colors.cardBg : colors.bg,
            border: `1px solid ${colors.border}`,
            borderBottom: active ? `1px solid ${colors.cardBg}` : `1px solid ${colors.border}`,
            marginBottom: '-1px', // Overlay border
            padding: '1rem 2rem',
            color: active ? (theme === 'dark' ? '#34D399' : '#10B981') : colors.muted,
            fontWeight: active ? 600 : 500,
            fontSize: '0.9rem',
            cursor: 'pointer',
            borderTopLeftRadius: '4px',
            borderTopRightRadius: '4px',
            position: 'relative',
            zIndex: active ? 10 : 0
        }}
    >
        {label}
    </button>
);

export default MessagesCenter;
