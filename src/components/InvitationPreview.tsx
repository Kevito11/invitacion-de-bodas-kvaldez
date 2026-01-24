import React, { useRef, useState, useEffect } from 'react';
import { MapPin, Calendar, Heart, ZoomIn, ZoomOut } from 'lucide-react';
import type { InvitationData } from '../types';
import CountdownTimer from './UI/CountdownTimer';
import ScrollReveal from './UI/ScrollReveal';

interface InvitationPreviewProps {
    data: InvitationData;
    isGuest?: boolean;
    guest?: any; // Personalized guest
}

const getThemeColor = (theme?: string) => {
    switch (theme) {
        case 'rose': return '#E0BFB8';
        case 'sage': return '#9DC183';
        case 'blue': return '#4169E1';
        case 'lavender': return '#9370DB';
        case 'gold':
        default: return '#D4AF37';
    }
};

const getFontFamily = (font?: string) => {
    switch (font) {
        case 'montserrat': return "'Montserrat', sans-serif";
        case 'greatvibes': return "'Great Vibes', cursive";
        case 'cinzel': return "'Cinzel', serif";
        case 'dancing': return "'Dancing Script', cursive";
        case 'merriweather': return "'Merriweather', serif";
        case 'playfair':
        default: return "'Playfair Display', serif";
    }
};



const BackgroundSlideshow = ({ images, activeIndex, fallbackColor }: { images: string[], activeIndex: number, fallbackColor: string }) => {
    // Determine which image to show based on active section index
    // If we have fewer images than sections, we loop them or just cycle.
    // Logic: section 0 -> img 0, section 1 -> img 1, etc.
    // If images is empty, show fallback.

    if (images.length === 0) {
        return (
            <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0,
                backgroundImage: `linear-gradient(to bottom, #fff 0%, ${fallbackColor}20 100%)`
            }} />
        );
    }

    return (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, overflow: 'hidden', backgroundColor: fallbackColor }}>
            {images.map((img, i) => (
                <div key={img} style={{
                    position: 'absolute', inset: 0,
                    opacity: i === (activeIndex % images.length) ? 1 : 0,
                    transition: 'opacity 1.2s ease-in-out'
                }}>
                    {/* Blurred Background Layer */}
                    <div style={{
                        position: 'absolute', inset: 0,
                        backgroundImage: `url(${img})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'blur(12px) brightness(0.85)', // Difuminado solicitado
                        transform: 'scale(1.1)' // Prevent blur edges
                    }} />
                </div>
            ))}
        </div>
    );
};

const InvitationPreview: React.FC<InvitationPreviewProps> = ({ data, isGuest = false, guest }) => {
    const [scale, setScale] = useState(1);
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Section Observer State
    const [activeSection, setActiveSection] = useState(0);

    // Modal/Lightbox State
    const [lightboxImg, setLightboxImg] = useState<string | null>(null);

    // RSVP Modal State
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmAction, setConfirmAction] = useState<'confirm' | 'reject' | null>(null);
    const [guestName, setGuestName] = useState('');

    // Pre-fill guest name if available
    React.useEffect(() => {
        if (guest) {
            setGuestName(guest.name);
        }
    }, [guest]);

    // Intersection Observer for Sections
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const sections = container.querySelectorAll('.snap-section');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Find index of intersecting section
                    const index = Array.from(sections).indexOf(entry.target);
                    if (index !== -1) {
                        setActiveSection(index);
                    }
                }
            });
        }, {
            root: container,
            threshold: 0.5 // Trigger when 50% visible
        });

        sections.forEach(s => observer.observe(s));
        return () => observer.disconnect();
    }, [data]); // Re-run if data changes re-renders sections


    // Determine primary color based on theme
    const themeColor = getThemeColor(data.theme);
    const titleFont = getFontFamily(data.font);

    const handleZoomIn = () => setScale(prev => Math.min(prev + 0.1, 1.5));
    const handleZoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.5));

    // Formato de fecha elegante
    const formatDate = (dateString: string) => {
        if (!dateString) return 'DD de Mes, YYYY';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    };

    const handleConfirmation = () => {
        if (!data.whatsappNumber || !guestName.trim()) return;

        const message = confirmAction === 'confirm'
            ? `Hola! Soy *${guestName}*. Confirmo con gusto mi asistencia a la boda de ${data.partner1} y ${data.partner2}. 🎉`
            : `Hola! Soy *${guestName}*. Lamento no poder asistir a la boda de ${data.partner1} y ${data.partner2}. Les deseo lo mejor. ❤️`;

        const url = `https://wa.me/${data.whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
        setShowConfirmModal(false);
        setGuestName('');
    };

    const backgroundImages = [data.backgroundImageUrl, ...(data.backgroundImages || [])].filter(Boolean) as string[];

    return (
        <div className="preview-container" style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '0',
            justifyContent: 'flex-start',
            boxSizing: 'border-box',
            overflow: 'hidden'
        }}>
            {!isGuest && (
                <div className="preview-controls" style={{ padding: '0.5rem', display: 'flex', gap: '0.5rem', zIndex: 10 }}>
                    <button onClick={handleZoomOut} title="Alejar" style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd', cursor: 'pointer', background: 'white' }}><ZoomOut size={16} /></button>
                    <button onClick={handleZoomIn} title="Acercar" style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd', cursor: 'pointer', background: 'white' }}><ZoomIn size={16} /></button>
                </div>
            )}

            <div
                ref={containerRef}
                className="invitation-card animate-scale-in"
                style={{
                    transform: `scale(${scale})`,
                    transition: 'transform 0.3s ease',
                    width: '100%',
                    flex: 1,
                    backgroundColor: 'transparent',
                    boxShadow: isGuest ? 'none' : `0 20px 60px -10px ${themeColor}40`,
                    padding: '0',
                    textAlign: 'center',
                    position: 'relative',
                    borderRadius: isGuest ? '0' : '8px',
                    border: isGuest ? 'none' : `1px solid ${themeColor}20`,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                {/* Scroll-Synced Blurred Background */}
                <BackgroundSlideshow
                    images={backgroundImages}
                    activeIndex={activeSection}
                    fallbackColor={themeColor}
                />

                {/* Scroll Container */}
                <div
                    ref={scrollContainerRef}
                    className="snap-container"
                    style={{
                        position: 'absolute',
                        inset: 0,
                        zIndex: 1,
                        overflowY: 'scroll',
                        scrollSnapType: 'y mandatory',
                        scrollBehavior: 'auto'
                    }}
                >
                    {/* Decorative Border */}
                    {!data.imageUrl && (
                        <div style={{
                            position: 'fixed',
                            top: '15px', left: '15px', right: '15px', bottom: '15px',
                            border: `1px solid ${themeColor}`,
                            pointerEvents: 'none',
                            opacity: 0.5,
                            zIndex: 10
                        }}></div>
                    )}

                    {/* SECTION 1: INTRO */}
                    <section className="snap-section">
                        <div style={{ width: '100%', padding: '0 1rem' }}>
                            {data.imageUrl ? (
                                <div className="animate-fade-in" style={{
                                    width: '100%',
                                    maxHeight: '40vh',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    overflow: 'hidden',
                                    marginBottom: '1.5rem',
                                    borderRadius: '8px'
                                }}>
                                    <img
                                        src={data.imageUrl}
                                        alt="Cover"
                                        style={{
                                            maxWidth: '100%',
                                            maxHeight: '100%',
                                            objectFit: 'contain'
                                        }}
                                    />
                                </div>
                            ) : (
                                <ScrollReveal>
                                    <div style={{ marginBottom: '1rem', color: themeColor, transition: 'color 0.3s ease' }}>
                                        <Heart fill={themeColor} size={32} style={{ margin: '0 auto', transition: 'fill 0.3s ease' }} />
                                    </div>
                                </ScrollReveal>
                            )}

                            <ScrollReveal>
                                <h3 style={{
                                    fontSize: '0.85rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '2px',
                                    color: '#666',
                                    marginBottom: '0.8rem',
                                    fontFamily: "'Lato', sans-serif"
                                }}>
                                    {guest ? (
                                        <span style={{ color: themeColor, fontWeight: 600 }}>
                                            NOS COMPLACE INVITARLE, {guest.name}
                                        </span>
                                    ) : 'TE INVITAMOS A LA BODA DE'}
                                </h3>
                            </ScrollReveal>

                            <ScrollReveal>
                                <h1 style={{
                                    fontSize: data.font === 'greatvibes' ? 'clamp(3rem, 12vw, 5rem)' : 'clamp(2.5rem, 10vw, 4rem)',
                                    color: '#2D2A26',
                                    margin: '1rem 0',
                                    lineHeight: '1.2',
                                    fontFamily: titleFont,
                                    wordBreak: 'break-word',
                                    textShadow: '0 2px 4px rgba(255,255,255,0.5)'
                                }}>
                                    <span style={{ display: 'block' }}>{data.partner1 || 'Ana'}</span>
                                    <span style={{ fontSize: '1.5rem', fontStyle: 'italic', color: themeColor, margin: '0.5rem 0', display: 'block', transition: 'color 0.3s ease', fontFamily: "'Playfair Display', serif" }}>&</span>
                                    <span style={{ display: 'block' }}>{data.partner2 || 'Carlos'}</span>
                                </h1>
                            </ScrollReveal>

                            <ScrollReveal>
                                <CountdownTimer targetDate={data.date} time={data.time} />
                            </ScrollReveal>
                        </div>
                    </section>

                    {/* SECTION 2: DETAILS */}
                    <section className="snap-section">
                        <div style={{ width: '100%', padding: '0 1rem' }}>
                            <ScrollReveal>
                                <div style={{ marginBottom: '2rem', background: 'rgba(255,255,255,0.8)', padding: '1.5rem', borderRadius: '16px', backdropFilter: 'blur(5px)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                        <Calendar size={20} color={themeColor} />
                                        <p style={{ fontSize: '1.3rem', margin: 0, color: '#444', fontWeight: 500 }}>{formatDate(data.date)}</p>
                                    </div>
                                    <p style={{ fontSize: '1.1rem', color: '#666' }}>{data.time || '00:00'}</p>
                                </div>
                            </ScrollReveal>

                            <ScrollReveal>
                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2.5rem' }}>
                                    <a
                                        href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=Boda+de+${encodeURIComponent(data.partner1)}+y+${encodeURIComponent(data.partner2)}&dates=${data.date.replace(/-/g, '')}T${data.time.replace(':', '')}00/${data.date.replace(/-/g, '')}T235900&details=¡Nos+casamos!&location=${encodeURIComponent(data.venueName + ', ' + data.venueAddress)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            fontSize: '0.9rem',
                                            color: '#fff',
                                            backgroundColor: themeColor,
                                            padding: '0.6rem 1.2rem',
                                            borderRadius: '50px',
                                            textDecoration: 'none',
                                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                                        }}
                                    >
                                        Agendar en Google Calendar
                                    </a>
                                </div>
                            </ScrollReveal>

                            <ScrollReveal>
                                <div style={{ padding: '2rem 1rem', background: 'rgba(255,255,255,0.8)', borderRadius: '16px', backdropFilter: 'blur(5px)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                        <MapPin size={20} color={themeColor} />
                                        <a
                                            href={data.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.venueAddress || '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                fontSize: '1.2rem',
                                                margin: 0,
                                                color: '#2D2A26',
                                                textDecoration: 'none',
                                                borderBottom: `1px solid ${themeColor}40`,
                                                transition: 'all 0.2s ease',
                                                cursor: 'pointer',
                                                fontWeight: 600
                                            }}
                                            title="Ver ubicación"
                                        >
                                            {data.venueName || 'Lugar del Evento'}
                                        </a>
                                    </div>
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.venueAddress || '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            display: 'block',
                                            fontSize: '1rem',
                                            color: '#888',
                                            marginTop: '0.4rem',
                                            textDecoration: 'none'
                                        }}
                                    >
                                        {data.venueAddress || 'Dirección del evento'}
                                    </a>
                                </div>
                            </ScrollReveal>
                        </div>
                    </section>

                    {/* SECTION 3: DRESS CODE & MESSAGE */}
                    <section className="snap-section">
                        <div style={{ width: '100%', padding: '0 1rem' }}>
                            <ScrollReveal>
                                <div style={{ marginBottom: '3rem', background: 'rgba(255,255,255,0.8)', padding: '2rem', borderRadius: '16px' }}>
                                    <p style={{ fontSize: '0.9rem', color: '#888', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.5rem' }}>Código de Vestimenta</p>
                                    <p style={{ fontSize: '1.4rem', color: themeColor, fontWeight: 500, fontFamily: titleFont }}>{data.dressCode || 'Formal'}</p>

                                    {data.dressCodeDetails && (
                                        <p style={{ fontSize: '1rem', color: '#666', marginTop: '0.8rem', fontStyle: 'italic' }}>
                                            "{data.dressCodeDetails}"
                                        </p>
                                    )}

                                    {data.dressCodeInspirationUrl && (
                                        <div style={{ marginTop: '1.5rem' }}>
                                            {(data.dressCodeInspirationUrl.startsWith('data:') ||
                                                data.dressCodeInspirationUrl.match(/\.(jpeg|jpg|gif|png|webp)/i) ||
                                                data.dressCodeInspirationUrl.includes('googleusercontent')) ? (
                                                <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                                    <div
                                                        onClick={() => setLightboxImg(data.dressCodeInspirationUrl || '')}
                                                        style={{
                                                            width: '140px', height: '140px', borderRadius: '12px', overflow: 'hidden',
                                                            boxShadow: '0 8px 20px rgba(0,0,0,0.1)', cursor: 'zoom-in'
                                                        }}
                                                    >
                                                        <img
                                                            src={data.dressCodeInspirationUrl}
                                                            alt="Ejemplo"
                                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                        />
                                                    </div>
                                                    <span style={{ fontSize: '0.8rem', color: '#666' }}>Ver ejemplo</span>
                                                </div>
                                            ) : (
                                                <a
                                                    href={data.dressCodeInspirationUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{
                                                        display: 'inline-block', padding: '0.8rem 1.5rem',
                                                        border: `1px solid ${themeColor}`, borderRadius: '50px',
                                                        color: themeColor, textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500
                                                    }}
                                                >
                                                    Ver Ejemplo de Vestimenta
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </ScrollReveal>

                            <ScrollReveal>
                                <p style={{
                                    fontStyle: 'italic',
                                    fontSize: '1.2rem',
                                    lineHeight: '1.8',
                                    color: '#555',
                                    maxWidth: '90%',
                                    margin: '0 auto',
                                    whiteSpace: 'pre-line',
                                    textShadow: '0 1px 10px rgba(255,255,255,0.8)'
                                }}>
                                    "{data.message || 'Esperamos contar con tu presencia en este día tan especial para nosotros.'}"
                                </p>
                            </ScrollReveal>
                        </div>
                    </section>

                    {/* SECTION 4: GALLERY (Horizontal Carousel) & RSVP */}
                    <section className="snap-section">
                        <div style={{ width: '100%', padding: '0 1rem', overflowX: 'hidden' }}>
                            {data.gallery && data.gallery.length > 0 && (
                                <div style={{ marginBottom: '3rem' }}>
                                    <ScrollReveal>
                                        <h3 style={{
                                            fontFamily: titleFont, fontSize: '2rem', color: themeColor, marginBottom: '2rem'
                                        }}>Nuestros Momentos</h3>
                                    </ScrollReveal>

                                    {/* Carousel Container */}
                                    <div style={{
                                        display: 'flex',
                                        overflowX: 'auto',
                                        gap: '1rem',
                                        padding: '1rem 0.5rem 2rem 0.5rem',
                                        scrollSnapType: 'x mandatory',
                                        WebkitOverflowScrolling: 'touch',
                                        scrollbarWidth: 'none', // Hide scrollbar FF
                                        msOverflowStyle: 'none'  // Hide scrollbar IE
                                    }}>
                                        {/* CSS to hide scrollbar Chrome/Safari */}
                                        <style>{`
                                            .snap-section ::-webkit-scrollbar { display: none; }
                                        `}</style>

                                        {data.gallery.map((img, i) => (
                                            <div key={i} style={{
                                                flex: '0 0 auto',
                                                scrollSnapAlign: 'center',
                                                width: '280px',
                                                height: '380px', // Portrait orientation
                                                borderRadius: '12px',
                                                boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                                                overflow: 'hidden',
                                                cursor: 'zoom-in',
                                                transition: 'transform 0.3s ease',
                                                position: 'relative'
                                            }}
                                                onClick={() => setLightboxImg(img)}
                                                className="gallery-item"
                                            >
                                                <img
                                                    src={img}
                                                    alt={`Momentos ${i}`}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#888', marginTop: '-1rem' }}>Desliza para ver más →</p>
                                </div>
                            )}

                            {data.whatsappNumber && (
                                <ScrollReveal>
                                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', paddingBottom: '3rem' }}>
                                        <button
                                            onClick={() => { setConfirmAction('confirm'); setShowConfirmModal(true); }}
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                backgroundColor: '#2D2A26',
                                                color: 'white',
                                                padding: '1rem 2rem',
                                                borderRadius: '50px',
                                                border: 'none',
                                                fontWeight: 600,
                                                cursor: 'pointer',
                                                fontSize: '1rem',
                                                boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
                                            }}
                                        >
                                            Confirmar Asistencia
                                        </button>
                                        <button
                                            onClick={() => { setConfirmAction('reject'); setShowConfirmModal(true); }}
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                backgroundColor: 'rgba(255,255,255,0.8)',
                                                color: '#666',
                                                padding: '1rem 2rem',
                                                borderRadius: '50px',
                                                border: '1px solid #999',
                                                fontWeight: 600,
                                                cursor: 'pointer',
                                                fontSize: '1rem'
                                            }}
                                        >
                                            No podré asistir
                                        </button>
                                    </div>
                                </ScrollReveal>
                            )}
                        </div>
                    </section>
                </div>



                {/* Confirmation Name Modal */}
                {
                    showConfirmModal && (
                        <div
                            onClick={() => setShowConfirmModal(false)}
                            style={{
                                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                                backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                backdropFilter: 'blur(3px)'
                            }}
                        >
                            <div
                                onClick={(e) => e.stopPropagation()}
                                className="animate-scale-in"
                                style={{
                                    backgroundColor: 'white',
                                    padding: '2rem',
                                    borderRadius: '16px',
                                    width: '90%',
                                    maxWidth: '400px',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                                    textAlign: 'center'
                                }}
                            >
                                <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', fontFamily: "'Playfair Display', serif" }}>
                                    {confirmAction === 'confirm' ? '¡Qué alegría!' : 'Lo sentimos'}
                                </h3>
                                <p style={{ color: '#666', marginBottom: '1.5rem' }}>
                                    {guest
                                        ? `¿${confirmAction === 'confirm' ? 'Confirmas tu asistencia' : 'Deseas avisar que no asistirás'} como ${guest.name}?`
                                        : `Por favor escribe tu nombre completo para ${confirmAction === 'confirm' ? 'confirmar tu lugar' : 'avisar a los novios'}.`
                                    }
                                </p>

                                {!guest && (
                                    <input
                                        type="text"
                                        autoFocus
                                        placeholder="Ej: Juan Pérez y María González"
                                        value={guestName}
                                        onChange={(e) => setGuestName(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleConfirmation()}
                                        style={{
                                            width: '100%',
                                            padding: '1rem',
                                            border: '1px solid #ddd',
                                            borderRadius: '8px',
                                            fontSize: '1rem',
                                            marginBottom: '1.5rem',
                                            outline: 'none'
                                        }}
                                    />
                                )}

                                <button
                                    onClick={handleConfirmation}
                                    disabled={!guestName.trim()}
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        backgroundColor: !guestName.trim() ? '#ccc' : (confirmAction === 'confirm' ? '#2D2A26' : '#E53935'),
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontWeight: 600,
                                        fontSize: '1rem',
                                        cursor: !guestName.trim() ? 'not-allowed' : 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {confirmAction === 'confirm' ? 'SÍ, CONFIRMAR' : 'ENVIAR AVISO'}
                                </button>
                            </div>
                        </div>
                    )
                }

                {/* Lightbox / Modal for Gallery */}
                {lightboxImg && (
                    <div
                        onClick={() => setLightboxImg(null)}
                        style={{
                            position: 'fixed', inset: 0, zIndex: 2000,
                            backgroundColor: 'rgba(0,0,0,0.9)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            backdropFilter: 'blur(10px)',
                            cursor: 'zoom-out'
                        }}
                    >
                        <button
                            onClick={() => setLightboxImg(null)}
                            style={{
                                position: 'absolute', top: '20px', right: '20px',
                                background: 'transparent', border: 'none', color: '#fff', fontSize: '2rem', cursor: 'pointer'
                            }}
                        >
                            &times;
                        </button>
                        <img
                            src={lightboxImg}
                            alt="Full size"
                            style={{ maxWidth: '95%', maxHeight: '90vh', borderRadius: '4px', boxShadow: '0 0 50px rgba(0,0,0,0.5)' }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default InvitationPreview;
