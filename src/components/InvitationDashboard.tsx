import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { InvitationData } from '../types';
import InvitationPreview from './InvitationPreview';

// Steps
import StepDesign from './steps/StepDesign';
import StepDetails from './steps/StepDetails';
import StepGuests from './steps/StepGuests';
import StepSend from './steps/StepSend';

import {
    Layout,
    Type,
    Users,
    Send,
    Eye,
    Check
} from 'lucide-react';
import { useParams } from 'react-router-dom';



const InvitationDashboard: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [currentStep, setCurrentStep] = useState(0);
    const [isSaved, setIsSaved] = useState(true);

    const [data, setData] = useState<InvitationData>({
        partner1: 'María',
        partner2: 'José',
        date: new Date().toISOString().split('T')[0],
        time: '18:00',
        venueName: 'Jardín de las Rosas',
        venueAddress: 'Av. Principal #456, Ciudad',
        message: 'Nos hace muy felices invitarlos a compartir nuestra alegría.',
        theme: 'gold',
        imageUrl: '',
        backgroundImageUrl: '',
        backgroundImages: [],
        font: 'playfair',
        audioUrl: '',
        dressCode: 'Formal',
        dressCodeDetails: '',
        dressCodeInspirationUrl: '',
        mapUrl: '',
        guests: [],
        mediaLibrary: []
    });

    // Load Data
    useEffect(() => {
        if (user?.username) {
            const allEventsRaw = localStorage.getItem(`events_${user.username}`);
            let allEvents = allEventsRaw ? JSON.parse(allEventsRaw) : [];

            // Migration check: If no events array but old single key exists
            if (allEvents.length === 0) {
                const oldData = localStorage.getItem(`invitation_${user.username}`);
                if (oldData) {
                    try {
                        const parsedOld = JSON.parse(oldData);
                        parsedOld.id = 'legacy-event-1';
                        allEvents = [parsedOld];
                        localStorage.setItem(`events_${user.username}`, JSON.stringify(allEvents));
                    } catch (e) { console.error(e); }
                }
            }

            if (id) {
                // Edit Mode: Find event
                const found = allEvents.find((e: any) => e.id === id);
                if (found) {
                    setData(prev => ({ ...prev, ...found }));
                }
            } else {
                // Create Mode: New ID
                const newId = crypto.randomUUID();
                setData(prev => ({ ...prev, id: newId }));
            }
        }
    }, [user?.username, id]);

    // Save Data
    const saveData = () => {
        if (user?.username && data.id) {
            const allEventsRaw = localStorage.getItem(`events_${user.username}`);
            const allEvents = allEventsRaw ? JSON.parse(allEventsRaw) : [];

            const index = allEvents.findIndex((e: any) => e.id === data.id);

            if (index >= 0) {
                allEvents[index] = data;
            } else {
                allEvents.push(data);
            }

            localStorage.setItem(`events_${user.username}`, JSON.stringify(allEvents));
            setIsSaved(true);
        }
    };

    // Auto-save debounced
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!isSaved) saveData();
        }, 2000);
        return () => clearTimeout(timer);
    }, [data, isSaved]);

    const handleDataChange = (field: keyof InvitationData, value: any) => {
        setData(prev => ({ ...prev, [field]: value }));
        setIsSaved(false);
    };

    const brandColor = '#34D399'; // Matching the green from EventDetails

    // Update steps to match the new design tabs
    const DESIGN_STEPS = [
        { id: 'design', label: 'DISEÑO', icon: Layout, component: StepDesign },
        { id: 'details', label: 'DETALLES', icon: Type, component: StepDetails },
        { id: 'preview', label: 'PREVISUALIZACIÓN', icon: Eye, component: InvitationPreview }, // Wrapping Preview as a step
        { id: 'delivery', label: 'ENTREGA', icon: Send, component: StepGuests }, // Mapping Guests to Delivery for now
        { id: 'tracking', label: 'SEGUIMIENTO', icon: Users, component: StepSend }, // Mapping Send to Tracking (placeholder)
    ];

    const ActiveComponent = DESIGN_STEPS[currentStep].component;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#F9FAFB', overflow: 'hidden', fontFamily: "'Montserrat', sans-serif" }}>

            {/* Top Bar (Greenvelope Style) */}
            <div style={{ height: '60px', backgroundColor: 'white', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', color: brandColor, margin: 0 }}>
                        Boda de {data.partner1} & {data.partner2}
                    </h1>
                    <span style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Invitación</span>
                    <span style={{ fontSize: '0.75rem', color: '#6B7280', cursor: 'pointer' }}>+ Etiqueta</span>
                    <div style={{ border: '1px solid #E5E7EB', borderRadius: '4px', padding: '0.1rem 0.5rem', fontSize: '0.75rem', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        140 personas <span style={{ color: brandColor }}>+</span>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ fontSize: '0.75rem', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Check size={12} /> Se guardaron todos los cambios
                    </div>
                    <button
                        onClick={() => {
                            if (currentStep < DESIGN_STEPS.length - 1) setCurrentStep(currentStep + 1);
                            else navigate(`/dashboard/event/${data.id}`);
                        }}
                        style={{ backgroundColor: brandColor, color: 'white', border: 'none', padding: '0.6rem 2rem', borderRadius: '4px', fontWeight: 700, letterSpacing: '0.5px', cursor: 'pointer', fontSize: '0.8rem' }}
                    >
                        SIGUIENTE &gt;
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div style={{ backgroundColor: 'white', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'center', gap: '3rem', padding: '0 1rem' }}>
                {DESIGN_STEPS.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = index === currentStep;
                    return (
                        <button
                            key={step.id}
                            onClick={() => setCurrentStep(index)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                padding: '1rem 0.5rem', border: 'none', background: 'none',
                                borderBottom: isActive ? `2px solid ${brandColor}` : '2px solid transparent',
                                color: isActive ? brandColor : '#9CA3AF',
                                fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', letterSpacing: '1px', textTransform: 'uppercase'
                            }}
                        >
                            <Icon size={16} />
                            {step.label}
                        </button>
                    );
                })}
            </div>

            {/* Main Content Area */}
            <div style={{ flex: 1, overflow: 'hidden', backgroundColor: '#F3F4F6' }}>
                {currentStep === 2 ? ( // Preview Step needs special handling to be full height without padding if needed, or structured same
                    <div style={{ height: '100%', overflowY: 'auto', padding: '2rem' }}>
                        <div style={{ maxWidth: '1000px', margin: '0 auto', backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                            <InvitationPreview data={data} />
                        </div>
                    </div>
                ) : (
                    <ActiveComponent data={data} onChange={handleDataChange} />
                )}
            </div>

        </div>
    );
};

export default InvitationDashboard;
