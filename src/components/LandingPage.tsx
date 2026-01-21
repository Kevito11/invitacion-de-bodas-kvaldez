import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Send, Smartphone, ArrowRight, Heart, CheckCircle,
    MapPin, Calendar, Clock, Music, Gift, Image,
    ChevronDown, ChevronUp, Layout, Palette, User, LogOut
} from 'lucide-react';
import invitationPreviewValues from '../assets/invitation_preview.png';
import LoginModal from './LoginModal';

const LandingPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    useEffect(() => {
        if (location.state?.showLogin) {
            setShowLoginModal(true);
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const designs = [
        { name: "Classic", color: "#F3F4F6", borderColor: "#D1D5DB" },
        { name: "Aquarelle", color: "#E0F2FE", borderColor: "#BAE6FD" },
        { name: "Elegant", color: "#FDF4FF", borderColor: "#F5D0FE" },
        { name: "Moonlight", color: "#111827", borderColor: "#374151" }, // Dark theme mock
        { name: "Vintage", color: "#FEF3C7", borderColor: "#FDE68A" },
        { name: "Minimal", color: "#FAFAF9", borderColor: "#E7E5E4" },
    ];

    const features = [
        { icon: <CheckCircle size={20} />, text: "Confirmación de asistencia (RSVP)" },
        { icon: <MapPin size={20} />, text: "Ubicación con mapas (Google Maps/Waze)" },
        { icon: <Calendar size={20} />, text: "Cuenta regresiva" },
        { icon: <Clock size={20} />, text: "Itinerario del evento" },
        { icon: <Music size={20} />, text: "Música de fondo" },
        { icon: <Gift size={20} />, text: "Mesa de regalos / Sobres" },
        { icon: <Image size={20} />, text: "Galería de fotos ilimitada" },
        { icon: <Smartphone size={20} />, text: "Diseño 100% móvil interactivo" },
    ];

    const faqs = [
        { q: "¿Cómo envío las invitaciones?", a: "Es muy fácil. Una vez creada, obtendrás un enlace único (link) que puedes compartir por WhatsApp, Email o redes sociales." },
        { q: "¿Tengo que pagar antes de diseñar?", a: "¡No! Puedes diseñar tu invitación totalmente gratis. Solo pagas si decides publicarla para enviarla a tus invitados." },
        { q: "¿Cuánto tiempo dura activa la invitación?", a: "La invitación permanece activa hasta 3 meses después de la fecha de tu boda, para que los invitados puedan subir fotos y ver los recuerdos." },
        { q: "¿Es una App que deben descargar?", a: "No. Es una Web App que funciona en cualquier navegador (Chrome, Safari) sin descargar nada." },
    ];

    return (
        <div style={{ fontFamily: "'Lato', sans-serif", backgroundColor: '#FAFAF9', overflowX: 'hidden' }}>
            <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />

            {/* Navbar */}
            <nav style={{
                padding: '1rem 5%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'sticky',
                top: 0,
                zIndex: 100,
                transition: 'all 0.3s ease',
                backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.03)' : 'none',
                flexWrap: 'wrap',
                gap: '1rem'
            }}>
                <div style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '1.4rem',
                    fontWeight: 700,
                    color: '#2D2A26',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <Heart size={20} fill="#D4AF37" color="#D4AF37" /> BodaDigital
                </div>

                <div className="nav-buttons" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {user ? (
                        <>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#555', fontWeight: 500 }}>
                                <User size={18} /> Hola, {user.username}
                            </div>
                            <button
                                onClick={() => navigate('/dashboard')}
                                style={{
                                    background: '#2D2A26',
                                    color: '#fff',
                                    padding: '0.5rem 1.2rem',
                                    fontSize: '0.9rem',
                                    borderRadius: '50px',
                                    cursor: 'pointer'
                                }}
                            >
                                Ir al Panel
                            </button>
                            <button
                                onClick={logout}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#999',
                                    cursor: 'pointer'
                                }}
                                title="Cerrar sesión"
                            >
                                <LogOut size={20} />
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => setShowLoginModal(true)}
                                style={{
                                    background: 'transparent',
                                    color: '#2D2A26',
                                    border: 'none',
                                    fontWeight: 500,
                                    padding: 0,
                                    fontSize: '0.9rem',
                                    cursor: 'pointer'
                                }}
                            >
                                Entrar
                            </button>
                            <button
                                onClick={() => setShowLoginModal(true)}
                                style={{
                                    background: '#2D2A26',
                                    color: '#fff',
                                    padding: '0.5rem 1.2rem',
                                    fontSize: '0.9rem'
                                }}
                            >
                                Empezar
                            </button>
                        </>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <header style={{
                position: 'relative',
                padding: 'clamp(3rem, 8vw, 6rem) 1rem',
                textAlign: 'center',
                background: 'radial-gradient(circle at 50% 50%, #fff 0%, #FAFAF9 100%)',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute', top: '-10%', left: '-5%', width: '400px', height: '400px',
                    background: '#F3E5AB', opacity: 0.3, filter: 'blur(80px)', borderRadius: '50%', zIndex: 0
                }} />

                <div style={{ position: 'relative', zIndex: 1, maxWidth: '1000px', margin: '0 auto' }}>
                    <span className="animate-fade-in" style={{
                        display: 'inline-block',
                        padding: '0.6rem 1.2rem',
                        backgroundColor: '#fff',
                        border: '1px solid #E8DCC4',
                        color: '#D4AF37',
                        borderRadius: '50px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        marginBottom: '1.5rem',
                        letterSpacing: '1.5px',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.03)'
                    }}>
                        LA INVITACIÓN PERFECTA
                    </span>

                    <h1 className="animate-fade-in delay-100" style={{
                        fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                        color: '#2D2A26',
                        marginBottom: '1.5rem',
                        lineHeight: 1.1,
                        letterSpacing: '-1px'
                    }}>
                        Invitaciones de boda <br />
                        <span style={{
                            background: 'linear-gradient(120deg, #D4AF37 0%, #F3E5AB 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontStyle: 'italic'
                        }}>digitales e interactivas</span>.
                    </h1>

                    <p className="animate-fade-in delay-200" style={{
                        fontSize: '1.25rem',
                        color: '#666',
                        maxWidth: '700px',
                        margin: '0 auto 2.5rem',
                        lineHeight: 1.6
                    }}>
                        Sorprende a tus invitados con una experiencia única. Fáciles de crear, hermosas de ver y perfectas para organizar tu gran día.
                    </p>

                    <div className="animate-fade-in delay-300">
                        <button
                            onClick={() => user ? navigate('/dashboard') : setShowLoginModal(true)}
                            style={{
                                backgroundColor: '#D4AF37',
                                color: '#fff',
                                padding: '1rem 2.5rem',
                                fontSize: '1.1rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                boxShadow: '0 10px 25px rgba(212, 175, 55, 0.3)'
                            }}
                        >
                            Crear mi Invitación <ArrowRight size={20} />
                        </button>
                    </div>

                    <div className="animate-float" style={{ marginTop: '5rem', display: 'flex', justifyContent: 'center', perspective: '1500px' }}>
                        <div style={{
                            width: '300px', height: '600px', backgroundColor: '#fff', borderRadius: '45px',
                            boxShadow: '0 30px 60px rgba(0,0,0,0.12), 0 0 0 12px #2D2A26',
                            overflow: 'hidden', position: 'relative'
                        }}>
                            <img src={invitationPreviewValues} alt="Demo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                    </div>
                </div>
            </header>

            {/* How it Works Section */}
            <section id="cómo-funciona" style={{ padding: 'clamp(3rem, 6vw, 5rem) 1rem', backgroundColor: '#fff' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem' }}>¿Cómo funciona?</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                        {[
                            { step: "01", title: "Crea tu diseño", desc: "Elige una plantilla y personalízala con tus fotos y datos al instante.", icon: <Palette size={32} color="#D4AF37" /> },
                            { step: "02", title: "Envía por WhatsApp", desc: "Comparte el enlace único con todos tus invitados en un solo clic.", icon: <Send size={32} color="#D4AF37" /> },
                            { step: "03", title: "Recibe confirmaciones", desc: "Mira quién asistirá desde tu panel de control en tiempo real.", icon: <CheckCircle size={32} color="#D4AF37" /> }
                        ].map((item, i) => (
                            <div key={i} style={{ padding: '2rem', borderRadius: '15px', backgroundColor: '#FAFAF9' }}>
                                <div style={{ marginBottom: '1rem' }}>{item.icon}</div>
                                <span style={{ fontSize: '3rem', fontWeight: 700, color: '#E8E8E8', lineHeight: 1 }}>{item.step}</span>
                                <h3 style={{ fontSize: '1.5rem', margin: '1rem 0' }}>{item.title}</h3>
                                <p style={{ color: '#666' }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Designs Showcase */}
            <section id="diseños" style={{ padding: 'clamp(3rem, 6vw, 5rem) 1rem', backgroundColor: '#FAFAF9' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Modelos Exclusivos</h2>
                    <p style={{ color: '#666', marginBottom: '3rem' }}>Diseños pensados para cada estilo de boda.</p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
                        {designs.map((design, i) => (
                            <div key={i} style={{
                                backgroundColor: design.color,
                                border: `1px solid ${design.borderColor}`,
                                aspectRatio: '3/4',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'column',
                                cursor: 'pointer',
                                transition: 'transform 0.3s ease',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                            }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <Layout size={32} color="#D4AF37" style={{ marginBottom: '1rem', opacity: 0.8 }} />
                                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', color: '#2D2A26' }}>
                                    {design.name}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div style={{ marginTop: '3rem' }}>
                        <button onClick={() => user ? navigate('/dashboard') : setShowLoginModal(true)} style={{ backgroundColor: '#2D2A26', color: '#fff', padding: '1rem 2rem' }}>
                            Ver todos los diseños
                        </button>
                    </div>
                </div>
            </section>

            {/* Features Detail */}
            <section style={{ padding: 'clamp(3rem, 6vw, 5rem) 1rem', backgroundColor: '#fff' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Todo lo que incluye</h2>
                        <p style={{ color: '#666' }}>La herramienta más completa para tu boda.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {features.map((feature, i) => (
                            <div key={i} style={{
                                display: 'flex', alignItems: 'center', gap: '1rem',
                                padding: '1.5rem', borderRadius: '12px', border: '1px solid #eee'
                            }}>
                                <div style={{ color: '#D4AF37' }}>{feature.icon}</div>
                                <span style={{ fontSize: '1.1rem', fontWeight: 500, color: '#444' }}>{feature.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>





            {/* FAQ */}
            <section style={{ padding: 'clamp(3rem, 6vw, 5rem) 1rem', backgroundColor: '#FAFAF9' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Preguntas Frecuentes</h2>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {faqs.map((faq, i) => (
                            <div key={i} style={{ backgroundColor: '#fff', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}>
                                <button
                                    onClick={() => toggleFaq(i)}
                                    style={{
                                        width: '100%', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                        background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '1.1rem', fontWeight: 600
                                    }}>
                                    {faq.q}
                                    {openFaq === i ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </button>
                                {openFaq === i && (
                                    <div style={{ padding: '0 1.5rem 1.5rem', color: '#666', lineHeight: 1.6 }}>
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final Footer CTA & Links */}
            <footer style={{ backgroundColor: '#2D2A26', color: '#fff', paddingTop: '6rem' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
                    {/* CTA Box */}
                    <div style={{
                        textAlign: 'center', maxWidth: '600px', margin: '0 auto 6rem',
                        borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '6rem'
                    }}>
                        <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem', color: '#fff' }}>Empieza Hoy</h2>
                        <p style={{ fontSize: '1.2rem', color: '#aaa', marginBottom: '3rem' }}>
                            Sin descargas. Sin tarjetas de crédito para probar.
                        </p>
                        <button
                            onClick={() => user ? navigate('/dashboard') : setShowLoginModal(true)}
                            style={{
                                backgroundColor: '#D4AF37',
                                color: '#fff',
                                padding: '1.2rem 3.5rem',
                                fontSize: '1.2rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.8rem',
                                boxShadow: '0 15px 30px rgba(212, 175, 55, 0.25)'
                            }}
                        >
                            Crear Invitación Gratis <ArrowRight size={20} />
                        </button>
                    </div>

                    {/* Links Columns */}
                    <div style={{
                        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '3rem', paddingBottom: '4rem'
                    }}>
                        {/* Brand */}
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem', fontFamily: "'Playfair Display', serif", marginBottom: '1.5rem', color: '#D4AF37' }}>
                                <Heart size={24} fill="#D4AF37" /> BodaDigital
                            </div>
                            <p style={{ color: '#888', lineHeight: 1.6 }}>
                                La plataforma líder para crear invitaciones de boda digitales que enamoran a tus invitados.
                            </p>
                        </div>

                        {/* Column 1 */}
                        <div>
                            <h4 style={{ color: '#fff', marginBottom: '1.5rem', fontSize: '1.1rem' }}>Producto</h4>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {['Diseños', 'Características', 'Ejemplos'].map(item => (
                                    <li key={item} style={{ marginBottom: '0.8rem' }}>
                                        <a href="#" style={{ color: '#aaa', textDecoration: 'none', transition: 'color 0.2s' }} className="footer-link">{item}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Column 2 */}
                        <div>
                            <h4 style={{ color: '#fff', marginBottom: '1.5rem', fontSize: '1.1rem' }}>Soporte</h4>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {['Centro de Ayuda', 'Preguntas Frecuentes', 'Contacto', 'Estado del servicio'].map(item => (
                                    <li key={item} style={{ marginBottom: '0.8rem' }}>
                                        <a href="#" style={{ color: '#aaa', textDecoration: 'none', transition: 'color 0.2s' }} className="footer-link">{item}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Column 3 */}
                        <div>
                            <h4 style={{ color: '#fff', marginBottom: '1.5rem', fontSize: '1.1rem' }}>Legal</h4>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {['Términos de servicio', 'Privacidad', 'Cookies'].map(item => (
                                    <li key={item} style={{ marginBottom: '0.8rem' }}>
                                        <a href="#" style={{ color: '#aaa', textDecoration: 'none', transition: 'color 0.2s' }} className="footer-link">{item}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div style={{
                        borderTop: '1px solid rgba(255,255,255,0.1)', padding: '2rem 0',
                        textAlign: 'center', color: '#666', fontSize: '0.9rem'
                    }}>
                        &copy; {new Date().getFullYear()} BodaDigital. Todos los derechos reservados. Hecho con ❤️ para el amor.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
