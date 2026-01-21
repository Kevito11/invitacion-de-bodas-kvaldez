import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Edit3, Eye, Settings, Layout, Trash2, Users } from 'lucide-react';
import GuestManager from './GuestManager';
import LZString from 'lz-string';

interface SavedInvitation {
    partner1: string;
    partner2: string;
    date: string;
    theme: string;
    // We need the full data to generate links
    [key: string]: any;
}

const Dashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'designs' | 'guests' | 'settings'>('designs');
    const [savedInvitation, setSavedInvitation] = useState<SavedInvitation | null>(null);
    const [invitationUrl, setInvitationUrl] = useState('');

    useEffect(() => {
        if (user?.username) {
            const rawData = localStorage.getItem(`invitation_${user.username}`);
            if (rawData) {
                try {
                    const parsed = JSON.parse(rawData);
                    setSavedInvitation(parsed);

                    // Reconstruct URL for GuestManager
                    // Map full data to minified keys for short URL
                    if (parsed) {
                        const minified = {
                            p1: parsed.partner1,
                            p2: parsed.partner2,
                            d: parsed.date,
                            t: parsed.time,
                            v: parsed.venueName,
                            a: parsed.venueAddress,
                            m: parsed.message,
                            th: parsed.theme,
                            f: parsed.font,
                            ...(parsed.imageUrl ? { i: parsed.imageUrl } : {}),
                            ...(parsed.audioUrl ? { au: parsed.audioUrl } : {}),
                            ...(parsed.whatsappNumber ? { w: parsed.whatsappNumber } : {}),
                            ...(parsed.mapUrl ? { mu: parsed.mapUrl } : {}),
                            ...(parsed.gallery && parsed.gallery.length > 0 ? { g: parsed.gallery } : {}),
                            ...(parsed.dressCode ? { dc: parsed.dressCode } : {}),
                            ...(parsed.dressCodeDetails ? { dcd: parsed.dressCodeDetails } : {}),
                            ...(parsed.dressCodeInspirationUrl ? { dci: parsed.dressCodeInspirationUrl } : {})
                        };
                        const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(minified));
                        const url = `${window.location.origin}/invitacion?data=${compressed}`;
                        setInvitationUrl(url);
                        console.log("Invitation loaded and URL generated");
                    }
                } catch (e) {
                    console.error("Error parsing invitation", e);
                }
            }
        }
    }, [user]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleDelete = () => {
        if (window.confirm('¿Estás seguro de que quieres eliminar tu diseño? Esta acción no se puede deshacer.')) {
            if (user?.username) {
                localStorage.removeItem(`invitation_${user.username}`);
                setSavedInvitation(null);
            }
        }
    };

    const getThemeColor = (theme: string) => {
        switch (theme) {
            case 'rose': return '#E1557A';
            case 'blue': return '#4F84C4';
            case 'green': return '#5D8C62';
            case 'gold': return '#D4AF37';
            default: return '#D4AF37';
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB', fontFamily: "'Inter', sans-serif" }}>
            {/* Header */}
            <header style={{
                backgroundColor: '#fff',
                borderBottom: '1px solid #E5E7EB',
                padding: '1rem 2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <div style={{
                        width: '40px', height: '40px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 'bold', fontSize: '1.2rem'
                    }}>
                        {user?.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h1 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#1F2937', margin: 0 }}>Hola, {user?.username}</h1>
                        <p style={{ fontSize: '0.85rem', color: '#6B7280', margin: 0 }}>Bienvenido a tu panel</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        padding: '0.5rem 1rem', border: '1px solid #E5E7EB',
                        borderRadius: '6px', backgroundColor: '#fff',
                        color: '#6B7280', cursor: 'pointer', fontSize: '0.9rem'
                    }}
                >
                    <LogOut size={16} /> Cerrar Sesión
                </button>
            </header>

            <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '0 1rem', display: 'flex', gap: '2rem' }}>

                {/* Sidebar */}
                <aside style={{ width: '250px', flexShrink: 0 }}>
                    <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <button
                            onClick={() => setActiveTab('designs')}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.8rem',
                                padding: '0.8rem 1rem', borderRadius: '8px',
                                border: 'none', cursor: 'pointer',
                                backgroundColor: activeTab === 'designs' ? '#EEF2FF' : 'transparent',
                                color: activeTab === 'designs' ? '#4F46E5' : '#4B5563',
                                fontWeight: activeTab === 'designs' ? 600 : 400,
                                textAlign: 'left', transition: 'all 0.2s'
                            }}
                        >
                            <Layout size={20} /> Mis Diseños
                        </button>
                        <button
                            onClick={() => setActiveTab('guests')}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.8rem',
                                padding: '0.8rem 1rem', borderRadius: '8px',
                                border: 'none', cursor: 'pointer',
                                backgroundColor: activeTab === 'guests' ? '#EEF2FF' : 'transparent',
                                color: activeTab === 'guests' ? '#4F46E5' : '#4B5563',
                                fontWeight: activeTab === 'guests' ? 600 : 400,
                                textAlign: 'left', transition: 'all 0.2s'
                            }}
                        >
                            <Users size={20} /> Invitados
                        </button>
                        <button
                            onClick={() => setActiveTab('settings')}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.8rem',
                                padding: '0.8rem 1rem', borderRadius: '8px',
                                border: 'none', cursor: 'pointer',
                                backgroundColor: activeTab === 'settings' ? '#EEF2FF' : 'transparent',
                                color: activeTab === 'settings' ? '#4F46E5' : '#4B5563',
                                fontWeight: activeTab === 'settings' ? 600 : 400,
                                textAlign: 'left', transition: 'all 0.2s'
                            }}
                        >
                            <Settings size={20} /> Configuración
                        </button>
                    </nav>
                </aside>

                {/* Content */}
                <main style={{ flex: 1 }}>
                    {activeTab === 'designs' && (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: 0 }}>Mis Diseños</h2>
                                <button
                                    onClick={() => navigate('/create')}
                                    style={{
                                        backgroundColor: '#111827', color: 'white',
                                        padding: '0.6rem 1.2rem', borderRadius: '6px',
                                        border: 'none', cursor: 'pointer', fontWeight: 500
                                    }}
                                >
                                    + Crear Nuevo
                                </button>
                            </div>

                            {savedInvitation ? (
                                <div style={{
                                    backgroundColor: 'white', borderRadius: '12px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                    overflow: 'hidden', border: '1px solid #E5E7EB',
                                    display: 'flex', flexDirection: 'column', maxWidth: '350px'
                                }}>
                                    <div style={{
                                        height: '200px', backgroundColor: '#F3F4F6',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        background: `linear-gradient(135deg, ${getThemeColor(savedInvitation.theme)}20 0%, ${getThemeColor(savedInvitation.theme)}50 100%)`,
                                        position: 'relative'
                                    }}>
                                        <div style={{
                                            padding: '1.5rem', textAlign: 'center',
                                            backgroundColor: 'white', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                            borderRadius: '4px', width: '60%'
                                        }}>
                                            <h3 style={{ fontFamily: "Playfair Display", margin: '0 0 0.5rem', fontSize: '1.2rem' }}>
                                                {savedInvitation.partner1} & {savedInvitation.partner2}
                                            </h3>
                                            <p style={{ fontSize: '0.8rem', color: '#666', margin: 0 }}>{savedInvitation.date}</p>
                                        </div>
                                    </div>
                                    <div style={{ padding: '1.5rem' }}>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#111827', margin: '0 0 0.5rem' }}>
                                            Boda de {savedInvitation.partner1} y {savedInvitation.partner2}
                                        </h3>
                                        <p style={{ fontSize: '0.85rem', color: '#6B7280', margin: '0 0 1.5rem' }}>
                                            Guardado recientemente
                                        </p>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                                            <button
                                                onClick={() => navigate('/create')}
                                                style={{
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                                                    padding: '0.6rem', borderRadius: '6px', border: '1px solid #E5E7EB',
                                                    backgroundColor: 'white', color: '#374151', cursor: 'pointer', fontSize: '0.9rem'
                                                }}
                                            >
                                                <Edit3 size={16} /> Editar
                                            </button>

                                            {/* Reuse the share logic? For now navigate to builder as it has the logic 
                                                Actually, user wants "View" and "Share" from here.
                                                Ideally we load the builder to share, but we can also just open the view. 
                                            */}
                                            <button
                                                onClick={() => navigate('/create')}
                                                style={{
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                                                    padding: '0.6rem', borderRadius: '6px', border: '1px solid #E5E7EB',
                                                    backgroundColor: 'white', color: '#374151', cursor: 'pointer', fontSize: '0.9rem'
                                                }}
                                                title="Entra al editor para ver y compartir"
                                            >
                                                <Eye size={16} /> Ver / Compartir
                                            </button>
                                        </div>
                                        <button
                                            onClick={handleDelete}
                                            style={{
                                                width: '100%', marginTop: '0.8rem',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                                                padding: '0.6rem', borderRadius: '6px', border: 'none',
                                                backgroundColor: '#FEF2F2', color: '#EF4444', cursor: 'pointer', fontSize: '0.9rem'
                                            }}
                                        >
                                            <Trash2 size={16} /> Eliminar
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div style={{
                                    textAlign: 'center', padding: '4rem 2rem', backgroundColor: 'white',
                                    borderRadius: '12px', border: '1px solid #E5E7EB', color: '#6B7280'
                                }}>
                                    <Layout size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#111827', marginBottom: '0.5rem' }}>No tienes diseños guardados</h3>
                                    <p style={{ marginBottom: '2rem' }}>Empieza a crear tu invitación de boda ahora mismo.</p>
                                    <button
                                        onClick={() => navigate('/create')}
                                        style={{
                                            backgroundColor: '#4F46E5', color: 'white',
                                            padding: '0.8rem 1.5rem', borderRadius: '6px',
                                            border: 'none', cursor: 'pointer', fontWeight: 500
                                        }}
                                    >
                                        Crear Invitación
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'guests' && (
                        <div>
                            <div style={{ marginBottom: '2rem' }}>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', margin: 0 }}>Gestión de Invitados</h2>
                                <p style={{ color: '#6B7280', margin: '0.5rem 0 0' }}>Administra tu lista, envía invitaciones y controla las confirmaciones.</p>
                            </div>
                            {savedInvitation ? (
                                <GuestManager
                                    guests={savedInvitation.guests || []}
                                    onUpdateGuests={(updatedGuests) => {
                                        const updatedInvitation = { ...savedInvitation, guests: updatedGuests };
                                        setSavedInvitation(updatedInvitation);
                                        // Persist to localStorage
                                        if (user?.username) {
                                            localStorage.setItem(`invitation_${user.username}`, JSON.stringify(updatedInvitation));
                                        }
                                    }}
                                    invitationUrl={invitationUrl}
                                    mode="rsvp"
                                />
                            ) : (
                                <div style={{ padding: '2rem', backgroundColor: '#FEF3C7', borderRadius: '8px', color: '#92400E' }}>
                                    ⚠️ Primero debes crear y guardar una invitación para poder gestionar invitados.
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginBottom: '2rem' }}>Configuración</h2>
                            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
                                <div style={{ marginBottom: '2rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem' }}>Nombre de Usuario</label>
                                    <input
                                        type="text"
                                        value={user?.username || ''}
                                        disabled
                                        style={{
                                            width: '100%', padding: '0.7rem', borderRadius: '6px',
                                            border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', color: '#6B7280'
                                        }}
                                    />
                                </div>
                                <div style={{ padding: '1rem', backgroundColor: '#F0FDF4', borderRadius: '8px', border: '1px solid #BBF7D0', color: '#166534' }}>
                                    <p style={{ margin: 0, fontWeight: 500 }}>🎉 Cuenta Gratuita Activa</p>
                                    <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem' }}>Tienes acceso ilimitado al editor de invitaciones.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
