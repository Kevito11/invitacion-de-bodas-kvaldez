import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';

const EventsTable: React.FC = () => {
    const { user } = useAuth();
    const { colors, theme } = useTheme();
    const navigate = useNavigate();
    const [events, setEvents] = useState<any[]>([]);

    // Load events from new array structure
    useEffect(() => {
        if (user?.username) {
            const rawData = localStorage.getItem(`events_${user.username}`);
            if (rawData) {
                try {
                    const parsedEvents = JSON.parse(rawData);
                    if (Array.isArray(parsedEvents)) {
                        const mappedEvents = parsedEvents.map((ev: any) => ({
                            id: ev.id,
                            title: `Boda de ${ev.partner1} & ${ev.partner2}`,
                            originalData: ev,
                            type: 'Invitación + Confirmación de asistencia',
                            image: ev.imageUrl || null,
                            created: new Date().toLocaleDateString('es-ES'), // Could add created field later
                            eventDate: ev.date ? new Date(ev.date).toLocaleDateString('es-ES') : 'Por definir',
                            lastDelivery: 'Sin enviar',
                            openRate: 0,
                            responseRate: 0,
                            status: 'Modo de prueba'
                        }));
                        setEvents(mappedEvents);
                    }
                } catch (e) {
                    console.error("Error loading events", e);
                    setEvents([]);
                }
            } else {
                // Fallback check for migration if user goes straight here
                const oldData = localStorage.getItem(`invitation_${user.username}`);
                if (oldData) {
                    // We don't auto-migrate here, let Dashboard handle it or just show empty.
                    // Better to behave empty to avoid conflict, user should "Create" or "Edit"
                    setEvents([]);
                }
            }
        }
    }, [user]);



    const handleEdit = () => {
        navigate('/create');
    };

    return (
        <div style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.border}`, borderRadius: '4px', overflow: 'hidden', fontFamily: "'Montserrat', sans-serif" }}>
            {/* Toolbar */}
            <div style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${colors.border}` }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button style={{ padding: '0.5rem 1rem', border: `1px solid ${colors.border}`, background: colors.cardBg, borderRadius: '4px', color: theme === 'dark' ? '#34D399' : '#059669', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>Activo</button>
                    <button style={{ padding: '0.5rem 1rem', border: `1px solid ${colors.border}`, background: 'transparent', borderRadius: '4px', color: colors.muted, fontSize: '0.85rem', cursor: 'pointer' }}>Archivado</button>
                </div>
                <input
                    type="text"
                    placeholder="Buscar eventos"
                    style={{
                        padding: '0.5rem',
                        border: `1px solid ${colors.border}`,
                        borderRadius: '4px',
                        fontSize: '0.85rem',
                        background: colors.bg,
                        color: colors.text,
                        outline: 'none'
                    }}
                />
            </div>

            {/* Table */}
            <div style={{ width: '100%', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', color: colors.text }}>
                    <thead style={{ backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0.2)' : '#F9FAFB', borderBottom: `1px solid ${colors.border}` }}>
                        <tr>
                            <th style={{ padding: '1rem', width: '40px' }}><input type="checkbox" /></th>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Título del envío</th>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Creado el</th>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Fecha del evento</th>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Última entrega</th>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Tasa de apertura</th>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Tasa de respuesta</th>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Comprar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.length > 0 ? (
                            events.map(ev => (
                                <tr key={ev.id} style={{ borderBottom: `1px solid ${colors.border}` }}>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}><input type="checkbox" /></td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                            <div style={{
                                                width: '60px', height: '60px',
                                                backgroundColor: '#E5E7EB',
                                                borderRadius: '4px',
                                                backgroundImage: ev.image ? `url(${ev.image})` : 'none',
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}>
                                                {!ev.image && <Calendar size={20} color="#9CA3AF" />}
                                            </div>
                                            <div>
                                                <div
                                                    onClick={() => navigate(`/dashboard/event/${ev.id}`)}
                                                    style={{
                                                        fontWeight: 600,
                                                        color: theme === 'dark' ? '#34D399' : '#059669',
                                                        marginBottom: '0.2rem',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    {ev.title}
                                                </div>
                                                <div style={{ fontStyle: 'italic', color: colors.muted, fontSize: '0.8rem' }}>{ev.type}</div>
                                                <div style={{ marginTop: '0.3rem', fontSize: '0.75rem', color: colors.muted, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>+ Etiquetas</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>{ev.created}</td>
                                    <td style={{ padding: '1rem' }}>{ev.eventDate}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: ev.lastDelivery === 'Sin enviar' ? colors.border : '#60A5FA' }}></div>
                                            {ev.lastDelivery}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <div style={{ width: '60px', height: '6px', backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : '#E5E7EB', borderRadius: '4px', overflow: 'hidden' }}>
                                                <div style={{ width: `${ev.openRate}%`, height: '100%', backgroundColor: '#D4AF37' }}></div>
                                            </div>
                                            <span>{ev.openRate}%</span>
                                        </div>
                                        <div style={{ fontSize: '0.7rem', color: theme === 'dark' ? '#34D399' : '#059669', cursor: 'pointer', marginTop: '0.2rem' }}>View Details</div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <div style={{ width: '60px', height: '6px', backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : '#E5E7EB', borderRadius: '4px', overflow: 'hidden' }}>
                                                <div style={{ width: `${ev.responseRate}%`, height: '100%', backgroundColor: '#10B981' }}></div>
                                            </div>
                                            <span>{ev.responseRate}%</span>
                                        </div>
                                        <div style={{ fontSize: '0.7rem', color: theme === 'dark' ? '#34D399' : '#059669', cursor: 'pointer', marginTop: '0.2rem' }}>View Details</div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        {ev.status === 'Comprado' ? (
                                            <span style={{ color: colors.text }}>Comprado</span>
                                        ) : (
                                            <span style={{ backgroundColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.2)' : '#FEE2E2', color: '#EF4444', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600 }}>Modo de prueba</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                                <td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: colors.muted }}>
                                    No tienes eventos activos.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EventsTable;
