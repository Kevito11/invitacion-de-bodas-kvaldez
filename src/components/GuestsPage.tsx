import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useEvents } from '../context/EventsContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { Users, ArrowRight } from 'lucide-react';

const GuestsPage: React.FC = () => {
    const { t } = useLanguage();
    const { events } = useEvents();
    const { colors, theme } = useTheme();
    const navigate = useNavigate();

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ padding: '0.8rem', backgroundColor: '#EFF6FF', borderRadius: '12px', color: '#2563EB' }}>
                    <Users size={24} />
                </div>
                <div>
                    <h1 style={{ margin: 0, fontSize: '1.5rem', color: colors.text }}>{t('nav.guests')}</h1>
                    <p style={{ margin: '0.2rem 0 0', color: colors.muted }}>Selecciona un evento para gestionar sus invitados.</p>
                </div>
            </div>

            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                {events.map(event => (
                    <div
                        key={event.id}
                        onClick={() => navigate(`/dashboard/event/${event.id}`)}
                        style={{
                            backgroundColor: colors.cardBg,
                            padding: '1.5rem',
                            borderRadius: '12px',
                            border: `1px solid ${colors.border}`,
                            cursor: 'pointer',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        <div>
                            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem', color: colors.text }}>
                                {event.partner1} & {event.partner2}
                            </h3>
                            <div style={{ fontSize: '0.9rem', color: colors.muted }}>
                                {event.date || 'Fecha pendiente'}
                            </div>
                            <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#6366F1', fontWeight: 500 }}>
                                {Array.isArray(event.guests) ? event.guests.length : 0} Invitados
                            </div>
                        </div>
                        <ArrowRight size={20} color="#9CA3AF" />
                    </div>
                ))}

                {events.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: '#9CA3AF', backgroundColor: '#F9FAFB', borderRadius: '12px', border: '1px dashed #E5E7EB' }}>
                        No tienes eventos activos.
                    </div>
                )}
            </div>
        </div>
    );
};

export default GuestsPage;
