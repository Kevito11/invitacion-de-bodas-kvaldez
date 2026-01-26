import React, { useState } from 'react';
import {
    Palette, Image, Plus,
    Type, Link as LinkIcon, Grid, RotateCcw,
    Undo, Redo, HelpCircle,
    LayoutTemplate, Monitor, Smartphone
} from 'lucide-react';
import type { InvitationData } from '../../types';
import InvitationPreview from '../InvitationPreview';

interface StepProps {
    data: InvitationData;
    onChange: (field: keyof InvitationData, value: any) => void;
}

const THEMES = [
    { id: 'gold', name: 'Gold Luxury', color: '#D4AF37' },
    { id: 'rose', name: 'Rose Romantic', color: '#E0BFB8' },
    { id: 'sage', name: 'Sage Nature', color: '#9DC183' },
    { id: 'blue', name: 'Royal Blue', color: '#4169E1' },
    { id: 'lavender', name: 'Lavender Dream', color: '#E6E6FA' }
];

const FONTS = [
    { id: 'playfair', name: 'Elegante (Serif)', family: "'Playfair Display', serif" },
    { id: 'montserrat', name: 'Moderno (Sans)', family: "'Montserrat', sans-serif" },
    { id: 'greatvibes', name: 'Romántico (Cursive)', family: "'Great Vibes', cursive" },
    { id: 'cinzel', name: 'Clásico (Cinzel)', family: "'Cinzel', serif" },
    { id: 'dancing', name: 'Amistoso (Script)', family: "'Dancing Script', cursive" },
    { id: 'merriweather', name: 'Legible (Serif)', family: "'Merriweather', serif" }
];

const StepDesign: React.FC<StepProps> = ({ data, onChange }) => {
    const [subTab, setSubTab] = useState<'card' | 'envelope'>('card');
    const [activeToolPanel, setActiveToolPanel] = useState<'none' | 'text' | 'image' | 'theme'>('none');
    const [showGrid, setShowGrid] = useState(false);
    const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('mobile');

    // Mock upload handler re-implemented for the new UI
    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;
        try {
            const newUrls: string[] = [];
            for (const file of files) {
                const p1 = data.partner1.replace(/[^a-zA-Z0-9]/g, '') || 'P1';
                const p2 = data.partner2.replace(/[^a-zA-Z0-9]/g, '') || 'P2';
                const folderName = `${p1}_y_${p2}`;
                const { uploadImage } = await import('../../services/storage');
                const url = await uploadImage(file, folderName);
                newUrls.push(url);
            }
            onChange('mediaLibrary', [...(data.mediaLibrary || []), ...newUrls]);
        } catch (error) {
            alert("Error al subir imagen.");
        }
    };

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', animation: 'fadeIn 0.5s ease-in' }}>

            {/* Sub-Header: Card vs Envelope */}
            <div style={{ backgroundColor: 'white', borderBottom: '1px solid #E5E7EB', padding: '0.8rem 2rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <button style={{ background: 'none', border: 'none', fontWeight: 600, color: '#9CA3AF', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <LayoutTemplate size={16} /> Seleccionar diseño
                </button>
                <div style={{ height: '20px', width: '1px', backgroundColor: '#E5E7EB' }}></div>
                <button
                    onClick={() => setSubTab('card')}
                    style={{ background: 'none', border: 'none', fontWeight: 600, color: subTab === 'card' ? '#34D399' : '#4B5563', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: subTab === 'card' ? '2px solid #34D399' : 'none', paddingBottom: '2px' }}
                >
                    Editar tarjeta
                </button>
                <button
                    onClick={() => setSubTab('envelope')}
                    style={{ background: 'none', border: 'none', fontWeight: 600, color: subTab === 'envelope' ? '#34D399' : '#4B5563', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: subTab === 'envelope' ? '2px solid #34D399' : 'none', paddingBottom: '2px' }}
                >
                    Editar sobre
                </button>
            </div>

            {/* Warning Banner */}
            <div style={{ backgroundColor: '#FEF3C7', color: '#92400E', padding: '0.8rem 2rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <div style={{ backgroundColor: '#FBBF24', padding: '2px 6px', borderRadius: '4px', color: 'white', fontWeight: 'bold' }}>!</div>
                Cualquier cambio que realice actualizará la tarjeta automáticamente para todos los destinatarios.
            </div>

            {/* Canvas Toolbar Controls */}
            <div style={{ padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* View Mode Toggle */}
                <div style={{ display: 'flex', backgroundColor: '#E5E7EB', borderRadius: '8px', padding: '3px' }}>
                    <button
                        onClick={() => setViewMode('desktop')}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '5px',
                            border: 'none',
                            backgroundColor: viewMode === 'desktop' ? 'white' : 'transparent',
                            color: viewMode === 'desktop' ? '#34D399' : '#6B7280',
                            borderRadius: '6px',
                            padding: '0.4rem 0.8rem',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            boxShadow: viewMode === 'desktop' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                        }}
                    >
                        <Monitor size={14} /> Desktop
                    </button>
                    <button
                        onClick={() => setViewMode('mobile')}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '5px',
                            border: 'none',
                            backgroundColor: viewMode === 'mobile' ? 'white' : 'transparent',
                            color: viewMode === 'mobile' ? '#34D399' : '#6B7280',
                            borderRadius: '6px',
                            padding: '0.4rem 0.8rem',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            boxShadow: viewMode === 'mobile' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                        }}
                    >
                        <Smartphone size={14} /> Mobile
                    </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#4B5563' }}>
                        Include a backside
                        <div style={{ width: '40px', height: '20px', backgroundColor: '#34D399', borderRadius: '10px', position: 'relative', cursor: 'pointer' }}>
                            <div style={{ width: '16px', height: '16px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', top: '2px', right: '2px' }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Editor Layout: Sidebar + Canvas + Sidebar */}
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

                {/* Left Action Toolbar */}
                <div style={{ width: '90px', backgroundColor: 'white', borderRight: '1px solid #E5E7EB', padding: '1rem 0.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                    <ToolButton icon={Type} label="Agregar texto" onClick={() => setActiveToolPanel(activeToolPanel === 'text' ? 'none' : 'text')} active={activeToolPanel === 'text'} />
                    <ToolButton icon={Image} label="Agregar imagen" onClick={() => setActiveToolPanel(activeToolPanel === 'image' ? 'none' : 'image')} active={activeToolPanel === 'image'} />
                    <ToolButton icon={LinkIcon} label="Agregar enlace" onClick={() => { }} />
                    <ToolButton icon={Palette} label="Estilos" onClick={() => setActiveToolPanel(activeToolPanel === 'theme' ? 'none' : 'theme')} active={activeToolPanel === 'theme'} />
                    <div style={{ height: '1px', width: '80%', backgroundColor: '#E5E7EB', margin: '0.5rem 0' }}></div>
                    <ToolButton icon={Grid} label="Mostrar cuadrícula" onClick={() => setShowGrid(!showGrid)} active={showGrid} />
                </div>

                {/* Pop-out Panels for Tools (Floats over Canvas) */}
                {activeToolPanel !== 'none' && (
                    <div style={{ width: '300px', backgroundColor: 'white', borderRight: '1px solid #E5E7EB', overflowY: 'auto', padding: '1.5rem', boxShadow: '5px 0 15px rgba(0,0,0,0.05)', zIndex: 10 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ margin: 0, fontSize: '1rem' }}>
                                {activeToolPanel === 'text' && 'Tipografía'}
                                {activeToolPanel === 'image' && 'Imágenes'}
                                {activeToolPanel === 'theme' && 'Temas'}
                            </h3>
                            <button onClick={() => setActiveToolPanel('none')} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>&times;</button>
                        </div>

                        {/* Theme Tool Content */}
                        {activeToolPanel === 'theme' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {THEMES.map(theme => (
                                    <button key={theme.id} onClick={() => onChange('theme', theme.id)} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem', border: data.theme === theme.id ? '1px solid black' : '1px solid #eee', borderRadius: '4px', backgroundColor: 'white', cursor: 'pointer' }}>
                                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: theme.color }}></div>
                                        <span>{theme.name}</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Text Tool Content */}
                        {activeToolPanel === 'text' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {FONTS.map(font => (
                                    <button key={font.id} onClick={() => onChange('font', font.id)} style={{ padding: '0.8rem', border: data.font === font.id ? '1px solid black' : '1px solid #eee', borderRadius: '4px', backgroundColor: 'white', cursor: 'pointer', fontFamily: font.family, fontSize: '1.1rem', textAlign: 'left' }}>
                                        {font.name}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Image Tool Content */}
                        {activeToolPanel === 'image' && (
                            <div>
                                <label style={{ display: 'block', padding: '1rem', border: '2px dashed #ccc', borderRadius: '8px', textAlign: 'center', cursor: 'pointer', marginBottom: '1rem' }}>
                                    <Plus size={24} style={{ display: 'block', margin: '0 auto 0.5rem' }} />
                                    <span>Subir Imagen</span>
                                    <input type="file" onChange={handleUpload} style={{ display: 'none' }} />
                                </label>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                    {(data.mediaLibrary || []).map((img, idx) => (
                                        <div key={idx} style={{ aspectRatio: '1/1', background: `url(${img}) center/cover` }} onClick={() => onChange('imageUrl', img)}></div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Canvas Area */}
                <div style={{ flex: 1, backgroundColor: '#E5E5E5', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>

                    {/* The Card Container - Dynamic Size */}
                    <div style={{
                        width: viewMode === 'mobile' ? '375px' : '90%',
                        height: viewMode === 'mobile' ? '667px' : '90%',
                        maxWidth: viewMode === 'desktop' ? '1200px' : 'none',
                        backgroundColor: 'white',
                        transform: viewMode === 'mobile' ? 'scale(1)' : 'none',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                        border: activeToolPanel !== 'none' ? 'none' : 'none',
                        transition: 'all 0.3s ease',
                        overflow: 'hidden', // Preview component handles scrolling
                        borderRadius: viewMode === 'mobile' ? '0' : '8px'
                    }}>
                        <InvitationPreview data={data} />

                        {/* Grid Overlay */}
                        {showGrid && (
                            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(#ccc 1px, transparent 1px), linear-gradient(90deg, #ccc 1px, transparent 1px)', backgroundSize: '20px 20px', pointerEvents: 'none', zIndex: 10 }}></div>
                        )}
                    </div>

                </div>

                {/* Right Actions Toolbar */}
                <div style={{ width: '80px', backgroundColor: 'white', borderLeft: '1px solid #E5E7EB', padding: '1rem 0.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                    <ToolButton icon={RotateCcw} label="Versiones anteriores" onClick={() => { }} />
                    <ToolButton icon={RotateCcw} label="Reiniciar" onClick={() => { }} />
                    <ToolButton icon={Undo} label="Deshacer" onClick={() => { }} />
                    <ToolButton icon={Redo} label="Rehacer" onClick={() => { }} />
                    <div style={{ marginTop: 'auto' }}>
                        <ToolButton icon={HelpCircle} label="Asesoría" onClick={() => { }} highlight />
                    </div>
                </div>

            </div>
        </div>
    );
};

// Helper Component for Buttons
const ToolButton = ({ icon: Icon, label, onClick, active = false, highlight = false }: any) => (
    <button
        onClick={onClick}
        style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px',
            background: highlight ? '#3B82F6' : (active ? '#F3F4F6' : 'transparent'),
            border: 'none',
            color: highlight ? 'white' : (active ? '#34D399' : '#6B7280'),
            cursor: 'pointer', width: '100%', padding: '0.5rem', borderRadius: '4px'
        }}
    >
        <Icon size={20} />
        <span style={{ fontSize: '0.65rem', textAlign: 'center', lineHeight: '1.2' }}>{label}</span>
    </button>
);

export default StepDesign;
