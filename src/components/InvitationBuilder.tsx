import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EditorPanel from './EditorPanel';
import InvitationPreview from './InvitationPreview';
import MobileMockup from './UI/MobileMockup';
import Modal from './UI/Modal';
import { Save, ArrowLeft, Check, Copy, Share2, Eye, Layout, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { InvitationData } from '../types';
import LZString from 'lz-string';
import GuestManager from './GuestManager'; // Import GuestManager

const InvitationBuilder: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'editor' | 'guests'>('editor'); // Tab State
    const [data, setData] = useState<InvitationData>({
        partner1: 'María',
        partner2: 'José',
        date: new Date().toISOString().split('T')[0],
        time: '18:00',
        venueName: 'Jardín de las Rosas',
        venueAddress: 'Av. Principal #456, Ciudad',
        message: 'Nos hace muy felices invitarlos a compartir nuestra alegría en el día de nuestra boda.',
        theme: 'gold',
        imageUrl: '',
        backgroundImageUrl: '', // Initial state
        backgroundImages: [], // Initial empty array for slideshow
        font: 'playfair',
        audioUrl: '',
        dressCode: 'Formal',
        dressCodeDetails: '',
        dressCodeInspirationUrl: '',
        mapUrl: '',
        guests: [], // Initialize guests
        mediaLibrary: [] // Initialize Media Library
    });

    const [isSaved, setIsSaved] = useState(false);
    const [showSaveModal, setShowSaveModal] = useState(false);

    // Cargar datos guardados al iniciar
    useEffect(() => {
        if (user?.username) {
            const savedData = localStorage.getItem(`invitation_${user.username}`);
            if (savedData) {
                try {
                    const parsed = JSON.parse(savedData);
                    setData(prev => ({ ...prev, ...parsed }));
                } catch (e) {
                    console.error("Error cargando invitación", e);
                }
            }
        }
    }, [user?.username]);

    const handleDataChange = (field: keyof InvitationData, value: string) => {
        setData(prev => ({ ...prev, [field]: value }));
        setIsSaved(false);
    };

    const saveData = () => {
        if (user?.username) {
            localStorage.setItem(`invitation_${user.username}`, JSON.stringify(data));
            setIsSaved(true);
            setShowSaveModal(true);
            setTimeout(() => setShowSaveModal(false), 2000);
        }
    };

    const handleExit = () => {
        navigate('/dashboard');
    };



    const getInvitationUrl = () => {
        try {
            // Minify data to reduce URL length
            // Map long keys to short keys: 
            // p1:partner1, p2:partner2, d:date, t:time, v:venueName, a:venueAddress
            // m:message, th:theme, f:font, i:imageUrl, au:audioUrl, w:whatsappNumber, g:gallery, bi:backgroundImageUrl
            // ml: mediaLibrary

            const minified = {
                p1: data.partner1,
                p2: data.partner2,
                d: data.date,
                t: data.time,
                v: data.venueName,
                a: data.venueAddress,
                m: data.message,
                th: data.theme,
                f: data.font,
                // Only include optional fields if they exist to save space
                ...(data.imageUrl ? { i: data.imageUrl } : {}),
                ...(data.backgroundImageUrl ? { bi: data.backgroundImageUrl } : {}),
                ...(data.backgroundImages && data.backgroundImages.length > 0 ? { bgi: data.backgroundImages } : {}),
                ...(data.audioUrl ? { au: data.audioUrl } : {}),
                ...(data.whatsappNumber ? { w: data.whatsappNumber } : {}),
                ...(data.mapUrl ? { mu: data.mapUrl } : {}),
                ...(data.gallery && data.gallery.length > 0 ? { g: data.gallery } : {}),
                ...(data.dressCode ? { dc: data.dressCode } : {}),
                ...(data.dressCodeDetails ? { dcd: data.dressCodeDetails } : {}),
                ...(data.dressCodeInspirationUrl ? { dci: data.dressCodeInspirationUrl } : {}),
                ...(data.mediaLibrary && data.mediaLibrary.length > 0 ? { ml: data.mediaLibrary } : {}),
                // Include guests list (minified) to allow identification
                ...(data.guests && data.guests.length > 0 ? {
                    gs: data.guests.map(g => ({
                        i: g.id,
                        n: g.name,
                        s: g.status,
                        t: g.tickets
                    }))
                } : {})
            };

            const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(minified));
            return `${window.location.origin}/invitacion?data=${compressed}`;
        } catch (e) {
            console.error("Compression error", e);
            return null;
        }
    };

    const handlePreview = () => {
        try {
            // Save current data to localStorage for preview
            localStorage.setItem('preview_data', JSON.stringify(data));

            // Open preview with mode=preview flag
            const url = `${window.location.origin}/invitacion?mode=preview`;
            const newWindow = window.open(url, '_blank');

            if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
                alert("⚠️ El navegador bloqueó la ventana emergente. Por favor permite pop-ups para ver la vista previa.");
            }
        } catch (error) {
            console.error("Preview error:", error);
            alert("No se pudo abrir la vista previa.");
        }
    };

    const handleShare = async () => {
        try {
            const url = getInvitationUrl();
            if (!url) {
                alert("No se pudo generar el enlace. Intenta de nuevo.");
                return;
            }

            // Real world URL limits
            const WARNING_LIMIT = 4000; // ~4KB
            const CRITICAL_LIMIT = 30000; // ~30KB (Browsers support it, but sharing apps might truncated)

            if (url.length > CRITICAL_LIMIT) {
                alert('🚫 TU ENLACE ES DEMASIADO LARGO.\n\nEs casi seguro que no funcionará al compartirlo.\n\nSOLUCIÓN: La "Foto de Portada" que subiste pesa demasiado. Por favor, usa una foto con enlace (Google Drive o Web) en lugar de subir el archivo directamente.');
                return;
            }

            if (url.length > WARNING_LIMIT) {
                alert("⚠️ ADVERTENCIA: Tu enlace es muy largo.\n\nEs posible que se corte al enviarlo por mensaje de texto o WhatsApp.\n\nRecomendación: Usa el importador de Google Drive para la galería y portada para mantener el enlace corto.");
            }

            // Check if Web Share API is supported AND enabled
            if (navigator.share && navigator.canShare && navigator.canShare({ url })) {
                try {
                    await navigator.share({
                        title: `Boda de ${data.partner1} & ${data.partner2}`,
                        text: '¡Te invitamos a nuestra boda!',
                        url: url
                    });
                } catch (error) {
                    if (error instanceof Error && error.name !== 'AbortError') {
                        console.error('Share failed:', error);
                        copyToClipboard(url);
                    }
                }
            } else {
                copyToClipboard(url);
            }
        } catch (error) {
            console.error("Share critical error:", error);
            alert("Ocurrió un error inesperado al compartir.");
        }
    };

    const copyToClipboard = (url: string) => {
        navigator.clipboard.writeText(url).then(() => {
            alert('¡Enlace copiado al portapapeles! 📋\n\nPuedes pegarlo en WhatsApp o Email.');
        }).catch((err) => {
            console.error("Clipboard error:", err);
            // Fallback: Show URL in a prompt for manual copy
            window.prompt("Copia este enlace manualmente:", url);
        });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#F9F9F9' }}>

            {/* Header / Toolbar */}
            <div style={{
                height: '80px',
                backgroundColor: '#fff',
                borderBottom: '1px solid rgba(0,0,0,0.05)',
                display: 'flex',
                alignItems: 'center',
                padding: '0 2rem',
                justifyContent: 'space-between',
                boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                zIndex: 10,
                backdropFilter: 'blur(10px)',
                background: 'rgba(255,255,255,0.9)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <button
                        onClick={handleExit}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666', fontSize: '0.95rem' }}
                    >
                        <ArrowLeft size={20} /> <span style={{ fontFamily: "'Lato', sans-serif" }}>Volver</span>
                    </button>
                    <span style={{ height: '30px', width: '1px', backgroundColor: '#eee' }}></span>
                    <h2 style={{ fontSize: '1.4rem', margin: 0, fontFamily: "'Playfair Display', serif", color: '#2D2A26' }}>Diseña tu Invitación</h2>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={handlePreview}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            backgroundColor: '#fff',
                            border: '1px solid #E8E8E8',
                            padding: '0.7rem 1.4rem',
                            borderRadius: '50px',
                            cursor: 'pointer',
                            color: '#666',
                            fontWeight: 600,
                            boxShadow: '0 2px 5px rgba(0,0,0,0.02)',
                            transition: 'all 0.2s ease'
                        }}
                        title="Ver cómo lo verán tus invitados"
                    >
                        <Eye size={18} /> Vista Previa
                    </button>

                    <button
                        onClick={saveData}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            backgroundColor: '#fff',
                            border: '1px solid #E8E8E8',
                            padding: '0.7rem 1.4rem',
                            borderRadius: '50px',
                            cursor: 'pointer',
                            color: '#2D2A26',
                            fontWeight: 600,
                            boxShadow: '0 2px 5px rgba(0,0,0,0.02)',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <Save size={18} /> {isSaved ? 'Guardado' : 'Guardar'}
                    </button>

                    <button
                        onClick={handleShare}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            backgroundColor: '#2D2A26',
                            border: 'none',
                            padding: '0.7rem 1.8rem',
                            borderRadius: '50px',
                            cursor: 'pointer',
                            color: '#fff',
                            fontWeight: 600,
                            boxShadow: '0 5px 15px rgba(45, 42, 38, 0.2)',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        {typeof navigator !== 'undefined' && 'share' in navigator ? <Share2 size={18} /> : <Copy size={18} />}
                        {typeof navigator !== 'undefined' && 'share' in navigator ? 'Compartir' : 'Copiar Enlace'}
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="builder-container" style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

                {/* Left Panel: Tabbed Interface */}
                <div style={{ width: '450px', backgroundColor: 'white', borderRight: '1px solid #eee', display: 'flex', flexDirection: 'column' }}>

                    {/* Tabs */}
                    <div style={{ display: 'flex', borderBottom: '1px solid #E5E7EB' }}>
                        <button
                            onClick={() => setActiveTab('editor')}
                            style={{
                                flex: 1, padding: '1rem', border: 'none', background: activeTab === 'editor' ? 'white' : '#F9FAFB',
                                borderBottom: activeTab === 'editor' ? '2px solid #4F46E5' : 'none',
                                fontWeight: activeTab === 'editor' ? 600 : 400, color: activeTab === 'editor' ? '#4F46E5' : '#6B7280',
                                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                transition: 'all 0.2s'
                            }}
                        >
                            <Layout size={18} /> Editor
                        </button>
                        <button
                            onClick={() => setActiveTab('guests')}
                            style={{
                                flex: 1, padding: '1rem', border: 'none', background: activeTab === 'guests' ? 'white' : '#F9FAFB',
                                borderBottom: activeTab === 'guests' ? '2px solid #4F46E5' : 'none',
                                fontWeight: activeTab === 'guests' ? 600 : 400, color: activeTab === 'guests' ? '#4F46E5' : '#6B7280',
                                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                transition: 'all 0.2s'
                            }}
                        >
                            <Users size={18} /> Invitados
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="editor-panel" style={{ flex: 1, overflowY: 'auto' }}>

                        {activeTab === 'editor' ? (
                            <div style={{ padding: '2rem' }}>
                                <h3 style={{ marginBottom: '1.5rem', color: '#888', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    Personaliza tu Diseño
                                </h3>
                                <EditorPanel data={data} onChange={handleDataChange} />
                            </div>
                        ) : (
                            <GuestManager
                                guests={data.guests || []}
                                onUpdateGuests={(newGuests) => {
                                    setData(prev => ({ ...prev, guests: newGuests }));
                                    setIsSaved(false);
                                }}
                                invitationUrl={getInvitationUrl() || ''}
                                mode="design"
                            />
                        )}
                    </div>
                </div>

                {/* Right: Preview Area */}
                <div className="preview-area" style={{
                    flex: 1,
                    backgroundColor: '#F3F4F6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem',
                    backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }}>
                    <MobileMockup scale={0.9}>
                        <InvitationPreview data={data} />
                    </MobileMockup>
                </div>
            </div>

            {/* Save Success Modal */}
            <Modal isOpen={showSaveModal} onClose={() => setShowSaveModal(false)}>
                <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                    <div className="animate-scale-in" style={{
                        width: '70px', height: '70px',
                        backgroundColor: '#F9F5EB', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 1.5rem',
                        color: '#D4AF37'
                    }}>
                        <Check size={36} />
                    </div>
                    <h3 style={{ fontSize: '1.6rem', marginBottom: '0.8rem', fontFamily: "'Playfair Display', serif" }}>¡Guardado!</h3>
                    <p style={{ color: '#666', fontSize: '1.05rem', marginBottom: '2rem' }}>
                        Tu invitación se ha guardado correctamente.
                    </p>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <button
                            onClick={handlePreview}
                            style={{ padding: '0.8rem 1.5rem', border: '1px solid #ddd', borderRadius: '8px', background: 'white', cursor: 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            <Eye size={16} /> Ver
                        </button>
                        <button
                            onClick={() => { handleShare(); setShowSaveModal(false); }}
                            style={{ padding: '0.8rem 1.5rem', border: 'none', borderRadius: '8px', background: '#2D2A26', color: 'white', cursor: 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            <Share2 size={16} /> Compartir
                        </button>
                    </div>

                    <button
                        onClick={() => { setShowSaveModal(false); navigate('/dashboard'); }}
                        style={{
                            marginTop: '1.5rem', background: 'none', border: 'none',
                            color: '#666', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.9rem'
                        }}
                    >
                        Volver a Mis Diseños
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default InvitationBuilder;
