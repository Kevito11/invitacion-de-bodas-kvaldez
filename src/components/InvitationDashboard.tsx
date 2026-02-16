import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventsContext';
import { useLanguage } from '../context/LanguageContext';
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
    Check,
    ArrowLeft
} from 'lucide-react';
import { useParams } from 'react-router-dom';

const InvitationDashboard: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { t } = useLanguage();
    const [currentStep, setCurrentStep] = useState(0);
    const [isSaved, setIsSaved] = useState(true);
    const [showTagMenu, setShowTagMenu] = useState(false);
    const [showCapacityMenu, setShowCapacityMenu] = useState(false);
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const { fetchEvents, events, updateEvent } = useEvents();

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
        font: 'greatvibes',
        audioUrl: '',
        dressCode: 'Formal',
        dressCodeDetails: '',
        dressCodeInspirationUrl: '',
        mapUrl: '',
        guests: [],
        mediaLibrary: [],
        selectedTag: '' // Initialize
    });

    // Helper to get unique tags from all events for the dropdown
    const uniqueSystemTags = useMemo(() => {
        const tags = new Set<string>();
        // Default tags
        tags.add('Boda');
        tags.add('Cumpleaños');
        tags.add('Baby Shower');
        tags.add('Corporativo');

        // Add tags from existing events
        events.forEach(ev => {
            if (ev.selectedTag) tags.add(ev.selectedTag);
            if (ev.customTags && Array.isArray(ev.customTags)) {
                ev.customTags.forEach(t => tags.add(t));
            }
        });

        // Add current local tags
        if (data.customTags && Array.isArray(data.customTags)) {
            data.customTags.forEach(t => tags.add(t));
        }

        return Array.from(tags).sort();
    }, [events, data.customTags]);


    // Load Data
    useEffect(() => {
        if (user?.username) {
            const allEventsRaw = localStorage.getItem(`events_${user.username}`);
            let allEvents = allEventsRaw ? JSON.parse(allEventsRaw) : [];

            if (allEvents.length === 0) {
                // ... (keep existing legacy loading)
                const oldData = localStorage.getItem(`invitation_${user.username}`);
                if (oldData) {
                    try {
                        const parsedOld = JSON.parse(oldData);
                        parsedOld.id = 'legacy-event-1';
                        allEvents = [parsedOld];
                        localStorage.setItem(`events_${user.username}`, JSON.stringify(allEvents));
                        fetchEvents();
                    } catch (e) { console.error(e); }
                }
            }

            if (id) {
                const found = allEvents.find((e: any) => e.id === id);
                if (found) {
                    setData(prev => {
                        const newData = { ...prev, ...found };
                        // Sync local state if data has tag
                        if (newData.selectedTag) setSelectedTag(newData.selectedTag);
                        return newData;
                    });
                }
            } else {
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
            fetchEvents();
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

    const brandColor = '#34D399';

    const DESIGN_STEPS = [
        { id: 'design', label: t('editor.step.design'), icon: Layout, component: StepDesign },
        { id: 'details', label: t('editor.step.details'), icon: Type, component: StepDetails },
        { id: 'preview', label: t('editor.step.preview'), icon: Eye, component: InvitationPreview },
        { id: 'delivery', label: t('editor.step.delivery'), icon: Send, component: StepGuests },
        { id: 'tracking', label: t('editor.step.tracking'), icon: Users, component: StepSend },
    ];

    const [history, setHistory] = useState<InvitationData[]>([data]);
    const [historyIndex, setHistoryIndex] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (JSON.stringify(history[historyIndex]) !== JSON.stringify(data)) {
                const newHistory = history.slice(0, historyIndex + 1);
                newHistory.push(data);
                if (newHistory.length > 50) newHistory.shift();
                setHistory(newHistory);
                setHistoryIndex(newHistory.length - 1);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [data, history, historyIndex]);

    const undo = () => {
        if (historyIndex > 0) {
            const prevIndex = historyIndex - 1;
            setHistoryIndex(prevIndex);
            setData(history[prevIndex]);
            setIsSaved(false);
        }
    };

    const redo = () => {
        if (historyIndex < history.length - 1) {
            const nextIndex = historyIndex + 1;
            setHistoryIndex(nextIndex);
            setData(history[nextIndex]);
            setIsSaved(false);
        }
    };

    const reset = () => {
        if (window.confirm("¿Seguro que quieres reiniciar? Se borrarán todos los campos.")) {
            const initialData: InvitationData = {
                id: data.id,
                partner1: '',
                partner2: '',
                date: '',
                time: '',
                venueName: '',
                venueAddress: '',
                message: '',
                theme: 'gold',
                imageUrl: '',
                backgroundImageUrl: '',
                backgroundImages: [],
                font: 'greatvibes',
                audioUrl: '',
                dressCode: 'Formal',
                dressCodeDetails: '',
                dressCodeInspirationUrl: '',
                mapUrl: '',
                guests: [],
                mediaLibrary: []
            };
            setData(initialData);
        }
    };

    const ActiveComponent = DESIGN_STEPS[currentStep].component;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#F9FAFB', overflow: 'hidden', fontFamily: "'Montserrat', sans-serif" }}>

            {/* Top Bar (Greenvelope Style) */}
            <div style={{ height: '60px', backgroundColor: 'white', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', position: 'relative', zIndex: 100 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button
                        onClick={() => {
                            saveData(); // Ensure changes are saved before exiting
                            navigate(`/dashboard/event/${data.id}`);
                        }}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.4rem',
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: '#4B5563', padding: '0.5rem', borderRadius: '50%',
                            transition: 'background-color 0.2s',
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        title={t('editor.back_dashboard')}
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', color: brandColor, margin: 0 }}>
                        Boda de {data.partner1} & {data.partner2}
                    </h1>
                    <span style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t('editor.invitation_label')}</span>

                    {/* Tag Dropdown */}
                    <div style={{ position: 'relative' }}>
                        <button
                            onClick={() => { setShowTagMenu(!showTagMenu); setShowCapacityMenu(false); }}
                            style={{ background: 'none', border: 'none', fontSize: '0.75rem', color: selectedTag ? brandColor : '#6B7280', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem', fontWeight: selectedTag ? 600 : 400 }}
                            title={t('event.manage_tags')}
                        >
                            {selectedTag ? `${t('event.tag')}: ${selectedTag}` : t('event.new_tag')}
                        </button>
                        {showTagMenu && (
                            <div style={{
                                position: 'absolute', top: '100%', left: 0, marginTop: '0.5rem',
                                backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                border: '1px solid #E5E7EB', padding: '0.5rem', width: '220px', zIndex: 50
                            }}>
                                <div style={{ fontSize: '0.75rem', color: '#9CA3AF', marginBottom: '0.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid #F3F4F6' }}>{t('event.create_tag_label')}</div>
                                <div style={{ display: 'flex', gap: '0.3rem', marginBottom: '0.5rem' }}>
                                    <input
                                        type="text"
                                        placeholder="Ej: VIP"
                                        id="quickTagInput"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                const val = e.currentTarget.value;
                                                if (val && !data.customTags?.includes(val)) {
                                                    const newTags = [...(data.customTags || []), val];
                                                    const updatedData = { ...data, customTags: newTags, selectedTag: val, location: data.venueName };
                                                    handleDataChange('customTags', newTags);
                                                    handleDataChange('selectedTag', val);
                                                    setSelectedTag(val);
                                                    updateEvent(updatedData as any); // Immediate update
                                                    e.currentTarget.value = '';
                                                }
                                            }
                                        }}
                                        style={{ flex: 1, padding: '0.3rem', fontSize: '0.8rem', border: '1px solid #D1D5DB', borderRadius: '4px' }}
                                    />
                                    <button
                                        onClick={() => {
                                            const input = document.getElementById('quickTagInput') as HTMLInputElement;
                                            if (input && input.value && !data.customTags?.includes(input.value)) {
                                                const newTags = [...(data.customTags || []), input.value];
                                                const updatedData = { ...data, customTags: newTags, selectedTag: input.value, location: data.venueName };
                                                handleDataChange('customTags', newTags);
                                                handleDataChange('selectedTag', input.value);
                                                setSelectedTag(input.value);
                                                updateEvent(updatedData as any); // Immediate update
                                                input.value = '';
                                            }
                                        }}
                                        style={{ padding: '0.3rem', backgroundColor: brandColor, color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                    >
                                        +
                                    </button>
                                </div>
                                <div style={{ fontSize: '0.75rem', color: '#9CA3AF', marginBottom: '0.3rem' }}>{t('event.select_label')}</div>
                                <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                                    {uniqueSystemTags.map(tag => (
                                        <div
                                            key={tag}
                                            onClick={() => {
                                                const newTag = tag === selectedTag ? null : tag;
                                                const updatedData = { ...data, selectedTag: newTag || '', location: data.venueName }; // Handle null assign to string
                                                setSelectedTag(newTag);
                                                handleDataChange('selectedTag', newTag);
                                                updateEvent(updatedData as any);
                                                setShowTagMenu(false);
                                            }}
                                            style={{
                                                fontSize: '0.8rem', padding: '0.3rem 0.5rem',
                                                color: tag === selectedTag ? brandColor : '#4B5563',
                                                cursor: 'pointer', borderRadius: '4px',
                                                backgroundColor: tag === selectedTag ? '#ECFDF5' : 'transparent',
                                                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                            }}
                                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = tag === selectedTag ? '#ECFDF5' : '#F3F4F6'}
                                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = tag === selectedTag ? '#ECFDF5' : 'transparent'}
                                        >
                                            {tag}
                                            {tag === selectedTag && <Check size={12} />}
                                        </div>
                                    ))}
                                    {uniqueSystemTags.length === 0 && (
                                        <div style={{ fontSize: '0.75rem', color: '#9CA3AF', fontStyle: 'italic', padding: '0.2rem' }}>{t('event.no_tags')}</div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Capacity Dropdown */}
                    <div style={{ position: 'relative' }}>
                        <button
                            onClick={() => { setShowCapacityMenu(!showCapacityMenu); setShowTagMenu(false); }}
                            style={{ border: '1px solid #E5E7EB', borderRadius: '4px', padding: '0.1rem 0.5rem', fontSize: '0.75rem', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '5px', background: 'white', cursor: 'pointer' }}
                            title="Ajustar Capacidad"
                        >
                            Plan: {data.maxCapacity || 50} {t('event.people')} <span style={{ color: brandColor }}>+</span>
                        </button>
                        {showCapacityMenu && (
                            <div style={{
                                position: 'absolute', top: '100%', left: 0, marginTop: '0.5rem',
                                backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                border: '1px solid #E5E7EB', padding: '0.5rem', width: '120px', zIndex: 50
                            }}>
                                {[50, 80, 100, 120, 140, 150, 180, 200, 250, 300].map(cap => (
                                    <button
                                        key={cap}
                                        onClick={() => {
                                            handleDataChange('maxCapacity', cap);
                                            setShowCapacityMenu(false);
                                        }}
                                        style={{
                                            display: 'block', width: '100%', textAlign: 'left', padding: '0.4rem',
                                            fontSize: '0.8rem', color: '#374151', background: 'none', border: 'none', cursor: 'pointer',
                                            backgroundColor: data.maxCapacity === cap ? '#F3F4F6' : 'transparent',
                                            borderRadius: '4px'
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = data.maxCapacity === cap ? '#F3F4F6' : 'transparent'}
                                    >
                                        {cap} pax
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ fontSize: '0.75rem', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Check size={12} /> {isSaved ? t('editor.saved') : t('editor.saving')}
                    </div>
                    <button
                        onClick={() => {
                            if (currentStep < DESIGN_STEPS.length - 1) setCurrentStep(currentStep + 1);
                            else navigate(`/dashboard/event/${data.id}`);
                        }}
                        style={{ backgroundColor: brandColor, color: 'white', border: 'none', padding: '0.6rem 2rem', borderRadius: '4px', fontWeight: 700, letterSpacing: '0.5px', cursor: 'pointer', fontSize: '0.8rem' }}
                    >
                        {t('editor.next')} &gt;
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
                {currentStep === 2 ? (
                    <div style={{ height: '100%', overflowY: 'auto', padding: '0', backgroundColor: '#333' }}>
                        <div style={{ width: '100%', height: '100%', margin: '0 auto', backgroundColor: 'white', overflow: 'hidden' }}>
                            <InvitationPreview data={data} isGuest={true} />
                        </div>
                    </div>
                ) : (
                    <ActiveComponent
                        data={data}
                        onChange={handleDataChange}
                        onUndo={undo}
                        onRedo={redo}
                        onReset={reset}
                    />
                )}
            </div>

        </div>
    );
};

export default InvitationDashboard;
