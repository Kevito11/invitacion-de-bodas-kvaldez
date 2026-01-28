import React, { useState } from 'react';
import {
    Palette, Image, Plus,
    Type, Undo, Redo, HelpCircle,
    LayoutTemplate, Monitor, Smartphone, RotateCcw,
    Mail, Star, Check, Sparkles
} from 'lucide-react';
import type { InvitationData } from '../../types';
import { DESIGN_PRESETS } from '../../data/presets';
import InvitationPreview from '../InvitationPreview';
import MobileMockup from '../UI/MobileMockup';


interface StepProps {
    data: InvitationData;
    onChange: (field: keyof InvitationData, value: any) => void;
    onUndo?: () => void;
    onRedo?: () => void;
    onReset?: () => void;
}

const THEMES = [
    { id: 'gold', name: 'Gold Luxury', color: '#D4AF37' },
    { id: 'rose', name: 'Rose Romantic', color: '#E0BFB8' },
    { id: 'sage', name: 'Sage Nature', color: '#9DC183' },
    { id: 'blue', name: 'Royal Blue', color: '#4169E1' },
    { id: 'lavender', name: 'Lavender Dream', color: '#E6E6FA' }
];

const FONTS = [
    { id: 'greatvibes', name: 'Romántico (Great Vibes)', family: "'Great Vibes', cursive" },
    { id: 'dancing', name: 'Amistoso (Dancing Script)', family: "'Dancing Script', cursive" },
    { id: 'alexbrush', name: 'Elegante (Alex Brush)', family: "'Alex Brush', cursive" },
    { id: 'parisienne', name: 'Clásico (Parisienne)', family: "'Parisienne', cursive" },
    { id: 'allura', name: 'Fluido (Allura)', family: "'Allura', cursive" },
    { id: 'pinyon', name: 'Regal (Pinyon Script)', family: "'Pinyon Script', cursive" },
    { id: 'petitformal', name: 'Fino (Petit Formal)', family: "'Petit Formal Script', cursive" }
];

const ENVELOPE_TYPES = [
    { id: 'classic', name: 'Clásico' },
    { id: 'pointed', name: 'Puntiagudo' },
    { id: 'square', name: 'Cuadrado' },
    { id: 'rounded', name: 'Redondeado' },
];

const ENVELOPE_MATERIALS = [
    { id: 'paper', name: 'Papel Mate' },
    { id: 'linen', name: 'Lino (Textura)' },
    { id: 'velvet', name: 'Terciopelo' },
    { id: 'cardstock', name: 'Cartulina' },
];

const ENVELOPE_FINISHES = [
    { id: 'matte', name: 'Mate' },
    { id: 'glossy', name: 'Brillante' },
    { id: 'metallic', name: 'Metálico' },
];

const StepDesign: React.FC<StepProps> = ({ data, onChange, onUndo, onRedo, onReset }) => {
    const [subTab, setSubTab] = useState<'card' | 'envelope'>('card');
    const [activeToolPanel, setActiveToolPanel] = useState<'none' | 'text' | 'image' | 'theme' | 'layout' | 'env-type' | 'env-material' | 'env-color' | 'env-finish' | 'presets'>('none');
    const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('mobile');
    const [showTutorial, setShowTutorial] = useState(false);

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

    // Helper for updating envelope data
    const updateEnvelope = (key: string, value: any) => {
        const currentEnvelope = data.envelope || { enabled: true, type: 'classic', material: 'paper', color: '#f5f5f5', finish: 'matte' };
        onChange('envelope', { ...currentEnvelope, [key]: value, enabled: true });
    };

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', animation: 'fadeIn 0.5s ease-in', position: 'relative' }}>
            {showTutorial && (
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100,
                    display: 'flex', justifyContent: 'center', alignItems: 'center'
                }}>
                    <div style={{
                        backgroundColor: 'white', padding: '2rem', borderRadius: '8px',
                        maxWidth: '500px', width: '90%', boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                    }}>
                        <h3 style={{ marginTop: 0, color: '#059669', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <HelpCircle size={20} /> Guía Rápida de Diseño
                        </h3>
                        <p style={{ color: '#666', lineHeight: '1.5' }}>Sigue estos pasos para crear tu invitación perfecta:</p>
                        <ol style={{ paddingLeft: '1.2rem', color: '#444', lineHeight: '1.6' }}>
                            <li><strong>Detalles Básicos:</strong> Usa la barra izquierda "Agregar texto" para editar nombres, fecha y lugar.</li>
                            <li><strong>Imágenes:</strong> Sube fotos de la pareja desde "Agregar imagen" para la portada.</li>
                            <li><strong>Estilo:</strong> Selecciona "Estilos" para probar diferentes paletas de colores y fuentes.</li>
                            <li><strong>Sobre:</strong> Cambia a la pestaña "Editar sobre" para personalizar el empaque virtual.</li>
                            <li><strong>Vista Previa:</strong> Alterna entre vista Módvil y Desktop en la barra superior para asegurar que se vea bien en todos los dispositivos.</li>
                        </ol>
                        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => setShowTutorial(false)}
                                style={{
                                    backgroundColor: '#059669', color: 'white', border: 'none',
                                    padding: '0.6rem 1.2rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 600
                                }}
                            >
                                Entendido
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Sub-Header: Card vs Envelope */}
            <div style={{ backgroundColor: 'white', borderBottom: '1px solid #E5E7EB', padding: '0.8rem 2rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>

                <button
                    onClick={() => { setSubTab('card'); setActiveToolPanel('none'); }}
                    style={{ background: 'none', border: 'none', fontWeight: 600, color: subTab === 'card' ? '#34D399' : '#4B5563', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: subTab === 'card' ? '2px solid #34D399' : 'none', paddingBottom: '2px' }}
                >
                    Editar tarjeta
                </button>
                <button
                    onClick={() => { setSubTab('envelope'); setActiveToolPanel('none'); }}
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
                    {subTab === 'card' ? (
                        <>
                            <ToolButton icon={Sparkles} label="Plantillas" onClick={() => setActiveToolPanel(activeToolPanel === 'presets' ? 'none' : 'presets')} active={activeToolPanel === 'presets'} />
                            <ToolButton icon={LayoutTemplate} label="Estructura" onClick={() => setActiveToolPanel(activeToolPanel === 'layout' ? 'none' : 'layout')} active={activeToolPanel === 'layout'} />
                            <ToolButton icon={Type} label="Agregar texto" onClick={() => setActiveToolPanel(activeToolPanel === 'text' ? 'none' : 'text')} active={activeToolPanel === 'text'} />
                            <ToolButton icon={Image} label="Agregar imagen" onClick={() => setActiveToolPanel(activeToolPanel === 'image' ? 'none' : 'image')} active={activeToolPanel === 'image'} />
                            <ToolButton icon={Palette} label="Estilos" onClick={() => setActiveToolPanel(activeToolPanel === 'theme' ? 'none' : 'theme')} active={activeToolPanel === 'theme'} />
                        </>
                    ) : (
                        <>
                            <ToolButton icon={Mail} label="Forma" onClick={() => setActiveToolPanel(activeToolPanel === 'env-type' ? 'none' : 'env-type')} active={activeToolPanel === 'env-type'} />
                            <ToolButton icon={LayoutTemplate} label="Material" onClick={() => setActiveToolPanel(activeToolPanel === 'env-material' ? 'none' : 'env-material')} active={activeToolPanel === 'env-material'} />
                            <ToolButton icon={Palette} label="Color" onClick={() => setActiveToolPanel(activeToolPanel === 'env-color' ? 'none' : 'env-color')} active={activeToolPanel === 'env-color'} />
                            <ToolButton icon={Star} label="Acabado" onClick={() => setActiveToolPanel(activeToolPanel === 'env-finish' ? 'none' : 'env-finish')} active={activeToolPanel === 'env-finish'} />
                        </>
                    )}
                </div>

                {/* Pop-out Panels for Tools (Floats over Canvas) */}
                {activeToolPanel !== 'none' && (
                    <div style={{ width: '300px', backgroundColor: 'white', borderRight: '1px solid #E5E7EB', overflowY: 'auto', padding: '1.5rem', boxShadow: '5px 0 15px rgba(0,0,0,0.05)', zIndex: 10 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ margin: 0, fontSize: '1rem' }}>
                                {activeToolPanel === 'text' && 'Tipografía'}
                                {activeToolPanel === 'image' && 'Imágenes'}
                                {activeToolPanel === 'presets' && 'Plantillas de Diseño'}
                                {activeToolPanel === 'theme' && 'Temas'}
                                {activeToolPanel === 'layout' && 'Estructura Visual'}
                                {activeToolPanel === 'env-type' && 'Forma del Sobre'}
                                {activeToolPanel === 'env-material' && 'Material y Textura'}
                                {activeToolPanel === 'env-color' && 'Color del Sobre'}
                                {activeToolPanel === 'env-finish' && 'Acabado Final'}
                            </h3>
                            <button onClick={() => setActiveToolPanel('none')} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>&times;</button>
                        </div>

                        {/* PRESETS PANEL */}
                        {activeToolPanel === 'presets' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                <p style={{ fontSize: '0.85rem', color: '#666', marginTop: 0 }}>Elige un diseño base para comenzar.</p>
                                {DESIGN_PRESETS.map(preset => (
                                    <button
                                        key={preset.id}
                                        onClick={() => {
                                            Object.entries(preset.settings).forEach(([key, value]) => {
                                                onChange(key as keyof InvitationData, value);
                                            });
                                        }}
                                        style={{
                                            padding: '1rem',
                                            border: '1px solid #eee',
                                            borderRadius: '8px',
                                            backgroundColor: 'white',
                                            cursor: 'pointer',
                                            textAlign: 'left',
                                            transition: 'transform 0.2s, box-shadow 0.2s',
                                            boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                                        }}
                                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.05)'; }}
                                    >
                                        <div style={{ fontWeight: 'bold', color: '#333', marginBottom: '0.3rem' }}>{preset.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#666' }}>{preset.description}</div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* ENVELOPE TOOLS */}
                        {activeToolPanel === 'env-type' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {ENVELOPE_TYPES.map(type => (
                                    <button
                                        key={type.id}
                                        onClick={() => updateEnvelope('type', type.id)}
                                        style={{
                                            padding: '1rem',
                                            border: data.envelope?.type === type.id ? '2px solid #34D399' : '1px solid #eee',
                                            borderRadius: '8px',
                                            backgroundColor: data.envelope?.type === type.id ? '#F0FDF4' : 'white',
                                            cursor: 'pointer',
                                            textAlign: 'left',
                                            fontWeight: 500
                                        }}
                                    >
                                        {type.name}
                                    </button>
                                ))}
                            </div>
                        )}

                        {activeToolPanel === 'env-material' && (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                                {ENVELOPE_MATERIALS.map(mat => (
                                    <button
                                        key={mat.id}
                                        onClick={() => updateEnvelope('material', mat.id)}
                                        style={{
                                            padding: '1rem',
                                            border: data.envelope?.material === mat.id ? '2px solid #34D399' : '1px solid #eee',
                                            borderRadius: '8px',
                                            backgroundColor: 'white',
                                            cursor: 'pointer',
                                            textAlign: 'center',
                                            fontSize: '0.8rem'
                                        }}
                                    >
                                        <div style={{ width: '40px', height: '40px', background: '#ccc', margin: '0 auto 0.5rem', borderRadius: '50%' }}></div>
                                        {mat.name}
                                    </button>
                                ))}
                            </div>
                        )}

                        {activeToolPanel === 'env-color' && (
                            <div>
                                <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>Paleta Sugerida</p>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.8rem', marginBottom: '1.5rem' }}>
                                    {['#F5E6D3', '#FFFFFF', '#2D2A26', '#E0BFB8', '#9DC183', '#5D4037', '#1A1A1A', '#E6E6FA'].map(color => (
                                        <button
                                            key={color}
                                            onClick={() => updateEnvelope('color', color)}
                                            style={{
                                                width: '100%',
                                                aspectRatio: '1/1',
                                                borderRadius: '50%',
                                                backgroundColor: color,
                                                border: data.envelope?.color === color ? '2px solid #34D399' : '1px solid #ddd',
                                                cursor: 'pointer',
                                                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                                            }}
                                        />
                                    ))}
                                </div>
                                <label style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    Color Personalizado
                                    <input
                                        type="color"
                                        value={data.envelope?.color || '#F5E6D3'}
                                        onChange={(e) => updateEnvelope('color', e.target.value)}
                                        style={{ border: 'none', background: 'none', width: '30px', height: '30px', padding: 0, cursor: 'pointer' }}
                                    />
                                </label>
                            </div>
                        )}

                        {activeToolPanel === 'env-finish' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {ENVELOPE_FINISHES.map(fin => (
                                    <button
                                        key={fin.id}
                                        onClick={() => updateEnvelope('finish', fin.id)}
                                        style={{
                                            padding: '1rem',
                                            border: data.envelope?.finish === fin.id ? '2px solid #34D399' : '1px solid #eee',
                                            borderRadius: '8px',
                                            backgroundColor: data.envelope?.finish === fin.id ? '#F0FDF4' : 'white',
                                            cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                                        }}
                                    >
                                        <span>{fin.name}</span>
                                        {data.envelope?.finish === fin.id && <Check size={16} color="#34D399" />}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Layout Tool Content */}
                        {activeToolPanel === 'layout' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <p style={{ fontSize: '0.85rem', color: '#666', marginTop: 0 }}>Elige cómo interactuarán tus invitados con la invitación.</p>

                                <button
                                    onClick={() => onChange('layout', 'scroll')}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem',
                                        border: (data.layout || 'scroll') === 'scroll' ? '2px solid #34D399' : '1px solid #eee',
                                        borderRadius: '8px', backgroundColor: 'white', cursor: 'pointer', textAlign: 'left',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <div style={{ padding: '0.5rem', background: '#F0FDF4', borderRadius: '50%', color: '#34D399' }}><Monitor size={20} /></div>
                                    <div>
                                        <div style={{ fontWeight: 600, marginBottom: '0.2rem' }}>Scroll Vertical</div>
                                        <div style={{ fontSize: '0.75rem', color: '#666' }}>Desliza hacia abajo. Moderno y fluido. (Recomendado)</div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => onChange('layout', 'slider')}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem',
                                        border: data.layout === 'slider' ? '2px solid #34D399' : '1px solid #eee',
                                        borderRadius: '8px', backgroundColor: 'white', cursor: 'pointer', textAlign: 'left',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <div style={{ padding: '0.5rem', background: '#F0FDF4', borderRadius: '50%', color: '#34D399' }}><Smartphone size={20} style={{ transform: 'rotate(90deg)' }} /></div>
                                    <div>
                                        <div style={{ fontWeight: 600, marginBottom: '0.2rem' }}>Slider / Historias</div>
                                        <div style={{ fontSize: '0.75rem', color: '#666' }}>Desliza hacia los lados. Ideal para móviles.</div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => onChange('layout', 'classic')}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem',
                                        border: data.layout === 'classic' ? '2px solid #34D399' : '1px solid #eee',
                                        borderRadius: '8px', backgroundColor: 'white', cursor: 'pointer', textAlign: 'left',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <div style={{ padding: '0.5rem', background: '#F0FDF4', borderRadius: '50%', color: '#34D399' }}><LayoutTemplate size={20} /></div>
                                    <div>
                                        <div style={{ fontWeight: 600, marginBottom: '0.2rem' }}>Clásico (Tarjeta)</div>
                                        <div style={{ fontSize: '0.75rem', color: '#666' }}>Formato continuo sin cortes. Elegante y tradicional.</div>
                                    </div>
                                </button>
                            </div>
                        )}

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
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                {/* Event Details Inputs */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                    <h4 style={{ margin: '0 0 0.5rem', color: '#444', fontSize: '0.9rem' }}>Detalles del Evento</h4>

                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ fontSize: '0.75rem', color: '#666', display: 'block', marginBottom: '0.3rem' }}>Nombre 1</label>
                                            <input
                                                type="text"
                                                value={data.partner1}
                                                onChange={(e) => onChange('partner1', e.target.value)}
                                                style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                            />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ fontSize: '0.75rem', color: '#666', display: 'block', marginBottom: '0.3rem' }}>Nombre 2</label>
                                            <input
                                                type="text"
                                                value={data.partner2}
                                                onChange={(e) => onChange('partner2', e.target.value)}
                                                style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                            />
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ fontSize: '0.75rem', color: '#666', display: 'block', marginBottom: '0.3rem' }}>Fecha</label>
                                            <input
                                                type="date"
                                                value={data.date}
                                                onChange={(e) => onChange('date', e.target.value)}
                                                style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                            />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ fontSize: '0.75rem', color: '#666', display: 'block', marginBottom: '0.3rem' }}>Hora</label>
                                            <input
                                                type="time"
                                                value={data.time}
                                                onChange={(e) => onChange('time', e.target.value)}
                                                style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label style={{ fontSize: '0.75rem', color: '#666', display: 'block', marginBottom: '0.3rem' }}>Lugar</label>
                                        <input
                                            type="text"
                                            value={data.venueName}
                                            onChange={(e) => onChange('venueName', e.target.value)}
                                            placeholder="Nombre del lugar"
                                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '0.5rem' }}
                                        />
                                        <input
                                            type="text"
                                            value={data.venueAddress}
                                            onChange={(e) => onChange('venueAddress', e.target.value)}
                                            placeholder="Dirección"
                                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                        />
                                    </div>

                                    <div>
                                        <label style={{ fontSize: '0.75rem', color: '#666', display: 'block', marginBottom: '0.3rem' }}>Mensaje</label>
                                        <textarea
                                            value={data.message}
                                            onChange={(e) => onChange('message', e.target.value)}
                                            rows={3}
                                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', resize: 'vertical', fontFamily: 'inherit' }}
                                        />
                                    </div>
                                </div>

                                <div style={{ height: '1px', backgroundColor: '#eee' }}></div>

                                {/* Font Selection */}
                                <div>
                                    <h4 style={{ margin: '0 0 0.5rem', color: '#444', fontSize: '0.9rem' }}>Tipografía</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        {FONTS.map(font => (
                                            <button key={font.id} onClick={() => onChange('font', font.id)} style={{ padding: '0.8rem', border: data.font === font.id ? '1px solid black' : '1px solid #eee', borderRadius: '4px', backgroundColor: 'white', cursor: 'pointer', fontFamily: font.family, fontSize: '1.1rem', textAlign: 'left' }}>
                                                {font.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Image Tool Content */}
                        {activeToolPanel === 'image' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {/* Upload Button */}
                                <div>
                                    <label style={{ display: 'block', padding: '1rem', border: '2px dashed #ccc', borderRadius: '8px', textAlign: 'center', cursor: 'pointer', backgroundColor: '#fafafa', color: '#666' }}>
                                        <Plus size={24} style={{ display: 'block', margin: '0 auto 0.5rem', color: '#34D399' }} />
                                        <span style={{ fontWeight: 500 }}>Subir Nueva Imagen</span>
                                        <input type="file" onChange={handleUpload} style={{ display: 'none' }} />
                                    </label>
                                </div>

                                {/* Library Selection */}
                                <div>
                                    <h4 style={{ fontSize: '0.9rem', margin: '0 0 0.5rem 0', color: '#444' }}>Biblioteca de Medios</h4>
                                    {(!data.mediaLibrary || data.mediaLibrary.length === 0) ? (
                                        <p style={{ fontSize: '0.8rem', color: '#999', fontStyle: 'italic' }}>No hay imágenes subidas aún.</p>
                                    ) : (
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', maxHeight: '150px', overflowY: 'auto' }}>
                                            {data.mediaLibrary.map((img, idx) => (
                                                <div
                                                    key={idx}
                                                    draggable
                                                    onDragStart={(e) => e.dataTransfer.setData('text/plain', img)}
                                                    style={{
                                                        aspectRatio: '1/1',
                                                        backgroundImage: `url(${img})`,
                                                        backgroundSize: 'cover',
                                                        backgroundPosition: 'center',
                                                        borderRadius: '4px',
                                                        cursor: 'grab',
                                                        border: '1px solid #eee'
                                                    }}
                                                    title="Arraustra para usar"
                                                    onClick={() => {
                                                        // Fallback for click: Set as cover by default or ask user?
                                                        // For simplicity: If user clicks, set as Cover. Drag needed for specific slots?
                                                        // Better: Just show it's available.
                                                        if (confirm('¿Usar como foto de portada?')) {
                                                            onChange('imageUrl', img);
                                                        }
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    )}
                                    <p style={{ fontSize: '0.7rem', color: '#666', marginTop: '0.3rem' }}>* Haz clic para portada o asigna abajo.</p>
                                </div>

                                <div style={{ height: '1px', backgroundColor: '#eee' }}></div>

                                {/* Assignments */}
                                <div>
                                    <h4 style={{ fontSize: '0.9rem', margin: '0 0 0.8rem 0', color: '#444' }}>Asignación de Imágenes</h4>

                                    {/* 1. Cover Photo */}
                                    <div style={{ marginBottom: '1rem' }}>
                                        <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>Foto de Portada</label>
                                        <div style={{
                                            border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', height: '100px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            backgroundColor: '#f9f9f9', position: 'relative'
                                        }}>
                                            {data.imageUrl ? (
                                                <div style={{ width: '100%', height: '100%', background: `url(${data.imageUrl}) center/contain no-repeat` }}>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); onChange('imageUrl', ''); }}
                                                        style={{ position: 'absolute', top: 5, right: 5, background: 'rgba(0,0,0,0.5)', color: 'white', borderRadius: '50%', width: 24, height: 24, border: 'none', cursor: 'pointer' }}
                                                    >
                                                        &times;
                                                    </button>
                                                </div>
                                            ) : (
                                                <span style={{ fontSize: '0.7rem', color: '#999' }}>Sin portada</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* 2. Backgrounds based on Layout */}
                                    {data.layout === 'classic' ? (
                                        // Classic Layout: Single Background
                                        <div>
                                            <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>Fondo de Carta (Textura)</label>
                                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                                <div style={{
                                                    flex: 1, height: '60px', borderRadius: '8px', border: '1px solid #ddd',
                                                    background: data.backgroundImageUrl ? `url(${data.backgroundImageUrl}) center/cover` : '#FAF7F2',
                                                    position: 'relative'
                                                }}>
                                                    {data.backgroundImageUrl && (
                                                        <button
                                                            onClick={() => onChange('backgroundImageUrl', '')}
                                                            style={{ position: 'absolute', top: -5, right: -5, background: 'red', color: 'white', borderRadius: '50%', width: 20, height: 20, border: 'none', cursor: 'pointer', fontSize: '10px' }}
                                                        >
                                                            X
                                                        </button>
                                                    )}
                                                </div>
                                                <select
                                                    style={{ flex: 2, padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
                                                    onChange={(e) => {
                                                        if (e.target.value === 'upload') {
                                                            alert('Sube una imagen a la biblioteca y selecciónala.');
                                                        } else {
                                                            onChange('backgroundImageUrl', e.target.value);
                                                        }
                                                    }}
                                                    value={data.backgroundImageUrl || ''}
                                                >
                                                    <option value="">Original (Papel)</option>
                                                    {data.mediaLibrary?.map((url, i) => (
                                                        <option key={i} value={url}>Imagen {i + 1}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    ) : (
                                        // Scroll/Slider Layout: 4 Sections
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                            <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block' }}>Fondos por Sección</label>
                                            {['Portada', 'Detalles', 'Vestimenta', 'Galería'].map((label, idx) => (
                                                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <div style={{ width: '20px', fontSize: '0.7rem', color: '#999' }}>{idx + 1}</div>
                                                    <div style={{
                                                        width: '40px', height: '40px', borderRadius: '4px', border: '1px solid #eee',
                                                        background: (data.backgroundImages && data.backgroundImages[idx]) ? `url(${data.backgroundImages[idx]}) center/cover` : '#f0f0f0'
                                                    }}></div>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>{label}</div>
                                                        <select
                                                            style={{ width: '100%', fontSize: '0.7rem', padding: '0.2rem', marginTop: '0.1rem', border: '1px solid #ddd', borderRadius: '4px' }}
                                                            value={(data.backgroundImages && data.backgroundImages[idx]) || ''}
                                                            onChange={(e) => {
                                                                const newBgs = [...(data.backgroundImages || [])];
                                                                while (newBgs.length <= idx) newBgs.push('');
                                                                newBgs[idx] = e.target.value;
                                                                onChange('backgroundImages', newBgs);
                                                            }}
                                                        >
                                                            <option value="">Por defecto</option>
                                                            {data.mediaLibrary?.map((url, i) => (
                                                                <option key={i} value={url}>Img {i + 1}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Canvas Area */}
                <div style={{ flex: 1, backgroundColor: '#E5E5E5', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', padding: viewMode === 'mobile' ? '2rem' : '0' }}>

                    {/* The Card Container - Dynamic Size */}
                    {viewMode === 'mobile' ? (
                        <MobileMockup scale={0.85}>
                            <InvitationPreview data={data} forceShowEnvelope={subTab === 'envelope'} isMobilePreview={true} />
                        </MobileMockup>
                    ) : (
                        <div style={{
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'white',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                            overflow: 'hidden', // Preview component handles scrolling
                            borderRadius: '0'
                        }}>
                            <InvitationPreview data={data} forceShowEnvelope={subTab === 'envelope'} />
                        </div>
                    )}

                </div>

                {/* Right Actions Toolbar */}
                <div style={{ width: '80px', backgroundColor: 'white', borderLeft: '1px solid #E5E7EB', padding: '1rem 0.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                    <ToolButton icon={RotateCcw} label="Reiniciar" onClick={onReset} />
                    <ToolButton icon={Undo} label="Deshacer" onClick={onUndo} />
                    <ToolButton icon={Redo} label="Rehacer" onClick={onRedo} />
                    <div style={{ marginTop: 'auto' }}>
                        <ToolButton icon={HelpCircle} label="Asesoría" onClick={() => setShowTutorial(true)} highlight />
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
