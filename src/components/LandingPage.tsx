import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    ArrowRight, CheckCircle,
    Layout, Palette, User, ChevronDown, ChevronUp, Star, Heart, Smartphone, Globe, Moon, Sun, Menu, X
} from 'lucide-react';
import heroCouple from '../assets/hero_bw_couple.jpg';
import heroHands from '../assets/hero_bw_hands.png';
import LoginModal from './LoginModal';

// Translations
const translations = {
    es: {
        nav: {
            login: "Iniciar Sesión",
            panel: "Mi Panel",
            start: "Empezar Gratis"
        },
        hero: {
            title1: "Tu historia de amor",
            title2: "merece lo mejor.",
            subtitle: "Invitaciones digitales elegantes que capturan tu esencia. Olvida el papel, simplifica el RSVP e impresiona a tus invitados.",
            cta: "Crear Invitación",
            stats: "Más de 10,000 bodas organizadas"
        },
        trusted: "Características Premium Incluidas",
        process: {
            title: "¿Cómo funciona?",
            subtitle: "FÁCIL Y RÁPIDO",
            steps: [
                { title: "Elige tu Diseño", desc: "Comienza con una de nuestras plantillas premium y personalízala a tu gusto." },
                { title: "Agrega Detalles", desc: "Sube tus fotos, historia de amor, itinerario y mesa de regalos." },
                { title: "Comparte", desc: "Obtén un enlace único y envíalo por WhatsApp a todos tus invitados." }
            ]
        },
        features: {
            f1: {
                title: "Diseños de Clase Mundial",
                desc: "Nuestras plantillas no son solo imágenes; son experiencias interactivas. Elige entre estilos clásicos, bohemios o modernos.",
                items: ['Tipografías elegantes', 'Animaciones suaves', 'Música de fondo']
            },
            f2: {
                title: "Gestión en tu Bolsillo",
                desc: "Mira quién ha confirmado, organiza las mesas y gestiona restricciones alimentarias desde tu celular.",
                items: ['Confirmaciones WhatsApp', 'Estadísticas en vivo', 'Exportación a Excel']
            }
        },
        showcase: {
            title: "Encuentra tu estilo",
            subtitle: "Explora nuestra colección curada por diseñadores.",
            cta: "Ver Todo el Catálogo"
        },
        testimonial: {
            text: "\"Hizo que organizar nuestra boda fuera increíblemente fácil. A nuestros invitados les encantó la experiencia digital y nosotros ahorramos mucho tiempo.\"",
            author: "– SOFÍA Y MATEO"
        },
        faq: {
            title: "Preguntas Frecuentes",
            items: [
                { q: "¿Cómo envío las invitaciones?", a: "Es muy fácil. Una vez creada, obtendrás un enlace único (link) que puedes compartir por WhatsApp, Email o redes sociales." },
                { q: "¿Tengo que pagar antes de diseñar?", a: "¡No! Puedes diseñar tu invitación totalmente gratis. Solo pagas si decides publicarla para enviarla a tus invitados." }
            ]
        },
        footer: {
            links: ['Términos', 'Privacidad', 'Contacto', 'Blog'],
            rights: "Todos los derechos reservados."
        }
    },
    en: {
        nav: {
            login: "Log In",
            panel: "My Dashboard",
            start: "Start for Free"
        },
        hero: {
            title1: "Your love story",
            title2: "deserves the best.",
            subtitle: "Elegant digital invitations that capture your essence. Forget paper, simplify RSVPs, and impress your guests.",
            cta: "Create Invitation",
            stats: "Over 10,000 weddings planned"
        },
        trusted: "Premium Features Included",
        process: {
            title: "How it works?",
            subtitle: "QUICK & EASY",
            steps: [
                { title: "Choose your Design", desc: "Start with one of our premium templates and customize it to your taste." },
                { title: "Add Details", desc: "Upload your photos, love story, itinerary, and registry." },
                { title: "Share", desc: "Get a unique link and send it via WhatsApp to all your guests." }
            ]
        },
        features: {
            f1: {
                title: "World Class Designs",
                desc: "Our templates are not just images; they are interactive experiences. Choose from classic, bohemian, or modern styles.",
                items: ['Elegant Typography', 'Smooth Animations', 'Background Music']
            },
            f2: {
                title: "Management in your Pocket",
                desc: "See who RSVP'd, organize tables, and manage dietary restrictions right from your phone.",
                items: ['WhatsApp RSVPs', 'Live Statistics', 'Excel Export']
            }
        },
        showcase: {
            title: "Find your style",
            subtitle: "Explore our collection curated by designers.",
            cta: "View Full Catalog"
        },
        testimonial: {
            text: "\"It made organizing our wedding incredibly easy. Our guests loved the digital experience and we saved so much time.\"",
            author: "– SOPHIA & MATTHEW"
        },
        faq: {
            title: "Frequently Asked Questions",
            items: [
                { q: "How do I send the invitations?", a: "It's very easy. Once created, you get a unique link that you can share via WhatsApp, Email, or social media." },
                { q: "Do I have to pay before designing?", a: "No! You can design your invitation completely for free. You only pay if you decide to publish it to send to your guests." }
            ]
        },
        footer: {
            links: ['Terms', 'Privacy', 'Contact', 'Blog'],
            rights: "All rights reserved."
        }
    }
};

const LandingPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [activeHeroImage, setActiveHeroImage] = useState(0);
    const [lang, setLang] = useState<'es' | 'en'>('es');
    const [darkMode, setDarkMode] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const t = translations[lang];
    const heroImages = [heroCouple, heroHands];

    // Colors - Dynamic Palette
    const colors = darkMode ? {
        primary: "#E6BEAE", // Dusty Blush (Same)
        secondary: "#B5C99A", // Sage Green (Same)
        dark: "#F3F4F6", // Text is Light Gray
        light: "#111827", // Background is Dark Charcoal
        white: "#1F2937", // Card Background is slightly lighter dark
        textMuted: "#9CA3AF",
        border: "#374151"
    } : {
        primary: "#E6BEAE",
        secondary: "#B5C99A",
        dark: "#4A4A4A",
        light: "#FDFBF7", // Soft Antique White
        white: "#FFFFFF",
        textMuted: "#6B7280",
        border: "#E5E7EB"
    };

    useEffect(() => {
        if (location.state?.showLogin) {
            setShowLoginModal(true);
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveHeroImage((prev) => (prev + 1) % heroImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const designs = [
        { name: "Blush Luxury", color: "#FFF0F5", border: "#FBCFE8", accent: "#E6BEAE" },
        { name: "Sage Garden", color: "#F0FFF4", border: "#BBF7D0", accent: "#B5C99A" },
        { name: "Classic Cream", color: "#FFFAF0", border: "#FEEBC8", accent: "#D4A373" },
    ];

    return (
        <div style={{ fontFamily: "'Montserrat', sans-serif", backgroundColor: colors.light, color: colors.dark, overflowX: 'hidden', minHeight: '100vh', transition: 'background-color 0.3s ease, color 0.3s ease' }}>
            <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />

            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-up {
                    animation: fadeInUp 0.8s ease-out forwards;
                    opacity: 0;
                }
                .delay-100 { animation-delay: 0.1s; }
                .delay-200 { animation-delay: 0.2s; }
                .delay-300 { animation-delay: 0.3s; }
                
                @media (max-width: 900px) {
                    header { flex-direction: column; }
                    header > div:first-child { min-height: 25vh !important; flex: 0 0 25vh !important; }
                    header > div:last-child { padding: 2.5rem 1.5rem !important; }
                    header h1 { font-size: 2.5rem !important; }
                    .feature-row { flexDirection: column !important; text-align: center; gap: 2rem !important; }
                    .feature-row ul { align-items: center; }
                    .desktop-menu { display: flex !important; gap: 0.5rem !important; }
                    .desktop-menu button { padding: 0.4rem !important; }
                    .nav-text { display: none !important; }
                    .mobile-menu-btn { display: none !important; }
                    .main-nav { background-color: ${colors.light} !important; border-bottom: 1px solid ${colors.border}; }
                    .brand-logo { font-size: 1.2rem !important; }
                }
            `}</style>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100vh',
                    backgroundColor: colors.light,
                    zIndex: 200,
                    padding: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease'
                }}>
                    <button
                        onClick={() => setMobileMenuOpen(false)}
                        style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: colors.dark }}
                    >
                        <X size={32} />
                    </button>

                    <button
                        onClick={() => { setDarkMode(!darkMode); setMobileMenuOpen(false); }}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'none', border: 'none', fontSize: '1.2rem', color: colors.dark, fontWeight: 600 }}
                    >
                        {darkMode ? <Moon size={24} /> : <Sun size={24} />}
                        {darkMode ? (lang === 'en' ? 'Dark Mode' : 'Modo Oscuro') : (lang === 'en' ? 'Light Mode' : 'Modo Claro')}
                    </button>

                    <button
                        onClick={() => { setLang(l => l === 'es' ? 'en' : 'es'); setMobileMenuOpen(false); }}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'none', border: 'none', fontSize: '1.2rem', color: colors.dark, fontWeight: 600 }}
                    >
                        <Globe size={24} /> {lang === 'es' ? 'Lenguaje: Español' : 'Language: English'}
                    </button>

                    {!user && (
                        <button
                            onClick={() => { setShowLoginModal(true); setMobileMenuOpen(false); }}
                            style={{
                                background: 'transparent',
                                border: `2px solid ${colors.primary}`,
                                color: colors.primary,
                                padding: '1rem 2.5rem',
                                borderRadius: '50px',
                                fontSize: '1.2rem',
                                fontWeight: 600,
                                marginTop: '1rem'
                            }}
                        >
                            {t.nav.login}
                        </button>
                    )}

                    {user && (
                        <button
                            onClick={() => navigate('/dashboard')}
                            style={{
                                background: colors.primary,
                                color: '#fff',
                                padding: '1rem 2.5rem',
                                borderRadius: '50px',
                                fontSize: '1.2rem',
                                fontWeight: 600,
                                border: 'none',
                                marginTop: '1rem'
                            }}
                        >
                            {t.nav.panel}
                        </button>
                    )}
                </div>
            )}

            {/* Navbar */}
            <nav className="main-nav" style={{
                position: 'fixed',
                width: '100%',
                top: 0,
                zIndex: 100,
                transition: 'all 0.3s ease',
                backgroundColor: scrolled ? (darkMode ? 'rgba(17, 24, 39, 0.98)' : 'rgba(229, 231, 235, 0.98)') : 'transparent',
                backdropFilter: scrolled ? 'blur(10px)' : 'none',
                boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.03)' : 'none',
                borderBottom: scrolled ? `1px solid ${colors.border}` : 'none',
                display: 'flex',
                justifyContent: 'center'
            }}>
                <div style={{
                    maxWidth: '1200px',
                    width: '100%',
                    padding: '1rem 1.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <div className="brand-logo" style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '1.6rem',
                        fontWeight: 700,
                        color: colors.dark,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        letterSpacing: '-0.5px'
                    }}>
                        <div style={{ backgroundColor: colors.primary, borderRadius: '50%', padding: '6px', display: 'flex' }}>
                            <Heart size={18} fill="white" color="white" />
                        </div>
                        BodaDigital
                    </div>

                    {/* Desktop Menu */}
                    <div className="desktop-menu" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        {/* Dark Mode Toggle */}
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.4rem',
                                background: 'transparent', border: `1px solid ${colors.border}`,
                                padding: '0.4rem 0.8rem', borderRadius: '20px',
                                fontSize: '0.8rem', fontWeight: 600, color: colors.dark,
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            {darkMode ? <Moon size={18} /> : <Sun size={18} />}
                            <span className="nav-text">{darkMode ? (lang === 'en' ? 'Dark' : 'Noche') : (lang === 'en' ? 'Light' : 'Día')}</span>
                        </button>

                        {/* Language Toggle */}
                        <button
                            onClick={() => setLang(l => l === 'es' ? 'en' : 'es')}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.4rem',
                                background: 'transparent', border: `1px solid ${colors.border}`,
                                padding: '0.4rem 0.8rem', borderRadius: '20px',
                                fontSize: '0.8rem', fontWeight: 600, color: colors.dark,
                                cursor: 'pointer'
                            }}
                        >
                            <Globe size={18} /> <span className="nav-text">{lang.toUpperCase()}</span>
                        </button>

                        {!user && (
                            <button
                                onClick={() => setShowLoginModal(true)}
                                style={{
                                    background: 'transparent',
                                    color: colors.dark,
                                    border: 'none',
                                    fontWeight: 600,
                                    fontSize: '0.95rem',
                                    cursor: 'pointer',
                                    padding: '0.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                <User size={20} /> <span className="nav-text">{t.nav.login}</span>
                            </button>
                        )}
                        {user && (
                            <button
                                onClick={() => navigate('/dashboard')}
                                style={{
                                    background: colors.dark,
                                    color: darkMode ? '#111827' : '#fff',
                                    padding: '0.7rem 1.8rem',
                                    borderRadius: '50px',
                                    fontSize: '0.95rem',
                                    fontWeight: 600,
                                    border: 'none',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                <Layout size={20} /> <span className="nav-text">{t.nav.panel}</span>
                            </button>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="mobile-menu-btn"
                        onClick={() => setMobileMenuOpen(true)}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: colors.dark,
                            display: 'none', // Controlled by CSS
                            padding: '0.5rem'
                        }}
                    >
                        <Menu size={28} />
                    </button>
                </div>
            </nav>

            {/* Split Hero Section */}
            <header style={{
                display: 'flex',
                minHeight: '100vh',
                position: 'relative'
            }}>
                {/* Left: Slideshow */}
                <div style={{
                    flex: 1.1,
                    position: 'relative',
                    overflow: 'hidden',
                    minHeight: '50vh',
                    backgroundColor: darkMode ? '#111' : '#E5E7EB'
                }}>
                    {heroImages.map((img, index) => (
                        <div
                            key={index}
                            style={{
                                position: 'absolute',
                                inset: 0,
                                backgroundImage: `url(${img})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                opacity: activeHeroImage === index ? 1 : 0,
                                transition: 'opacity 1.5s ease-in-out',
                                transform: activeHeroImage === index ? 'scale(1.05)' : 'scale(1)',
                                transitionProperty: 'opacity, transform',
                                transitionDuration: '1.5s, 6s',
                            }}
                        />
                    ))}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.1), transparent)' }}></div>
                </div>

                {/* Right: Content */}
                <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: 'clamp(2rem, 4vw, 4rem)',
                    backgroundColor: colors.light,
                    transition: 'background-color 0.3s ease'
                }}>
                    <div style={{ maxWidth: '600px' }}>
                        <h1 className="animate-fade-up delay-100" style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: 'clamp(2rem, 4vw, 3rem)',
                            color: colors.dark,
                            lineHeight: 1.1,
                            marginBottom: '1rem',
                            letterSpacing: '-0.5px'
                        }}>
                            {t.hero.title1} <br />
                            <span style={{ fontStyle: 'italic', color: colors.primary }}>{t.hero.title2}</span>
                        </h1>

                        <p className="animate-fade-up delay-200" style={{
                            fontSize: '1rem', color: colors.textMuted, lineHeight: 1.7, marginBottom: '2.5rem'
                        }}>
                            {t.hero.subtitle}
                        </p>

                        <div className="animate-fade-up delay-300" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            <button
                                onClick={() => user ? navigate('/dashboard') : setShowLoginModal(true)}
                                style={{
                                    backgroundColor: colors.primary,
                                    color: '#fff',
                                    padding: '1rem 2.5rem',
                                    borderRadius: '4px',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.8rem',
                                    boxShadow: `0 4px 6px ${colors.primary}40`,
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px'
                                }}
                            >
                                {t.hero.cta} <ArrowRight size={18} />
                            </button>
                        </div>

                        <div className="animate-fade-up delay-300" style={{ marginTop: '3rem', display: 'flex', alignItems: 'center', gap: '1rem', color: colors.textMuted, fontSize: '0.9rem' }}>
                            <div style={{ display: 'flex' }}>
                                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={16} fill={colors.secondary} color={colors.secondary} />)}
                            </div>
                            <span>{t.hero.stats}</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Trusted By Bar */}
            <div style={{ backgroundColor: colors.white, padding: '2rem 0', borderBottom: `1px solid ${colors.border}`, transition: 'background-color 0.3s ease' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.8rem', color: colors.textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.5rem' }}>
                        {t.trusted}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap', opacity: 0.6, filter: darkMode ? 'grayscale(1) invert(1)' : 'grayscale(1)' }}>
                        {['Google Maps', 'Spotify', 'WhatsApp', 'Calendar'].map((brand, i) => (
                            <span key={i} style={{ fontSize: '1.2rem', fontWeight: 700, color: colors.dark, fontFamily: "'Playfair Display', serif" }}>{brand}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content Sections */}

            {/* Features Zig Zag */}
            <section style={{ padding: '4rem 1.5rem', backgroundColor: colors.white, transition: 'background-color 0.3s ease' }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '5rem' }}>
                    {/* Feature 1 */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4rem', flexDirection: 'row' }} className="feature-row">
                        <div style={{ flex: 1 }}>
                            <div style={{ width: '50px', height: '50px', background: darkMode ? '#374151' : '#FFF0F5', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                                <Palette size={24} color={colors.primary} />
                            </div>
                            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', marginBottom: '1rem', color: colors.dark }}>{t.features.f1.title}</h2>
                            <p style={{ color: colors.textMuted, lineHeight: 1.7, fontSize: '1rem', marginBottom: '2rem' }}>
                                {t.features.f1.desc}
                            </p>
                            <ul style={{ padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {t.features.f1.items.map(item => (
                                    <li key={item} style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', color: colors.dark, fontWeight: 500 }}>
                                        <CheckCircle size={18} color={colors.secondary} /> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div style={{ flex: 1, backgroundColor: colors.light, height: '400px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${colors.border}`, transition: 'background-color 0.3s ease' }}>
                            <Layout size={80} color={darkMode ? "#4B5563" : "#D1D5DB"} />
                        </div>
                    </div>

                    {/* Feature 2 (Reversed) */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4rem', flexDirection: 'row-reverse' }} className="feature-row">
                        <div style={{ flex: 1 }}>
                            <div style={{ width: '50px', height: '50px', background: darkMode ? '#374151' : '#F0FFF4', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                                <Smartphone size={24} color={colors.secondary} />
                            </div>
                            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', marginBottom: '1rem', color: colors.dark }}>{t.features.f2.title}</h2>
                            <p style={{ color: colors.textMuted, lineHeight: 1.7, fontSize: '1rem', marginBottom: '2rem' }}>
                                {t.features.f2.desc}
                            </p>
                            <ul style={{ padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {t.features.f2.items.map(item => (
                                    <li key={item} style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', color: colors.dark, fontWeight: 500 }}>
                                        <CheckCircle size={18} color={colors.secondary} /> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div style={{ flex: 1, backgroundColor: colors.light, height: '400px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${colors.border}`, transition: 'background-color 0.3s ease' }}>
                            <User size={80} color={darkMode ? "#4B5563" : "#D1D5DB"} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Design Showcase */}
            <section style={{ padding: '4rem 1.5rem', backgroundColor: colors.light, transition: 'background-color 0.3s ease' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: colors.dark, margin: 0 }}>{t.showcase.title}</h2>
                        <p style={{ fontSize: '1rem', color: colors.textMuted, marginTop: '1rem' }}>{t.showcase.subtitle}</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        {designs.map((design, i) => (
                            <div key={i} style={{
                                backgroundColor: colors.white,
                                borderRadius: '0',
                                border: `1px solid ${colors.border}`,
                                transition: 'all 0.3s ease',
                                cursor: 'pointer',
                                position: 'relative'
                            }}
                                className="design-card"
                            >
                                <div style={{
                                    height: '400px',
                                    backgroundColor: design.color,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderBottom: `1px solid ${colors.border}`,
                                    padding: '2rem'
                                }}>
                                    <div style={{
                                        width: '100%', height: '100%', backgroundColor: 'white',
                                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)',
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                        border: `1px solid ${design.border}`
                                    }}>
                                        <div style={{ fontFamily: "'Great Vibes', cursive", fontSize: '2.5rem', color: design.accent, marginBottom: '0.5rem' }}>M & J</div>
                                        <div style={{ fontSize: '0.7rem', letterSpacing: '3px', textTransform: 'uppercase', color: '#9CA3AF' }}>SAVE THE DATE</div>
                                    </div>
                                </div>
                                <div style={{ padding: '1.5rem', textAlign: 'center' }}>
                                    <h3 style={{ fontSize: '1rem', fontWeight: 600, color: colors.dark, margin: 0 }}>{design.name}</h3>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                        <button
                            onClick={() => user ? navigate('/dashboard') : setShowLoginModal(true)}
                            style={{
                                border: `1px solid ${colors.dark}`,
                                backgroundColor: 'transparent',
                                color: colors.dark,
                                padding: '1rem 3rem',
                                fontSize: '0.9rem',
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                cursor: 'pointer'
                            }}
                        >
                            {t.showcase.cta}
                        </button>
                    </div>
                </div>
            </section>

            {/* Testimonial */}
            <section style={{ padding: '4rem 1.5rem', backgroundColor: darkMode ? '#000' : colors.dark, color: 'white', textAlign: 'center' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div style={{ marginBottom: '2rem' }}><Star size={24} fill={colors.primary} color={colors.primary} /></div>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontStyle: 'italic', lineHeight: 1.6, marginBottom: '2rem' }}>
                        {t.testimonial.text}
                    </h3>
                    <p style={{ fontWeight: 700, fontSize: '0.9rem', color: colors.primary }}>
                        {t.testimonial.author}
                    </p>
                </div>
            </section>

            {/* FAQ */}
            <section style={{ padding: '4rem 1.5rem', backgroundColor: colors.white, transition: 'background-color 0.3s ease' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: colors.dark, marginBottom: '2rem', textAlign: 'center' }}>{t.faq.title}</h2>
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        {t.faq.items.map((faq, i) => (
                            <div key={i} style={{ borderBottom: `1px solid ${colors.border}`, paddingBottom: '1.5rem' }}>
                                <button
                                    onClick={() => toggleFaq(i)}
                                    style={{
                                        width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                        background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                                        fontSize: '1rem', fontWeight: 600, color: colors.dark, fontFamily: "'Playfair Display', serif"
                                    }}>
                                    {faq.q}
                                    {openFaq === i ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </button>
                                {openFaq === i && (
                                    <div style={{ marginTop: '1rem', color: colors.textMuted, lineHeight: 1.6 }}>{faq.a}</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ backgroundColor: colors.light, padding: '4rem 1.5rem', borderTop: `1px solid ${colors.border}`, transition: 'background-color 0.3s ease' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', color: colors.dark }}>
                        <Heart size={20} fill={colors.primary} color={colors.primary} /> BodaDigital
                    </div>
                    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                        {t.footer.links.map(link => (
                            <a key={link} href="#" style={{ color: colors.textMuted, textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>{link}</a>
                        ))}
                    </div>
                    <p style={{ color: colors.textMuted, fontSize: '0.85rem' }}>&copy; 2024 BodaDigital. {t.footer.rights}</p>
                </div>
            </footer>

        </div>
    );
};

export default LandingPage;
