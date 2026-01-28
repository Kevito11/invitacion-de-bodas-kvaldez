import React, { useRef, useState, useEffect } from 'react';
import { MapPin, Calendar, Heart, ZoomIn, ZoomOut } from 'lucide-react';
import type { InvitationData } from '../types';
import CountdownTimer from './UI/CountdownTimer';
import ScrollReveal from './UI/ScrollReveal';
import Envelope from './UI/Envelope';

interface InvitationPreviewProps {
    data: InvitationData;
    isGuest?: boolean;
    guest?: any; // Personalized guest
    forceShowEnvelope?: boolean; // For editor preview
    isMobilePreview?: boolean; // New prop to fix sizing in builder
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
        case 'greatvibes': return "'Great Vibes', cursive";
        case 'dancing': return "'Dancing Script', cursive";
        case 'alexbrush': return "'Alex Brush', cursive";
        case 'parisienne': return "'Parisienne', cursive";
        case 'allura': return "'Allura', cursive";
        case 'pinyon': return "'Pinyon Script', cursive";
        case 'petitformal': return "'Petit Formal Script', cursive";
        // Fallbacks for legacy or default
        case 'playfair': return "'Playfair Display', serif";
        case 'montserrat': return "'Montserrat', sans-serif";
        default: return "'Great Vibes', cursive";
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

const InvitationPreview: React.FC<InvitationPreviewProps> = ({ data, isGuest = false, guest, forceShowEnvelope = false, isMobilePreview = false }) => {
    const [scale, setScale] = useState(1);
    const layout = data.layout || 'scroll'; // Hoisted for effect dependencies
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Section Observer State
    const [activeSection, setActiveSection] = useState(0);

    // Modal/Lightbox State
    const [lightboxImg, setLightboxImg] = useState<string | null>(null);

    // RSVP Modal State
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmAction] = useState<'confirm' | 'reject' | null>(null);
    const [guestName, setGuestName] = useState('');

    // Envelope State
    const [showEnvelope, setShowEnvelope] = useState(false);

    // Initialize Envelope State
    useEffect(() => {
        if (forceShowEnvelope) {
            setShowEnvelope(true);
        } else if (isGuest && data.envelope?.enabled) {
            setShowEnvelope(true);
        } else {
            setShowEnvelope(false);
        }
    }, [forceShowEnvelope, isGuest, data.envelope?.enabled]);

    // Flip State for Classic Two-Sided Card
    const [isFlipped, setIsFlipped] = useState(false);

    // ... (rest of effects)


    useEffect(() => {
        if (guest) {
            setGuestName(guest.name);
        }
    }, [guest]);

    // Intersection Observer for Sections
    useEffect(() => {
        // Disable observer for slider layout as we control state manually
        if (layout === 'slider') return;

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
    }, [data, layout]); // Add layout dependency


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



    // Layout Specific Styles
    const containerStyles: React.CSSProperties = {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '0',
        justifyContent: 'flex-start',
        boxSizing: 'border-box',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: layout === 'classic' ? '#f5f5f5' : 'transparent' // Background for classic mode
    };

    const scrollContainerStyles: React.CSSProperties = {
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        overflowY: layout === 'slider' ? 'hidden' : 'auto',
        overflowX: layout === 'slider' ? 'hidden' : 'hidden', // No scroll in slider mode (handled by state)
        scrollSnapType: layout === 'classic' ? 'none' : (layout === 'slider' ? 'none' : 'y mandatory'),
        scrollBehavior: 'smooth',
        display: layout === 'slider' ? 'block' : 'block', // Block for absolute stacking
        flexDirection: layout === 'slider' ? 'column' : 'column',
        perspective: layout === 'slider' ? '1500px' : 'none', // Enable 3D
        cursor: layout === 'slider' ? 'pointer' : 'default', // Indicate interactivity
    };

    const sectionStyles: React.CSSProperties = {
        minHeight: layout === 'classic' ? 'auto' : '100%',
        width: layout === 'slider' ? '100%' : '100%',
        minWidth: layout === 'slider' ? '100%' : 'auto', // Force full width in slider
        scrollSnapAlign: layout === 'classic' ? 'none' : 'start',
        scrollSnapStop: layout === 'classic' ? 'normal' : 'always',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: isMobilePreview ? '1.5rem 0.5rem' : '2rem 1rem',
        boxSizing: 'border-box',
        position: layout === 'slider' ? 'absolute' : 'relative', // Absolute for stack
        backgroundColor: layout === 'classic' ? 'transparent' : (layout === 'slider' ? '#fdfdfd' : 'transparent'), // Transparent for classic (wrapper handles bg)
        maxWidth: 'none', // Wrapper handles width for classic
        margin: '0', // Wrapper handles margin
        boxShadow: 'none', // Wrapper handles shadow
        borderRadius: '0', // Wrapper handles radius
        // Book Animation Props
        top: 0, left: 0, height: '100%',
        // backfaceVisibility: 'hidden', // Removed to see back of page during flip
        transition: 'transform 0.8s cubic-bezier(0.15, 0.55, 0.45, 1), z-index 0s 0.4s', // Delay z-index change to mid-flip
        transformStyle: 'preserve-3d',
        transformOrigin: 'left center',
        zIndex: 1 // Default
    };

    // Helper to get book styles per section index
    const getBookPageStyle = (index: number): React.CSSProperties => {
        if (layout !== 'slider') return {};

        // Stacking Logic:
        // Left Stack (Past): Ascending Z (0 < 1 < 2).
        // Right Stack (Future/Current): Descending Z (2 > 1 > 0).
        // This ensures proper stacking on both sides.
        // The delay in transition handles the cross-over.

        const isPast = index < activeSection;
        const isCurrent = index === activeSection;

        // Base Z-Index Calculation
        const zIndex = isPast ? index : (50 - index);

        return {
            zIndex: zIndex,
            transform: isPast ? 'rotateY(-160deg)' : 'rotateY(0deg)',
            opacity: 1,
            pointerEvents: isCurrent ? 'auto' : 'none', // Only current page interactive
        };
    };

    const getLayoutWrapperStyle = (): React.CSSProperties => {
        if (layout === 'classic') {
            return {
                maxWidth: '600px',
                margin: '2rem auto',
                backgroundColor: 'white',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                position: 'relative',
                minHeight: '80vh', // Ensure it looks like a paper
                display: 'flex',
                flexDirection: 'column'
            };
        }
        return {
            width: '100%',
            height: '100%',
            position: 'relative'
        };
    };

    const handleBookClick = (e: React.MouseEvent) => {
        if (layout === 'slider') {
            // Check if clicking a button or interactive element
            const target = e.target as HTMLElement;
            if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') || target.closest('a') || target.closest('.preview-controls')) {
                return;
            }

            // Get click position relative to the container
            const container = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - container.left;

            // Logic: Tap Right (> 50%) -> Next, Tap Left (< 50%) -> Prev
            const isNext = clickX > container.width / 2;

            if (activeSection > 0 && !isNext) {
                setActiveSection(prev => prev - 1);
            } else if (activeSection < 3 && isNext) { // 4 Sections total (0-3)
                setActiveSection(prev => prev + 1);
            }
        }
    };

    // Helper Functions for Rendering Sections
    const renderIntroSection = () => (
        <section className="snap-section" style={{ ...sectionStyles, ...getBookPageStyle(0) }}>
            <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto', padding: '0 1rem', boxSizing: 'border-box', textAlign: 'center' }}>
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
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '3px',
                        color: '#666',
                        marginBottom: '1rem',
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
                        fontSize: isMobilePreview
                            ? (data.font === 'greatvibes' ? '3.5rem' : '2.8rem')
                            : (data.font === 'greatvibes' ? 'clamp(3rem, 12vw, 5rem)' : 'clamp(2.5rem, 10vw, 4rem)'),
                        color: '#2D2A26',
                        margin: '1rem 0',
                        lineHeight: '1.2',
                        fontFamily: titleFont,
                        wordBreak: 'break-word',
                        textShadow: '0 2px 4px rgba(255,255,255,0.5)'
                    }}>
                        <span style={{ display: 'block' }}>{(data.partner1 || 'Ana').split(' ')[0]}</span>
                        <span style={{ fontSize: '1.2rem', fontStyle: 'italic', color: themeColor, margin: '0.2rem 0', display: 'block', transition: 'color 0.3s ease', fontFamily: "'Playfair Display', serif" }}>&</span>
                        <span style={{ display: 'block' }}>{(data.partner2 || 'Carlos').split(' ')[0]}</span>
                    </h1>
                </ScrollReveal>

                <ScrollReveal>
                    <CountdownTimer targetDate={data.date} time={data.time} />
                </ScrollReveal>

                {/* Visual Cue for Flip (Only Classic) */}
                {layout === 'classic' && (
                    <div style={{ marginTop: '2rem' }}>
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsFlipped(true); }}
                            style={{
                                background: 'transparent',
                                border: `1px solid ${themeColor}`,
                                borderRadius: '30px',
                                padding: '0.5rem 1.5rem',
                                color: themeColor,
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            Ver Detalles ↻
                        </button>
                    </div>
                )}
            </div>
        </section>
    );

    const renderDetailsSection = () => (
        <section className="snap-section" style={{ ...sectionStyles, ...getBookPageStyle(1) }}>
            <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto', padding: '0 1rem', boxSizing: 'border-box', textAlign: 'center' }}>
                <ScrollReveal>
                    <div style={{
                        marginBottom: '2rem',
                        background: 'rgba(255,255,255,0.7)',
                        padding: '2rem 1rem',
                        borderRadius: '24px',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
                        border: '1px solid rgba(255, 255, 255, 0.18)'
                    }}>
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
                    <div style={{
                        padding: '2rem 1rem',
                        background: 'rgba(255,255,255,0.7)',
                        borderRadius: '24px',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
                        border: '1px solid rgba(255, 255, 255, 0.18)'
                    }}>
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

                {/* Back Button (Only Classic) */}
                {layout === 'classic' && (
                    <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsFlipped(false); }}
                            style={{
                                background: 'transparent',
                                border: `1px solid ${themeColor}`,
                                borderRadius: '30px',
                                padding: '0.5rem 1.5rem',
                                color: themeColor,
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            ↶ Volver a la Portada
                        </button>
                    </div>
                )}
            </div>
        </section>
    );

    const renderDressCodeSection = () => (
        <section className="snap-section" style={{ ...sectionStyles, ...getBookPageStyle(2) }}>
            <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto', padding: '0 1rem', boxSizing: 'border-box', textAlign: 'center' }}>
                <ScrollReveal>
                    <div style={{
                        padding: '2rem 1rem',
                        background: 'rgba(255,255,255,0.8)',
                        borderRadius: '24px',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
                        marginBottom: '2rem'
                    }}>
                        <h2 style={{ fontFamily: titleFont, fontSize: '2.5rem', color: themeColor, marginBottom: '1rem' }}>Código de Vestimenta</h2>
                        <p style={{ fontSize: '1.1rem', color: '#555', lineHeight: '1.6' }}>
                            {data.dressCode || 'Formal'}
                        </p>
                        {data.dressCodeDetails && (
                            <p style={{ fontSize: '0.9rem', color: '#777', marginTop: '0.5rem' }}>
                                {data.dressCodeDetails}
                            </p>
                        )}
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );

    const renderGallerySection = () => (
        <section className="snap-section" style={{ ...sectionStyles, ...getBookPageStyle(3) }}>
            {/* Gallery Content */}
            <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto', padding: '0 1rem 4rem 1rem', boxSizing: 'border-box', textAlign: 'center' }}>
                {data.gallery && data.gallery.length > 0 && (
                    <div style={{ marginBottom: '3rem' }}>
                        <ScrollReveal>
                            <h2 style={{ fontFamily: titleFont, fontSize: '2.5rem', color: themeColor, marginBottom: '1.5rem' }}>Nuestra Historia</h2>
                        </ScrollReveal>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                            gap: '0.8rem',
                            padding: '0.5rem'
                        }}>
                            {data.gallery.map((img, index) => (
                                <ScrollReveal key={index}>
                                    <div
                                        onClick={() => setLightboxImg(img)}
                                        style={{
                                            aspectRatio: '1',
                                            overflow: 'hidden',
                                            borderRadius: '12px',
                                            cursor: 'pointer',
                                            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                                            transition: 'transform 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                    >
                                        <img src={img} alt={`Gallery ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                </ScrollReveal>
                            ))}
                        </div>
                    </div>
                )}

                <ScrollReveal>
                    <div style={{ marginTop: '2rem' }}>
                        <button
                            onClick={() => setShowConfirmModal(true)}
                            style={{
                                background: themeColor,
                                color: 'white',
                                border: 'none',
                                padding: '1rem 3rem',
                                fontSize: '1.1rem',
                                borderRadius: '50px',
                                cursor: 'pointer',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                                transition: 'transform 0.2s',
                                fontWeight: 600
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            Confirmar Asistencia
                        </button>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );

    return (
        <div className="preview-container" style={containerStyles}>
            {!isGuest && (
                <div className="preview-controls" style={{ padding: '0.5rem', display: 'flex', gap: '0.5rem', zIndex: 10, position: 'absolute', top: 0, right: 0 }}>
                    <button onClick={handleZoomOut} title="Alejar" style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd', cursor: 'pointer', background: 'white' }}><ZoomOut size={16} /></button>
                    <button onClick={handleZoomIn} title="Acercar" style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd', cursor: 'pointer', background: 'white' }}><ZoomIn size={16} /></button>
                </div>
            )}

            {/* Envelope Overlay */}
            {showEnvelope && (
                <Envelope
                    onOpen={() => setShowEnvelope(false)}
                    senderName={`${data.partner1} & ${data.partner2}`}
                    type={data.envelope?.type}
                    material={data.envelope?.material}
                    color={data.envelope?.color}
                    finish={data.envelope?.finish}
                />
            )}

            <div
                ref={containerRef}
                className="invitation-card"
                style={{
                    transform: `scale(${scale})`,
                    transition: 'transform 0.3s ease',
                    width: '100%',
                    height: '100%',
                    flex: 1,
                    backgroundColor: 'transparent',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                {/* Scroll-Synced Blurred Background (Only for Scroll/Slider) */}
                {layout !== 'classic' && (
                    <BackgroundSlideshow
                        images={backgroundImages}
                        activeIndex={activeSection}
                        fallbackColor={themeColor}
                    />
                )}

                {/* Main Content Render Logic */}
                {layout === 'classic' ? (
                    // CLASSIC LAYOUT: 3D FLIP CARD
                    <div style={{
                        perspective: '1500px',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'flex-start', // Align top so margin handles vertical centering
                        overflow: 'visible'
                    }}>
                        <div style={{
                            width: '100%',
                            maxWidth: '600px',
                            minHeight: '80vh', // Paper size
                            position: 'relative',
                            marginTop: '2rem',
                            transformStyle: 'preserve-3d',
                            transition: 'transform 2.5s cubic-bezier(0.4, 0.0, 0.2, 1)', // Slow personalized letter feel
                            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                        }}>
                            {/* FRONT FACE (Intro) */}
                            <div style={{
                                position: 'absolute', inset: 0,
                                backfaceVisibility: 'hidden',
                                backgroundColor: data.backgroundImageUrl ? 'white' : '#FAF7F2', // White base for images
                                backgroundImage: data.backgroundImageUrl
                                    ? `url(${data.backgroundImageUrl})`
                                    : `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`,
                                backgroundSize: data.backgroundImageUrl ? 'cover' : 'auto',
                                backgroundPosition: 'center',
                                boxShadow: 'inset 0 0 40px rgba(0,0,0,0.05), 0 20px 50px rgba(0,0,0,0.1)', // Soft depth + inner vignette
                                borderRadius: '2px', // Sharper corners for paper feel
                                display: 'flex', flexDirection: 'column',
                                overflow: 'hidden',
                                zIndex: 2
                            }}>
                                {!data.imageUrl && (
                                    <div style={{
                                        position: 'absolute', top: '15px', left: '15px', right: '15px', bottom: '15px',
                                        border: `1px solid ${themeColor}`, pointerEvents: 'none', opacity: 0.5, zIndex: 10
                                    }}></div>
                                )}
                                <div style={{ flex: 1, overflowY: 'auto' }}>
                                    {renderIntroSection()}
                                </div>
                            </div>

                            {/* BACK FACE (Details + Gallery) */}
                            <div style={{
                                position: 'absolute', inset: 0,
                                backfaceVisibility: 'hidden',
                                backgroundColor: data.backgroundImageUrl ? 'white' : '#FAF7F2', // Warm rustic paper
                                backgroundImage: data.backgroundImageUrl
                                    ? `url(${data.backgroundImageUrl})`
                                    : `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`,
                                backgroundSize: data.backgroundImageUrl ? 'cover' : 'auto',
                                backgroundPosition: 'center',
                                boxShadow: 'inset 0 0 40px rgba(0,0,0,0.05), 0 20px 50px rgba(0,0,0,0.1)', // Soft depth + inner vignette
                                borderRadius: '2px', // Sharper corners for paper feel
                                transform: 'rotateY(180deg)',
                                display: 'flex', flexDirection: 'column',
                                overflow: 'hidden',
                                zIndex: 1
                            }}>
                                {!data.imageUrl && (
                                    <div style={{
                                        position: 'absolute', top: '15px', left: '15px', right: '15px', bottom: '15px',
                                        border: `1px solid ${themeColor}`, pointerEvents: 'none', opacity: 0.5, zIndex: 10
                                    }}></div>
                                )}
                                <div style={{ flex: 1, overflowY: 'auto' }}>
                                    {renderDetailsSection()}
                                    {renderDressCodeSection()}
                                    {renderGallerySection()}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    // STANDARD LAYOUT (Slider / Scroll)
                    <div
                        ref={scrollContainerRef}
                        className="snap-container"
                        style={scrollContainerStyles}
                        onClick={handleBookClick}
                    >
                        <div style={getLayoutWrapperStyle()}>
                            {/* Decorative Border for Standard Layouts if needed */}
                            {!data.imageUrl && layout !== 'slider' && (
                                <div style={{
                                    position: 'absolute', top: '15px', left: '15px', right: '15px', bottom: '15px',
                                    border: `1px solid ${themeColor}`, pointerEvents: 'none', opacity: 0.5, zIndex: 10
                                }}></div>
                            )}

                            {renderIntroSection()}
                            {renderDetailsSection()}
                            {renderDressCodeSection()}
                            {renderGallerySection()}
                        </div>
                    </div>
                )}



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

                                {guest && guest.groupId && data.guests?.some((g: any) => g.groupId === guest.groupId && g.id !== guest.id) ? (
                                    // GROUP / FAMILY MODE
                                    <div style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
                                        <p style={{ marginBottom: '1rem', fontWeight: 600, color: '#444' }}>Selecciona quiénes asistirán:</p>
                                        {data.guests
                                            .filter((g: any) => g.groupId === guest.groupId)
                                            .map((member: any) => (
                                                <div key={member.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.8rem', padding: '0.5rem', borderRadius: '6px', background: '#F9FAFB' }}>
                                                    <input
                                                        type="checkbox"
                                                        id={`rsvp-${member.id}`}
                                                        defaultChecked={confirmAction === 'confirm'}
                                                        className="rsvp-checkbox" // We'll need to grab these values or control state
                                                        style={{ width: '1.2rem', height: '1.2rem', marginRight: '0.8rem', cursor: 'pointer', accentColor: '#2D2A26' }}
                                                    />
                                                    <label htmlFor={`rsvp-${member.id}`} style={{ cursor: 'pointer', flex: 1, color: '#333' }}>
                                                        {member.name}
                                                    </label>
                                                </div>
                                            ))
                                        }
                                        <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '1rem', fontStyle: 'italic' }}>
                                            * Se generará un mensaje de WhatsApp con la lista de asistentes seleccionados.
                                        </p>
                                    </div>
                                ) : (
                                    // SINGLE GUEST MODE (Legacy)
                                    !guest && (
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
                                    )
                                )}

                                <button
                                    onClick={() => {
                                        // Custom logic for Group RSVP
                                        if (guest && guest.groupId) {
                                            const checkboxes = document.querySelectorAll('.rsvp-checkbox') as NodeListOf<HTMLInputElement>;
                                            const familyMembers = (data.guests || []).filter((g: any) => g.groupId === guest.groupId);

                                            const attending: string[] = [];
                                            const notAttending: string[] = [];

                                            checkboxes.forEach((cb, index) => {
                                                const memberName = familyMembers[index].name;
                                                if (cb.checked) attending.push(memberName);
                                                else notAttending.push(memberName);
                                            });

                                            if (attending.length === 0 && confirmAction === 'confirm') {
                                                if (!window.confirm("¿Seguro que nadie asistirá?")) return;
                                            }

                                            let message = "";
                                            if (attending.length > 0) {
                                                message = `Hola! Somos la *${guest.name.includes('Familia') ? guest.name : 'Familia de ' + guest.name}*. \n\n✅ *Confirmamos asistencia:* \n${attending.map(n => `- ${n}`).join('\n')}`;
                                                if (notAttending.length > 0) {
                                                    message += `\n\n❌ *No podrán asistir:* \n${notAttending.map(n => `- ${n}`).join('\n')}`;
                                                }
                                            } else {
                                                message = `Hola! Somos la *${guest.name}*.\nLamentablemente no podremos asistir. 😔\nLes deseamos lo mejor.`;
                                            }

                                            // Append generic good vibes
                                            message += `\n\n¡Gracias por la invitación! 🎉`;

                                            const url = `https://wa.me/${data.whatsappNumber}?text=${encodeURIComponent(message)}`;
                                            window.open(url, '_blank');
                                            setShowConfirmModal(false);
                                            return;
                                        }

                                        // Default Logic
                                        handleConfirmation();
                                    }}
                                    disabled={!guest && !guestName.trim()}
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        backgroundColor: (!guest && !guestName.trim()) ? '#ccc' : (confirmAction === 'confirm' ? '#2D2A26' : '#E53935'),
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontWeight: 600,
                                        fontSize: '1rem',
                                        cursor: (!guest && !guestName.trim()) ? 'not-allowed' : 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {confirmAction === 'confirm' ? 'ENVIAR CONFIRMACIÓN' : 'ENVIAR AVISO'}
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
