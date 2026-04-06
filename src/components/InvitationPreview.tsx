import React, { useRef, useState, useEffect } from 'react';
import { MapPin, Calendar, Heart, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import type { InvitationData } from '../types';
import CountdownTimer from './UI/CountdownTimer';
import ScrollReveal from './UI/ScrollReveal';
import Envelope from './UI/Envelope';
import BookOpen from './UI/BookOpen';
import CrumpleReveal from './UI/CrumpleReveal';

interface InvitationPreviewProps {
    data: InvitationData;
    isGuest?: boolean;
    guest?: any; // Personalized guest
    forceShowEnvelope?: boolean; // For editor preview
    initialEnvelopeStep?: 'front' | 'flipping' | 'back' | 'opening' | 'extracting' | 'revealing' | 'done';
    hideEnvelopeContent?: boolean; // New prop
    isMobilePreview?: boolean; // New prop to fix sizing in builder
    isThumbnail?: boolean; // New prop for dashboard preview
    onRSVP?: (status: 'confirmed' | 'declined', message?: string) => Promise<void>;
}

import { getThemeById } from '../data/themes';
import { getDressCodeById } from '../data/dressCodes';

// Helper for contrast text color
const getHighContrastColor = (color: string) => {
    let r = 0, g = 0, b = 0;

    if (!color) return '#000000';

    // Handle Hex
    if (color.startsWith('#')) {
        const hex = color.replace('#', '');
        if (hex.length === 3) {
            r = parseInt(hex[0] + hex[0], 16);
            g = parseInt(hex[1] + hex[1], 16);
            b = parseInt(hex[2] + hex[2], 16);
        } else {
            r = parseInt(hex.substr(0, 2), 16);
            g = parseInt(hex.substr(2, 2), 16);
            b = parseInt(hex.substr(4, 2), 16);
        }
    }
    // Handle RGB/RGBA
    else if (color.startsWith('rgb')) {
        const match = color.match(/(\d+),\s*(\d+),\s*(\d+)/);
        if (match) {
            r = parseInt(match[1]);
            g = parseInt(match[2]);
            b = parseInt(match[3]);
        }
    } else {
        return '#000000';
    }

    // Calculate brightness (YIQ formula)
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? '#1a1a1a' : '#ffffff'; // Return dark gray or white
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



const BackgroundSlideshow = ({ images, activeIndex, fallbackColor, themeBackground, blur = 0, saturation = 100 }: { images: string[], activeIndex: number, fallbackColor: string, themeBackground?: string, blur?: number, saturation?: number }) => {
    // Determine which image to show based on active section index
    // If we have fewer images than sections, we loop them or just cycle.
    // Logic: section 0 -> img 0, section 1 -> img 1, etc.
    // If images is empty, show fallback.

    const filterStyle = `blur(${blur}px) saturate(${saturation}%)`;

    if (images.length === 0) {
        return (
            <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0,
                backgroundImage: themeBackground || `linear-gradient(to bottom, #fff 0%, ${fallbackColor}20 100%)`,
                backgroundSize: themeBackground ? 'cover' : 'auto',
                backgroundPosition: 'center',
                backgroundColor: themeBackground ? '#FAF7F2' : 'transparent', // Fallback color for parchment
                filter: themeBackground ? filterStyle : 'none'
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
                        filter: filterStyle,
                        transform: 'scale(1.1)' // Prevent blur edges
                    }} />
                </div>
            ))}
        </div>
    );
};

const InvitationPreview: React.FC<InvitationPreviewProps> = ({ data, isGuest = false, guest, forceShowEnvelope = false, initialEnvelopeStep, hideEnvelopeContent = false, isMobilePreview = false, isThumbnail = false, onRSVP }) => {
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
    const [confirmAction, setConfirmAction] = useState<'confirm' | 'reject' | null>(null); // Fixed missing setConfirmAction
    const [guestName, setGuestName] = useState('');
    const [rsvpMessage, setRsvpMessage] = useState('');

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
                    // Only update activeSection if NOT in auto-scroll thumbnail mode (to avoid fighting the interval)
                    // Or actually, just let it update, but the interval drives it.
                    // However, for thumbnail, user scroll is disabled by pointer-events-none parent.
                    if (index !== -1 && !isThumbnail) {
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
    }, [data, layout, isThumbnail]);




    const backFaceRef = useRef<HTMLDivElement>(null);

    // Auto-Scroll Logic for Thumbnail
    useEffect(() => {
        if (!isThumbnail) return;

        const interval = setInterval(() => {
            setActiveSection(prev => (prev + 1) % 4); // Assuming 4 sections max (Intro, Details, Dress, Gallery)
        }, 3000);

        return () => clearInterval(interval);
    }, [isThumbnail]);

    // Cleanup Flip state when NOT in classic layout (optional, but good practice)
    useEffect(() => {
        if (layout !== 'classic') {
            setIsFlipped(false);
        }
    }, [layout]);


    // Effect to perform the scroll when activeSection changes (for non-slider layouts in thumbnail mode)
    useEffect(() => {
        if (!isThumbnail || layout === 'slider') return; // Slider handles state internally via render

        if (layout === 'classic') {
            // Classic Layout specific logic
            if (activeSection === 0) {
                setIsFlipped(false);
            } else {
                setIsFlipped(true);
                // Scroll the back face
                // Allow a small delay for the flip to start or just scroll immediately (hidden back face scrolls)
                // If we scroll immediately, it might be visible during flip? 
                // Actually, if we flip, we probably want to scroll to the top of the back face content first?
                // But activeSection 1 is the top of back face.

                const container = backFaceRef.current;
                if (container) {
                    const sections = container.querySelectorAll('.snap-section');
                    // The back face contains sections 1, 2, 3.
                    // So index 0 of back face sections corresponds to activeSection 1.
                    const targetIndex = activeSection - 1;

                    if (targetIndex >= 0 && sections[targetIndex]) {
                        const targetSection = sections[targetIndex] as HTMLElement;
                        // Wait slightly for flip if coming from 0? No, just scroll.
                        container.scrollTo({
                            top: targetSection.offsetTop,
                            behavior: 'smooth'
                        });
                    }
                }
            }
        } else {
            // Standard Scroll Layout
            const container = scrollContainerRef.current;
            if (container) {
                const sections = container.querySelectorAll('.snap-section');
                const targetSection = sections[activeSection] as HTMLElement;
                if (targetSection) {
                    container.scrollTo({
                        top: targetSection.offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        }
    }, [activeSection, isThumbnail, layout]);

    // ... existing render code ...

    const currentTheme = getThemeById(data.theme);
    const themeColor = data.design?.primaryColor || currentTheme.color;
    const titleFont = getFontFamily(data.design?.font || data.font);
    const bodyFont = getFontFamily(data.design?.bodyFont || 'montserrat');

    // Calculate readable text color based on overlay or background
    // Prefer overlayColor if opacity > 0.3, else background color
    const overlayOpacity = data.design?.overlayOpacity ?? 0.85;
    const overlayColor = data.design?.overlayColor || '#ffffff';

    // If overlay is significant, use it as bg for contrast calc
    const effectiveBgColor = overlayOpacity > 0.4 ? overlayColor : (data.design?.backgroundColor || currentTheme.bg || '#ffffff');

    const readableTextColor = getHighContrastColor(effectiveBgColor);
    const readableSubTextColor = readableTextColor === '#ffffff' ? '#e0e0e0' : '#555555'; // Slightly dimmer for subtext



    // Shadow for theme-colored text to ensure visibility if theme color matches background
    const themeContrast = getHighContrastColor(themeColor);
    const themeTextShadow = themeContrast === '#ffffff'
        ? '0 2px 4px rgba(255,255,255,0.5)' // Dark theme color -> Light shadow 
        : '1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 0 2px 4px rgba(0,0,0,0.5)'; // Light theme color -> Strong Outline + Shadow

    const handleZoomIn = () => setScale(prev => Math.min(prev + 0.1, 1.5));
    const handleZoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.5));

    const renderOverlayBackground = (opacityOverride?: number) => {
        const opacity = opacityOverride !== undefined ? opacityOverride : overlayOpacity;
        if (opacity === 0) return 'transparent';

        // Convert hex to rgba if needed, or just use the color and apply opacity via separate style if possible, 
        // but here we return a string for background property.
        // Simple hex to rgba conversion
        let r = 255, g = 255, b = 255;
        if (overlayColor.startsWith('#')) {
            const hex = overlayColor.replace('#', '');
            if (hex.length === 3) {
                r = parseInt(hex[0] + hex[0], 16);
                g = parseInt(hex[1] + hex[1], 16);
                b = parseInt(hex[2] + hex[2], 16);
            } else if (hex.length === 6) {
                r = parseInt(hex.substring(0, 2), 16);
                g = parseInt(hex.substring(2, 4), 16);
                b = parseInt(hex.substring(4, 6), 16);
            }
        }
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    };

    // Formato de fecha elegante
    const formatDate = (dateString: string) => {
        if (!dateString) return 'DD de Mes, YYYY';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    };

    const handleConfirmation = async () => {
        if (onRSVP) {
            await onRSVP(confirmAction === 'confirm' ? 'confirmed' : 'declined', rsvpMessage);
        }

        if (!data.whatsappNumber) return; // If no WA, just save and close (if onRSVP existed)

        // Proceed to WhatsApp even if saved, as a fallback/confirmation
        const message = confirmAction === 'confirm'
            ? `Hola! Soy *${guestName}*. Confirmo con gusto mi asistencia a la boda de ${data.partner1} y ${data.partner2}. 🎉\n\nMensaje: ${rsvpMessage}`
            : `Hola! Soy *${guestName}*. Lamento no poder asistir a la boda de ${data.partner1} y ${data.partner2}. Les deseo lo mejor. ❤️\n\nMensaje: ${rsvpMessage}`;

        const url = `https://wa.me/${data.whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
        setShowConfirmModal(false);
        setGuestName('');
        setRsvpMessage('');
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
                backgroundImage: currentTheme.backgroundImage || 'none', // Apply theme texture
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: `blur(${data.design?.blur || 0}px) grayscale(${100 - (data.design?.saturation ?? 100)}%)`, // Apply background filters
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
            <div style={{
                width: '100%', maxWidth: '600px', margin: '0 auto', padding: '0 1rem', boxSizing: 'border-box', textAlign: 'center',
                ...(layout !== 'classic' ? {
                    backgroundColor: renderOverlayBackground(),
                    borderRadius: '16px',
                    padding: '2rem 1rem',
                    marginTop: '2rem', // Spacing from top
                    backdropFilter: 'blur(3px)'
                } : {})
            }}>
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
                    <ScrollReveal animation={data.animationStyle}>
                        <div style={{ marginBottom: '1rem', color: themeColor, transition: 'color 0.3s ease' }}>
                            <Heart fill={themeColor} size={32} style={{ margin: '0 auto', transition: 'fill 0.3s ease' }} />
                        </div>
                    </ScrollReveal>
                )}

                <ScrollReveal animation={data.animationStyle}>
                    <h3 style={{
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '3px',
                        color: readableSubTextColor,
                        marginBottom: '1rem',
                        fontFamily: bodyFont
                    }}>
                        {guest ? (
                            <span style={{ color: themeColor, fontWeight: 600, textShadow: themeTextShadow }}>
                                NOS COMPLACE INVITARLE, {guest.name}
                            </span>
                        ) : 'TE INVITAMOS A LA BODA DE'}
                    </h3>
                </ScrollReveal>

                <ScrollReveal animation={data.animationStyle}>
                    <h1 style={{
                        fontSize: isMobilePreview
                            ? (data.font === 'greatvibes' ? '3.5rem' : '2.8rem')
                            : (data.font === 'greatvibes' ? 'clamp(3rem, 12vw, 5rem)' : 'clamp(2.5rem, 10vw, 4rem)'),
                        color: themeColor,
                        textShadow: themeTextShadow,
                        margin: '1rem 0',
                        lineHeight: '1.2',
                        fontFamily: titleFont,
                        wordBreak: 'break-word'
                    }}>
                        <span style={{ display: 'block' }}>{(data.partner1 || 'Ana').split(' ')[0]}</span>
                        <span style={{ fontSize: '1.2rem', fontStyle: 'italic', color: themeColor, margin: '0.2rem 0', display: 'block', transition: 'color 0.3s ease', fontFamily: "'Playfair Display', serif", textShadow: themeTextShadow }}>&</span>
                        <span style={{ display: 'block' }}>{(data.partner2 || 'Carlos').split(' ')[0]}</span>
                    </h1>
                </ScrollReveal>

                <ScrollReveal animation={data.animationStyle}>
                    <CountdownTimer targetDate={data.date} time={data.time} />
                </ScrollReveal>

                {/* Visual Cue for Flip (Only Classic) */}
                {layout === 'classic' && (
                    <div style={{ marginTop: '2rem' }}>
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsFlipped(true); }}
                            style={{
                                background: themeColor,
                                border: 'none',
                                borderRadius: '30px',
                                padding: '0.8rem 2rem',
                                color: getHighContrastColor(themeColor),
                                cursor: 'pointer',
                                fontSize: '1rem',
                                fontWeight: 500,
                                boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                transition: 'transform 0.2s, box-shadow 0.2s',
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
                <ScrollReveal animation={data.animationStyle}>
                    <div style={{
                        marginBottom: '2rem',
                        background: renderOverlayBackground(),
                        padding: '2rem 1rem',
                        borderRadius: '24px',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
                        border: '1px solid rgba(255, 255, 255, 0.18)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <Calendar size={20} color={themeColor} />
                            <p style={{ fontSize: '1.3rem', margin: 0, color: readableTextColor, fontWeight: 500 }}>{formatDate(data.date)}</p>
                        </div>
                        <p style={{ fontSize: '1.1rem', color: readableSubTextColor, fontFamily: bodyFont }}>{data.time || '00:00'}</p>
                    </div>
                </ScrollReveal>

                <ScrollReveal animation={data.animationStyle}>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2.5rem' }}>
                        <a
                            href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=Boda+de+${encodeURIComponent(data.partner1)}+y+${encodeURIComponent(data.partner2)}&dates=${data.date.replace(/-/g, '')}T${data.time.replace(':', '')}00/${data.date.replace(/-/g, '')}T235900&details=¡Nos+casamos!&location=${encodeURIComponent(data.venueName + ', ' + data.venueAddress)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                fontSize: '0.9rem',
                                color: getHighContrastColor(themeColor),
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

                <ScrollReveal animation={data.animationStyle}>
                    <div style={{
                        padding: '2rem 1rem',
                        background: renderOverlayBackground(),
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
                                    color: readableTextColor,
                                    textDecoration: 'none',
                                    borderBottom: `1px solid ${themeColor}40`,
                                    transition: 'all 0.2s ease',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    fontFamily: bodyFont
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
                                color: readableSubTextColor,
                                marginTop: '0.4rem',
                                textDecoration: 'none'
                            }}
                        >
                            {data.venueAddress || 'Dirección del evento'}
                        </a>
                    </div>
                </ScrollReveal>

                {/* Back Button (Only Classic) */}
                {
                    layout === 'classic' && (
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
                    )
                }
            </div >
        </section >
    );

    const renderDressCodeSection = () => {
        const dressCodeData = getDressCodeById(data.dressCode);

        return (
            <section className="snap-section" style={{ ...sectionStyles, ...getBookPageStyle(2) }}>
                <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto', padding: '0 1rem', boxSizing: 'border-box', textAlign: 'center' }}>
                    <ScrollReveal animation={data.animationStyle}>
                        <div style={{
                            padding: '2rem 1rem',
                            background: renderOverlayBackground(),
                            borderRadius: '24px',
                            backdropFilter: 'blur(10px)',
                            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
                            marginBottom: '2rem',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}>
                            <h2 style={{ fontFamily: titleFont, fontSize: '2.5rem', color: themeColor, marginBottom: '1rem' }}>Código de Vestimenta</h2>

                            {dressCodeData?.imageUrl && (
                                <div
                                    onClick={() => setLightboxImg(dressCodeData.imageUrl)}
                                    title="Ver imagen completa"
                                    style={{
                                        width: '150px',
                                        height: '150px',
                                        borderRadius: '50%',
                                        overflow: 'hidden',
                                        marginBottom: '1rem',
                                        border: `3px solid ${themeColor}`,
                                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                                        cursor: 'zoom-in',
                                        transition: 'transform 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                >
                                    <img
                                        src={dressCodeData.imageUrl}
                                        alt={dressCodeData.label}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                            )}

                            <p style={{ fontSize: '1.3rem', color: readableTextColor, fontWeight: 600, marginBottom: '0.5rem' }}>
                                {dressCodeData ? dressCodeData.label : (data.dressCode || 'Formal')}
                            </p>

                            <p style={{ fontSize: '1rem', color: readableSubTextColor, lineHeight: '1.6', maxWidth: '80%', fontFamily: bodyFont }}>
                                {data.dressCodeDetails || dressCodeData?.description}
                            </p>
                        </div>
                    </ScrollReveal>
                </div>
            </section>
        );
    };

    const renderGallerySection = () => (
        <section className="snap-section" style={{ ...sectionStyles, ...getBookPageStyle(3) }}>
            {/* Gallery Content */}
            <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto', padding: '0 1rem 4rem 1rem', boxSizing: 'border-box', textAlign: 'center' }}>
                {data.gallery && data.gallery.length > 0 && (
                    <div style={{ marginBottom: '3rem' }}>
                        <ScrollReveal animation={data.animationStyle}>
                            <h2 style={{ fontFamily: titleFont, fontSize: '2.5rem', color: themeColor, marginBottom: '1.5rem' }}>Nuestra Historia</h2>
                        </ScrollReveal>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                            gap: '0.8rem',
                            padding: '0.5rem'
                        }}>
                            {data.gallery.map((img, index) => (
                                <ScrollReveal key={index} animation={data.animationStyle}>
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

                <ScrollReveal animation={data.animationStyle}>
                    <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => { setConfirmAction('confirm'); setShowConfirmModal(true); }}
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



    // Helper: The Content inside the "Closed" state (Cover)
    const coverContent = (
        <div style={{
            width: '100%', height: '100%',
            background: 'white',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            position: 'relative', overflow: 'hidden',
            borderRadius: '0px'
        }}>
            {/* Background */}
            {(data.backgroundImageUrl || currentTheme.backgroundImage) && (
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: data.backgroundImageUrl ? `url(${data.backgroundImageUrl})` : (currentTheme.backgroundImage || 'none'),
                    backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.5
                }}></div>
            )}

            {/* Content */}
            <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '1rem', width: '100%', boxSizing: 'border-box' }}>
                <h1 style={{ fontFamily: titleFont, fontSize: 'clamp(1.2rem, 3vw, 1.8rem)', color: themeColor, margin: '0 0 0.5rem 0', lineHeight: 1.2 }}>
                    {data.partner1} <br /> <span style={{ fontSize: '0.7em', fontStyle: 'italic' }}>&</span> <br /> {data.partner2}
                </h1>
                <div style={{ margin: '0.5rem auto', width: '30px', height: '1px', background: themeColor }}></div>
                <p style={{ fontSize: '0.8rem', color: '#444', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>
                    {formatDate(data.date)}
                </p>
            </div>
        </div>
    );

    const handleOpen = () => setShowEnvelope(false);
    const openingStyle = data.envelope?.openingStyle || 'envelope';

    return (
        <div className="preview-container" style={containerStyles}>
            {/* ... controls ... */}
            {!isGuest && !isThumbnail && (
                <div className="preview-controls" style={{ padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', zIndex: 10, position: 'absolute', top: '1rem', right: '1rem' }}>
                    <button onClick={handleZoomOut} title="Alejar" style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd', cursor: 'pointer', background: 'white', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}><ZoomOut size={16} /></button>
                    <button onClick={handleZoomIn} title="Acercar" style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd', cursor: 'pointer', background: 'white', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}><ZoomIn size={16} /></button>
                    {data.envelope?.enabled && (
                        <button
                            onClick={() => setShowEnvelope(true)}
                            title="Reiniciar Apertura"
                            style={{
                                padding: '0.5rem',
                                borderRadius: '4px',
                                border: '1px solid #ddd',
                                cursor: 'pointer',
                                background: 'white',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                                color: '#555'
                            }}
                        >
                            <RotateCcw size={16} />
                        </button>
                    )}
                </div>
            )}

            {/* Opening Experience Overlay */}
            {showEnvelope && (
                <>
                    {openingStyle === 'envelope' && (
                        <Envelope
                            onOpen={handleOpen}
                            senderName={`${data.partner1} & ${data.partner2}`}
                            type={data.envelope?.type}
                            material={data.envelope?.material}
                            color={data.envelope?.color}
                            finish={data.envelope?.finish}
                            liner={data.envelope?.liner}
                            stamp={data.envelope?.stamp}
                            seal={data.envelope?.seal}
                            initialStep={initialEnvelopeStep}
                            hideContent={hideEnvelopeContent}
                        >
                            {coverContent}
                        </Envelope>
                    )}
                    {openingStyle === 'book' && (
                        <BookOpen
                            onOpen={handleOpen}
                            coverColor={data.envelope?.color}
                            senderName={`${data.partner1} & ${data.partner2}`}
                        >
                            {coverContent}
                        </BookOpen>
                    )}
                    {openingStyle === 'crumple' && (
                        <CrumpleReveal
                            onOpen={handleOpen}
                        >
                            {coverContent}
                        </CrumpleReveal>
                    )}
                </>
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
                        themeBackground={currentTheme.backgroundImage}
                        blur={data.design?.blur}
                        saturation={data.design?.saturation}
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
                                backgroundColor: data.design?.backgroundColor || (data.backgroundImageUrl || currentTheme.backgroundImage ? 'white' : '#FAF7F2'),
                                boxShadow: 'inset 0 0 40px rgba(0,0,0,0.05), 0 20px 50px rgba(0,0,0,0.1)',
                                border: data.design?.borderStyle === 'double' ? `6px double ${data.design?.borderColor || themeColor}` : (data.design?.borderStyle === 'solid' ? `1px solid ${data.design?.borderColor || themeColor}` : 'none'),
                                borderRadius: data.design?.corners === 'square' ? '0px' : '4px',
                                display: 'flex', flexDirection: 'column',
                                overflow: 'hidden',
                                zIndex: 2
                            }}>
                                {/* Background Image Layer */}
                                <div style={{
                                    position: 'absolute', inset: 0,
                                    backgroundImage: data.design?.backgroundImage ? `url(${data.design.backgroundImage})` : (data.backgroundImageUrl ? `url(${data.backgroundImageUrl})` : (currentTheme.backgroundImage || `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`)),
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    filter: `blur(${data.design?.blur || 0}px) saturate(${data.design?.saturation ?? 100}%)`,
                                    zIndex: 0
                                }} />

                                {/* Custom Overlay */}
                                <div style={{
                                    position: 'absolute', inset: '15px',
                                    borderRadius: data.design?.corners === 'square' ? '0px' : '2px',
                                    zIndex: 1,
                                    border: data.design?.borderStyle === 'gold-frame' ? '2px solid #D4AF37' : 'none',
                                    backgroundColor: renderOverlayBackground(data.design?.overlayOpacity),
                                }}></div>

                                {!data.imageUrl && (
                                    <div style={{
                                        position: 'absolute', top: '15px', left: '15px', right: '15px', bottom: '15px',
                                        border: data.design?.borderStyle === 'floral' ? `1px solid ${data.design?.borderColor || themeColor}` : 'none',
                                        pointerEvents: 'none', opacity: 0.5, zIndex: 10
                                    }}></div>
                                )}
                                <div style={{ flex: 1, overflowY: 'auto', position: 'relative', zIndex: 2 }}>
                                    {renderIntroSection()}
                                </div>
                            </div>

                            {/* BACK FACE (Details + Gallery) */}
                            <div style={{
                                position: 'absolute', inset: 0,
                                backfaceVisibility: 'hidden',
                                backgroundColor: (data.backgroundImageUrl || currentTheme.backgroundImage) ? 'white' : '#FAF7F2', // Warm rustic paper
                                boxShadow: 'inset 0 0 40px rgba(0,0,0,0.05), 0 20px 50px rgba(0,0,0,0.1)', // Soft depth + inner vignette
                                border: currentTheme.borderStyle || 'none', // Apply theme border
                                borderRadius: '2px', // Sharper corners for paper feel
                                transform: 'rotateY(180deg)',
                                display: 'flex', flexDirection: 'column',
                                overflow: 'hidden',
                                zIndex: 1
                            }}>
                                {/* Background Image Layer */}
                                <div style={{
                                    position: 'absolute', inset: 0,
                                    backgroundImage: data.backgroundImageUrl
                                        ? `url(${data.backgroundImageUrl})`
                                        : (currentTheme.backgroundImage || `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`),
                                    backgroundSize: data.backgroundImageUrl ? 'cover' : (currentTheme.backgroundImage ? 'cover' : 'auto'),
                                    backgroundPosition: 'center',
                                    filter: `blur(${data.design?.blur || 0}px) saturate(${data.design?.saturation ?? 100}%)`,
                                    zIndex: 0
                                }} />

                                {/* Content Overlay for Readability */}
                                <div style={{
                                    position: 'absolute', inset: '15px', // Margin for overlay
                                    backgroundColor: currentTheme.contentOverlay || 'rgba(255,255,255,0.0)', // Theme overlay or transparent
                                    borderRadius: '2px',
                                    zIndex: 1
                                }}></div>

                                {!data.imageUrl && (
                                    <div style={{
                                        position: 'absolute', top: '15px', left: '15px', right: '15px', bottom: '15px',
                                        border: `1px solid ${themeColor}`, pointerEvents: 'none', opacity: 0.5, zIndex: 10
                                    }}></div>
                                )}
                                <div ref={backFaceRef} style={{ flex: 1, overflowY: 'auto', position: 'relative', zIndex: 2 }}> {/* Content above overlay */}
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

                                        <textarea
                                            placeholder="Deja un mensaje para los novios (opcional)..."
                                            value={rsvpMessage}
                                            onChange={(e) => setRsvpMessage(e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '0.8rem',
                                                border: '1px solid #ddd',
                                                borderRadius: '8px',
                                                fontSize: '0.9rem',
                                                marginBottom: '1.5rem',
                                                marginTop: '1rem',
                                                outline: 'none',
                                                resize: 'vertical',
                                                minHeight: '80px',
                                                fontFamily: 'inherit'
                                            }}
                                        />

                                        <button
                                            onClick={() => {
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

                                                    if (rsvpMessage.trim()) {
                                                        message += `\n\n💬 *Mensaje:* ${rsvpMessage}`;
                                                    }

                                                    message += `\n\n¡Gracias por la invitación! 🎉`;

                                                    const url = `https://wa.me/${data.whatsappNumber}?text=${encodeURIComponent(message)}`;
                                                    window.open(url, '_blank');
                                                    setShowConfirmModal(false);
                                                }
                                            }}
                                            style={{
                                                width: '100%',
                                                padding: '1rem',
                                                backgroundColor: (confirmAction === 'confirm' ? '#2D2A26' : '#E53935'),
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '8px',
                                                fontWeight: 600,
                                                fontSize: '1rem',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            {confirmAction === 'confirm' ? 'ENVIAR CONFIRMACIÓN' : 'ENVIAR AVISO'}
                                        </button>
                                    </div>
                                ) : (
                                    // SINGLE GUEST MODE (Legacy)
                                    !guest && (
                                        <>
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
                                                    marginBottom: '1rem', // Reduced margin
                                                    outline: 'none'
                                                }}
                                            />
                                            {/* Message Input */}
                                            <textarea
                                                placeholder="Deja un mensaje para los novios (opcional)..."
                                                value={rsvpMessage}
                                                onChange={(e) => setRsvpMessage(e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    padding: '0.8rem',
                                                    border: '1px solid #ddd',
                                                    borderRadius: '8px',
                                                    fontSize: '0.9rem',
                                                    marginBottom: '1.5rem',
                                                    outline: 'none',
                                                    resize: 'vertical',
                                                    minHeight: '80px',
                                                    fontFamily: 'inherit'
                                                }}
                                            />

                                            <button
                                                onClick={() => handleConfirmation()}
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
                                        </>
                                    )
                                )}


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
