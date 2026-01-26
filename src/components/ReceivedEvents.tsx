import React from 'react';
import { Inbox } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ReceivedEvents: React.FC = () => {
    const { colors, theme } = useTheme();

    return (
        <div style={{ padding: '3rem', fontFamily: "'Montserrat', sans-serif", textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
                width: '80px', height: '80px',
                backgroundColor: theme === 'dark' ? colors.cardBg : '#F3F4F6',
                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem',
                border: `1px solid ${colors.border}`
            }}>
                <Inbox size={40} color={colors.muted} />
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: colors.text, margin: '0 0 1rem' }}>
                Envíos Recibidos
            </h1>
            <p style={{ color: colors.muted, fontSize: '1.1rem', maxWidth: '500px', lineHeight: '1.6' }}>
                Aquí aparecerán las invitaciones que te han enviado otros usuarios de BodaDigital.
            </p>
            <button style={{ marginTop: '2rem', padding: '0.8rem 2rem', backgroundColor: '#57B07B', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 600, cursor: 'pointer' }}>
                Buscar invitaciones por email
            </button>
        </div>
    );
};

export default ReceivedEvents;
