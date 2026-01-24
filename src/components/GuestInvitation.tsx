import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import InvitationPreview from './InvitationPreview';
import Envelope from './UI/Envelope';
import AudioPlayer from './UI/AudioPlayer';
import LZString from 'lz-string';

const GuestInvitation: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
    const [data, setData] = useState<any>(null);
    const [currentGuest, setCurrentGuest] = useState<any>(null); // Guest found by ID

    useEffect(() => {
        const mode = searchParams.get('mode');

        // 1. Preview Mode (Local)
        if (mode === 'preview') {
            const stored = localStorage.getItem('preview_data');
            if (stored) {
                setData(JSON.parse(stored));
                return;
            }
        }

        // 2. Compressed Data Mode (Short Link)
        const compressedData = searchParams.get('data');
        if (compressedData) {
            try {
                const decompressed = LZString.decompressFromEncodedURIComponent(compressedData);
                if (decompressed) {
                    const parsed = JSON.parse(decompressed);

                    // Check if is minified (has 'p1' instead of 'partner1')
                    if (parsed.p1 || parsed.p2) {
                        console.log("Minified Data Parsed:", parsed); // DEBUG
                        console.log("Image URL (i):", parsed.i); // DEBUG
                        // Expand minified data
                        setData({
                            partner1: parsed.p1 || 'Ana',
                            partner2: parsed.p2 || 'Carlos',
                            date: parsed.d || new Date().toISOString().split('T')[0],
                            time: parsed.t || '18:00',
                            venueName: parsed.v || 'Lugar del Evento',
                            venueAddress: parsed.a || 'Dirección',
                            message: parsed.m || 'Te invitamos a nuestra boda.',
                            theme: parsed.th || 'gold',
                            font: parsed.f || 'playfair',
                            imageUrl: parsed.i || '',
                            audioUrl: parsed.au || '',
                            whatsappNumber: parsed.w || '',
                            mapUrl: parsed.mu || '',
                            gallery: parsed.g || [],
                            dressCode: parsed.dc || 'Formal',
                            dressCodeDetails: parsed.dcd || '',
                            dressCodeInspirationUrl: parsed.dci || '',
                            backgroundImageUrl: parsed.bi || '', // Expand background image
                            backgroundImages: parsed.bgi || [], // Expand background slideshow array
                            guests: parsed.gs ? parsed.gs.map((g: any) => ({
                                id: g.i,
                                name: g.n,

                                status: g.s,
                                tickets: g.t || 1,
                                email: '', phone: '', notes: '' // Defaults for partial data
                            })) : [],
                            guestName: searchParams.get('gn') || '' // Legacy fallback
                        });
                    } else {
                        // Legacy: Full JSON object
                        setData(parsed);
                    }
                    return;
                } else {
                    // Decompression failed (likely truncated)
                    alert("⚠️ Error: El enlace de la invitación está roto o incompleto. Por favor solicita un nuevo enlace.");
                }
            } catch (e) {
                console.error("Decompression failed", e);
                alert("⚠️ Error crítico: No se pudo leer la invitación.");
            }
        }

        // 3. Fallback: Legacy URL params
        const getParam = (key: string, def: string) => searchParams.get(key) || def;

        setData({
            partner1: getParam('p1', 'Ana'),
            partner2: getParam('p2', 'Carlos'),
            date: getParam('d', new Date().toISOString().split('T')[0]),
            time: getParam('t', '18:00'),
            venueName: getParam('v', 'Lugar del Evento'),
            venueAddress: getParam('va', 'Dirección'),
            message: getParam('m', 'Te invitamos a nuestra boda.'),
            theme: getParam('th', 'gold'),
            imageUrl: getParam('img', ''),
            font: getParam('font', 'playfair'),
            audioUrl: getParam('audio', ''),
            whatsappNumber: getParam('wa', ''),
            gallery: searchParams.getAll('gallery')
        });
    }, [searchParams]);

    // Side effect to find guest once data is loaded
    useEffect(() => {
        if (data && data.guests) {
            const guestId = searchParams.get('gid');
            if (guestId) {
                const found = data.guests.find((g: any) => g.id === guestId);
                if (found) {
                    setCurrentGuest(found);
                }
            }
        }
    }, [data, searchParams]);

    if (!data) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Cargando...</div>;

    return (

        <div style={{
            width: '100vw',
            height: '100vh',
            backgroundColor: '#FAFAF9',
            overflow: 'hidden',
            position: 'relative'
        }}>
            <AudioPlayer isPlaying={isEnvelopeOpen} src={data.audioUrl} />
            <Envelope onOpen={() => setIsEnvelopeOpen(true)} senderName={`${data.partner1} & ${data.partner2}`} />

            <div style={{
                opacity: isEnvelopeOpen ? 1 : 0,
                transform: isEnvelopeOpen ? 'scale(1)' : 'scale(0.95)',
                transition: 'all 1.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
                height: '100%',
                filter: isEnvelopeOpen ? 'blur(0)' : 'blur(10px)',
                overflowY: 'hidden',
                WebkitOverflowScrolling: 'touch'
            }}>
                <InvitationPreview
                    data={data}
                    isGuest={true}
                    guest={currentGuest}
                />
            </div>
        </div>
    );
};

export default GuestInvitation;
