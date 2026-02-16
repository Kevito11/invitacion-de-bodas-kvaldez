import React, { useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useEvents } from '../context/EventsContext';
import { MessageSquare, User, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Messages: React.FC = () => {
    const { t } = useLanguage();
    const { events } = useEvents();
    const navigate = useNavigate();

    // Aggregate messages from all guests in all events
    const allMessages = useMemo(() => {
        const msgs: Array<{
            id: string,
            guestName: string,
            eventName: string,
            eventId: string,
            message: string,
            status: string,
            date?: string // We might not have date yet, but good to have in structure
        }> = [];

        events.forEach(event => {
            if (event.guests && Array.isArray(event.guests)) {
                event.guests.forEach(guest => {
                    // Check for 'message' or fallback to 'notes' if it looks like a message
                    // Some users might use notes for dietary restrictions, but often for messages too.
                    // For now, let's explicitly look for our new 'message' field,
                    // and maybe show 'notes' if 'message' is empty, but labeled as such.
                    const content = guest.message || guest.notes;

                    if (content) {
                        msgs.push({
                            id: guest.id,
                            guestName: guest.name,
                            eventName: `${event.partner1} & ${event.partner2}`,
                            eventId: event.id!,
                            message: content,
                            status: guest.status
                        });
                    }
                });
            }
        });

        return msgs;
    }, [events]);

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ padding: '0.8rem', backgroundColor: '#EFF6FF', borderRadius: '12px', color: '#2563EB' }}>
                    <MessageSquare size={24} />
                </div>
                <div>
                    <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#1F2937' }}>{t('nav.messages')}</h1>
                    <p style={{ margin: '0.2rem 0 0', color: '#6B7280' }}>
                        Mensajes recibidos de tus invitados al confirmar asistencia.
                    </p>
                </div>
            </div>

            {allMessages.length > 0 ? (
                <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                    {allMessages.map((msg, idx) => (
                        <div key={`${msg.id}-${idx}`} style={{
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            border: '1px solid #E5E7EB',
                            padding: '1.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}>
                                        <User size={16} />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 600, color: '#111827', fontSize: '0.95rem' }}>{msg.guestName}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#6B7280' }}>{msg.eventName}</div>
                                    </div>
                                </div>
                                <div title={msg.status === 'confirmed' ? 'Asistirá' : (msg.status === 'declined' ? 'No asistirá' : 'Pendiente')}>
                                    {msg.status === 'confirmed' && <CheckCircle size={20} color="#10B981" />}
                                    {msg.status === 'declined' && <XCircle size={20} color="#EF4444" />}
                                    {msg.status === 'pending' && <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#F59E0B' }}></div>}
                                </div>
                            </div>

                            <div style={{
                                flex: 1,
                                backgroundColor: '#F9FAFB',
                                borderRadius: '8px',
                                padding: '1rem',
                                fontSize: '0.9rem',
                                color: '#374151',
                                fontStyle: 'italic',
                                position: 'relative'
                            }}>
                                "{msg.message}"
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <button
                                    onClick={() => navigate(`/dashboard/event/${msg.eventId}`)}
                                    style={{
                                        fontSize: '0.8rem',
                                        color: '#2563EB',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontWeight: 500
                                    }}
                                >
                                    Ver Evento &rarr;
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{
                    textAlign: 'center',
                    padding: '4rem 2rem',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    border: '1px dashed #E5E7EB',
                    color: '#9CA3AF'
                }}>
                    <MessageSquare size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                    <h3 style={{ margin: '0 0 0.5rem', color: '#374151' }}>No tienes mensajes aún</h3>
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>
                        Cuando tus invitados confirmen y dejen un mensaje, aparecerá aquí.
                    </p>
                </div>
            )}
        </div>
    );
};

export default Messages;
