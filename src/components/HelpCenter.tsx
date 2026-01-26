import React from 'react';
import { useTheme } from '../context/ThemeContext';

const HelpCenter: React.FC = () => {
    const { colors } = useTheme();

    return (
        <div style={{ padding: '3rem', fontFamily: "'Montserrat', sans-serif" }}>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', color: colors.text }}>
                Centro de Ayuda
            </h1>
            <p style={{ color: colors.muted, fontSize: '1.1rem', marginTop: '1rem' }}>
                ¿Necesitas asistencia? Explora nuestras guías o contáctanos.
            </p>
            {/* Placeholder content */}
            <div style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                {['Primeros pasos', 'Diseñando tu invitación', 'Gestionando invitados', 'Envíos y entregas'].map((topic) => (
                    <div key={topic} style={{
                        padding: '2rem', backgroundColor: colors.cardBg, borderRadius: '8px',
                        border: `1px solid ${colors.border}`, display: 'flex', flexDirection: 'column',
                        alignItems: 'center', textAlign: 'center', cursor: 'pointer',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                    }}>
                        <h3 style={{ margin: '0 0 1rem', color: colors.text }}>{topic}</h3>
                        <span style={{ color: '#57B07B', fontWeight: 600 }}>Ver artículos &rarr;</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HelpCenter;
