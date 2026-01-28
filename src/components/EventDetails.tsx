import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate, useParams } from 'react-router-dom';
import { useEvents } from '../context/EventsContext';
import {
    Edit2, ChevronRight, HelpCircle, Download, Copy, Archive,
    Check, Image as ImageIcon
} from 'lucide-react';

const EventDetails: React.FC = () => {
    const { user } = useAuth();
    const { colors, theme } = useTheme();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { events: allEvents } = useEvents();
    const [event, setEvent] = useState<any>(null);

    // Fetch event data
    useEffect(() => {
        if (id && allEvents.length > 0) {
            const foundEvent = allEvents.find((e: any) => e.id === id);

            if (foundEvent) {
                setEvent({
                    ...foundEvent,
                    title: `Boda de ${foundEvent.partner1} & ${foundEvent.partner2}`,
                    dateFormatted: foundEvent.date ? new Date(foundEvent.date).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Fecha por definir',
                    time: foundEvent.time || '4:30 p.m.',
                    location: foundEvent.venueAddress || 'Dirección por definir',
                    hostEmail: user?.username ? `${user.username.toLowerCase()}@hotmail.com` : 'email@example.com',
                    image: foundEvent.imageUrl || (foundEvent.mediaLibrary?.[0] || ''),
                    // Real stats
                    clickedCount: foundEvent.guests?.filter((g: any) => g.status === 'confirmed' || g.status === 'declined').length || 0,
                    responseRate: (foundEvent.guests?.length > 0)
                        ? Math.round(((foundEvent.guests.filter((g: any) => g.status === 'confirmed' || g.status === 'declined').length) / foundEvent.guests.length) * 100)
                        : 0,
                    attending: foundEvent.guests?.filter((g: any) => g.status === 'confirmed').length || 0,
                    notAttending: foundEvent.guests?.filter((g: any) => g.status === 'declined').length || 0,
                    pending: foundEvent.guests?.filter((g: any) => g.status === 'pending').length || 0
                });

                // Set opened count to be at least the clicked count (heuristic since we lack tracking)
                setEvent((prev: any) => ({
                    ...prev,
                    openedCount: Math.max(prev.openedCount, prev.clickedCount)
                }));
            } else {
                // If not found in array, maybe try legacy fallback ONLY if ID matches legacy ID?
                // Or just don't load.
                console.warn("Event not found with ID:", id);
            }
        }
    }, [id, allEvents, user]);

    if (!event) return null;

    const brandColor = theme === 'dark' ? '#34D399' : '#57B07B';
    const cardBg = colors.cardBg;
    const borderColor = colors.border;

    return (
        <div style={{ padding: '2rem 3rem', fontFamily: "'Montserrat', sans-serif", maxWidth: '1400px', margin: '0 auto', color: colors.text }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.2rem', color: colors.text, margin: 0 }}>
                            {event.title}
                        </h1>
                        <Edit2 size={18} color={brandColor} style={{ cursor: 'pointer' }} onClick={() => navigate('/create')} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: brandColor, cursor: 'pointer' }}>
                        + Etiqueta <HelpCircle size={14} color={colors.muted} />
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                    <button
                        onClick={() => navigate('/create')}
                        style={{
                            backgroundColor: brandColor, color: 'white', border: 'none',
                            padding: '0.8rem 1.5rem', fontWeight: 700, letterSpacing: '0.5px',
                            borderRadius: '4px', cursor: 'pointer', textTransform: 'uppercase', fontSize: '0.85rem'
                        }}
                    >
                        TRABAJAR EN 'INVITACIÓN'
                    </button>
                    <div style={{ fontSize: '0.75rem', color: colors.muted, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Check size={12} /> Se guardaron todos los cambios
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '2rem' }}>

                {/* Left Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* Plan Info */}
                    <div style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}`, borderRadius: '4px', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Plan actual: 140 personas</div>
                        <button style={{ backgroundColor: brandColor, color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', textTransform: 'uppercase' }}>
                            VER TARIFAS
                        </button>
                    </div>

                    {/* Preview Card */}
                    <div style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}`, borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ padding: '1rem', borderBottom: `1px solid ${borderColor}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', margin: 0, color: colors.text }}>Vista previa</h3>
                            <button onClick={() => navigate(`/dashboard/event/edit/${event.id}`)} style={{ background: 'none', border: `1px solid ${borderColor}`, borderRadius: '4px', padding: '0.3rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: brandColor, cursor: 'pointer' }}>
                                Editar el diseño <ChevronRight size={14} />
                            </button>
                        </div>
                        <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center', backgroundColor: colors.bg }}>
                            <div style={{
                                width: '100%', maxWidth: '250px', aspectRatio: '3/4',
                                backgroundColor: 'white', boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                                backgroundImage: event.image ? `url(${event.image})` : 'none',
                                backgroundSize: 'cover', backgroundPosition: 'center',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                {!event.image && <ImageIcon size={40} color="#E5E7EB" />}
                            </div>
                        </div>
                        <div style={{ padding: '1rem', borderTop: `1px solid ${borderColor}`, display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                            {/* Buttons removed as requested */}
                        </div>
                        <div style={{ padding: '1.5rem', textAlign: 'center', borderTop: `1px solid ${borderColor}` }}>
                            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', color: '#D4AF37' }}>Fairytale Blossoms</div>
                            <div style={{ fontSize: '0.75rem', color: colors.muted, textTransform: 'uppercase', letterSpacing: '1px', marginTop: '0.3rem' }}>PLUM PRETTY SUGAR</div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                        <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.8rem', backgroundColor: cardBg, border: `1px solid ${borderColor}`, borderRadius: '4px', color: brandColor, fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
                            <Download size={14} /> Descargar
                        </button>
                        <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.8rem', backgroundColor: cardBg, border: `1px solid ${borderColor}`, borderRadius: '4px', color: brandColor, fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
                            <Copy size={14} /> Clonar
                        </button>
                        <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.8rem', backgroundColor: cardBg, border: `1px solid ${borderColor}`, borderRadius: '4px', color: colors.muted, fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
                            <Archive size={14} /> Archivar
                        </button>
                    </div>

                </div>

                {/* Right Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* Details Card */}
                    <div style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}`, borderRadius: '4px' }}>
                        <div style={{ padding: '1rem', borderBottom: `1px solid ${borderColor}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', margin: 0, color: colors.text }}>Detalles</h3>
                            {/* Edit Details button removed */}
                        </div>
                        <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
                            <div>
                                <div style={{ fontSize: '0.9rem', fontStyle: 'italic', marginBottom: '1.5rem' }}>{event.dateFormatted}</div>
                                <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{event.partner1} & {event.partner2}</div>
                                <div style={{ color: colors.muted, fontSize: '0.9rem', marginTop: '0.2rem' }}>{event.hostEmail}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.9rem', marginBottom: '0.2rem' }}><strong>{event.time}</strong>, {event.dateFormatted}</div>
                                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Hotel W&P</div>
                                <div style={{ color: colors.muted, fontSize: '0.9rem', marginTop: '0.2rem' }}>{event.location}</div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

                        {/* Delivery Stats */}
                        <div style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}`, borderRadius: '4px' }}>
                            <div style={{ padding: '1rem', borderBottom: `1px solid ${borderColor}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', margin: 0, color: colors.text }}>Entrega</h3>
                                <button style={{ background: 'none', border: 'none', fontSize: '0.75rem', color: brandColor, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}>
                                    Ir a la página 'Entrega' <ChevronRight size={12} />
                                </button>
                            </div>
                            <div style={{ padding: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Tasa de apertura</span>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{event.openRate}%</span>
                                </div>
                                <div style={{ width: '100%', height: '6px', backgroundColor: '#E5E7EB', borderRadius: '3px', marginBottom: '1.5rem', overflow: 'hidden' }}>
                                    <div style={{ width: `${event.openRate}%`, height: '100%', backgroundColor: '#D4AF37' }}></div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                                    <div style={{ fontSize: '0.75rem', color: colors.muted, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        Optimizador de entrega <HelpCircle size={12} />
                                        <div style={{ width: '30px', height: '16px', backgroundColor: '#E5E7EB', borderRadius: '10px', position: 'relative', cursor: 'pointer' }}>
                                            <div style={{ width: '12px', height: '12px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: '2px', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }}></div>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#D4AF37' }}></div> Abiertos</span>
                                            <span style={{ fontWeight: 600 }}>{event.openedCount}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#93C5FD' }}></div> Respondidos</span>
                                            <span style={{ fontWeight: 600 }}>{event.clickedCount}</span>
                                        </div>
                                    </div>
                                    {/* Dynamic Donut Chart for Delivery */}
                                    {(() => {
                                        const total = event.guests?.length || 0;
                                        if (total === 0) {
                                            return <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: '12px solid #E5E7EB' }}></div>;
                                        }
                                        // Segments: 
                                        // 1. Responded (Blue)
                                        // 2. Opened but not Responded (Gold) -> openedCount - clickedCount
                                        // 3. Unopened (Gray) -> Rest

                                        const pResponded = (event.clickedCount / total) * 100;
                                        const pOpenedOnly = ((event.openedCount - event.clickedCount) / total) * 100; // Assuming opened includes clicked

                                        const stop1 = pResponded;
                                        const stop2 = stop1 + Math.max(0, pOpenedOnly);

                                        return (
                                            <div style={{
                                                width: '80px', height: '80px', borderRadius: '50%',
                                                background: `conic-gradient(#93C5FD 0% ${stop1}%, #D4AF37 ${stop1}% ${stop2}%, #E5E7EB ${stop2}% 100%)`,
                                                // Make it a donut with a mask or just a circle. The original was a border donut.
                                                // To make it look like a donut with conic-gradient, we need a mask or an inner white circle.
                                                position: 'relative',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}>
                                                <div style={{ width: '56px', height: '56px', backgroundColor: 'white', borderRadius: '50%' }}></div>
                                            </div>
                                        );
                                    })()}
                                </div>
                                <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
                                    <span style={{ fontSize: '0.8rem', color: brandColor, cursor: 'pointer' }}>Agregar más destinatarios</span>
                                </div>
                            </div>
                        </div>

                        {/* Tracking Stats */}
                        <div style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}`, borderRadius: '4px' }}>
                            <div style={{ padding: '1rem', borderBottom: `1px solid ${borderColor}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', margin: 0, color: colors.text }}>Seguimiento</h3>
                                <button style={{ background: 'none', border: 'none', fontSize: '0.75rem', color: brandColor, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}>
                                    Ir a la página 'Seguimiento' <ChevronRight size={12} />
                                </button>
                            </div>
                            <div style={{ padding: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Tasa de respuesta</span>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{event.responseRate}%</span>
                                </div>
                                <div style={{ width: '100%', height: '6px', backgroundColor: '#E5E7EB', borderRadius: '3px', marginBottom: '0.5rem', overflow: 'hidden' }}>
                                    <div style={{ width: `${event.responseRate}%`, height: '100%', backgroundColor: '#10B981' }}></div>
                                </div>
                                <div style={{ textAlign: 'right', fontSize: '0.7rem', color: colors.muted, marginBottom: '1.5rem' }}>
                                    Fecha límite para la confirmación de asistencia: 25/11/2025
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }}></div> Asistiré</span>
                                            <span style={{ fontWeight: 600 }}>{event.attending}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#EF4444' }}></div> No asistiré</span>
                                            <span style={{ fontWeight: 600 }}>{event.notAttending}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#D1D5DB' }}></div> Pendientes</span>
                                            <span style={{ fontWeight: 600 }}>{event.pending}</span>
                                        </div>
                                    </div>
                                    {/* Pie Chart Simulation with Conic Gradient */}
                                    {(() => {
                                        const total = (event.attending || 0) + (event.notAttending || 0) + (event.pending || 0);
                                        if (total === 0) {
                                            return <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#E5E7EB' }}></div>;
                                        }
                                        const pAttending = (event.attending / total) * 100;
                                        const pNotAttending = (event.notAttending / total) * 100;
                                        // Stops
                                        const stop1 = pAttending;
                                        const stop2 = stop1 + pNotAttending;

                                        return (
                                            <div style={{
                                                width: '80px', height: '80px', borderRadius: '50%',
                                                background: `conic-gradient(#10B981 0% ${stop1}%, #EF4444 ${stop1}% ${stop2}%, #D1D5DB ${stop2}% 100%)`
                                            }}></div>
                                        );
                                    })()}
                                </div>

                                <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: brandColor }}>
                                    <span style={{ cursor: 'pointer' }}>Ver todas las confirmaciones...</span>
                                    <span style={{ cursor: 'pointer' }}>Enviar email grupal</span>
                                    <span style={{ cursor: 'pointer' }}>Gestionar recordatorios...</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default EventDetails;
