import React, { useState, useMemo } from 'react';
import {
    Palette, Image,
    Type, Undo, Redo, HelpCircle,
    LayoutTemplate, Monitor, Smartphone, RotateCcw,
    Mail, Star, Check, Sparkles, User, Sticker
} from 'lucide-react';
import type { InvitationData } from '../../types';
import { DESIGN_PRESETS } from '../../data/presets';
import { THEMES } from '../../data/themes';
import InvitationPreview from '../InvitationPreview';
import { useLanguage } from '../../context/LanguageContext';

interface StepProps {
    data: InvitationData;
    onChange: (field: keyof InvitationData, value: any) => void;
    onUndo?: () => void;
    onRedo?: () => void;
    onReset?: () => void;
}

const StepDesign: React.FC<StepProps> = ({ data, onChange, onUndo, onRedo, onReset }) => {
    const { t } = useLanguage();
    const [subTab, setSubTab] = useState<'card' | 'envelope'>('card');
    const [activeToolPanel, setActiveToolPanel] = useState<'none' | 'text' | 'image' | 'theme' | 'layout' | 'card-bg' | 'card-border' | 'card-text' | 'env-type' | 'env-style' | 'env-material' | 'env-color' | 'env-finish' | 'env-liner' | 'env-seal' | 'env-stamp' | 'presets'>('none');
    const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('mobile');
    const [showTutorial, setShowTutorial] = useState(false);

    // Data Consts moved inside to use t()
    const FONTS = useMemo(() => [
        { id: 'greatvibes', name: 'Romántico (Great Vibes)', family: "'Great Vibes', cursive" },
        { id: 'dancing', name: 'Amistoso (Dancing Script)', family: "'Dancing Script', cursive" },
        { id: 'alexbrush', name: 'Elegante (Alex Brush)', family: "'Alex Brush', cursive" },
        { id: 'parisienne', name: 'Clásico (Parisienne)', family: "'Parisienne', cursive" },
        { id: 'allura', name: 'Fluido (Allura)', family: "'Allura', cursive" },
        { id: 'pinyon', name: 'Regal (Pinyon Script)', family: "'Pinyon Script', cursive" },
        { id: 'petitformal', name: 'Fino (Petit Formal)', family: "'Petit Formal Script', cursive" },
        { id: 'playfair', name: 'Moderno (Playfair)', family: "'Playfair Display', serif" },
        { id: 'montserrat', name: 'Limpio (Montserrat)', family: "'Montserrat', sans-serif" }
    ], []);



    const ENVELOPE_TYPES = useMemo(() => [
        { id: 'classic', name: t('design.panel.envelope_style.3d') },
        { id: 'pointed', name: t('design.option.pointed') },
        { id: 'square', name: t('design.option.square') },
        { id: 'rounded', name: t('design.option.rounded') },
    ], [t]);

    const ENVELOPE_MATERIALS = useMemo(() => [
        { id: 'paper', name: t('design.tool.material') + ' ' + t('design.material.matte') },
        { id: 'linen', name: t('design.material.linen') },
        { id: 'velvet', name: t('design.material.velvet') },
        { id: 'cardstock', name: t('design.material.cardstock') },
    ], [t]);

    const ENVELOPE_FINISHES = useMemo(() => [
        { id: 'matte', name: t('design.finish.matte') },
        { id: 'glossy', name: t('design.finish.glossy') },
        { id: 'metallic', name: t('design.finish.metallic') },
    ], [t]);

    const LINER_PATTERNS = [
        { id: 'none', name: t('design.pattern.none'), url: '' },
        { id: 'marble', name: t('design.pattern.marble'), url: 'https://images.unsplash.com/photo-1576020799627-aeac74d58064?auto=format&fit=crop&w=300&q=80' },
        { id: 'floral', name: t('design.pattern.floral'), url: 'https://images.unsplash.com/photo-1549887552-93f8efb4133f?auto=format&fit=crop&w=300&q=80' },
        { id: 'geo', name: t('design.pattern.geo'), url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=300&q=80' },
        { id: 'gold', name: t('design.pattern.gold'), url: 'https://images.unsplash.com/photo-1550684847-75bdda21cc95?auto=format&fit=crop&w=300&q=80' },
    ];

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

    const ToolButton = ({ icon: Icon, label, onClick, active }: any) => (
        <button
            onClick={onClick}
            style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem',
                border: 'none', background: 'none', cursor: 'pointer', outline: 'none',
                color: active ? '#34D399' : '#6B7280', width: '100%'
            }}
        >
            <div style={{
                padding: '0.8rem', borderRadius: '12px',
                backgroundColor: active ? '#ECFDF5' : '#F3F4F6',
                color: active ? '#34D399' : '#4B5563',
                transition: 'all 0.2s'
            }}>
                <Icon size={20} />
            </div>
            <span style={{ fontSize: '0.65rem', fontWeight: 600, textAlign: 'center' }}>{label}</span>
        </button>
    );

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
                            <HelpCircle size={20} /> {t('design.tutorial.title')}
                        </h3>
                        <p style={{ color: '#666', lineHeight: '1.5' }}>{t('design.tutorial.intro')}</p>
                        <ol style={{ paddingLeft: '1.2rem', color: '#444', lineHeight: '1.6' }}>
                            <li>{t('design.tutorial.step1')}</li>
                            <li>{t('design.tutorial.step2')}</li>
                            <li>{t('design.tutorial.step3')}</li>
                            <li>{t('design.tutorial.step4')}</li>
                            <li>{t('design.tutorial.step5')}</li>
                        </ol>
                        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => setShowTutorial(false)}
                                style={{
                                    backgroundColor: '#059669', color: 'white', border: 'none',
                                    padding: '0.6rem 1.2rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 600
                                }}
                            >
                                {t('design.tutorial.ok')}
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
                    {t('design.tab.card')}
                </button>
                <button
                    onClick={() => { setSubTab('envelope'); setActiveToolPanel('none'); }}
                    style={{ background: 'none', border: 'none', fontWeight: 600, color: subTab === 'envelope' ? '#34D399' : '#4B5563', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: subTab === 'envelope' ? '2px solid #34D399' : 'none', paddingBottom: '2px' }}
                >
                    {t('design.tab.envelope')}
                </button>
            </div>

            {/* Warning Banner */}
            <div style={{ backgroundColor: '#FEF3C7', color: '#92400E', padding: '0.8rem 2rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <div style={{ backgroundColor: '#FBBF24', padding: '2px 6px', borderRadius: '4px', color: 'white', fontWeight: 'bold' }}>!</div>
                {t('design.warning')}
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
                        <Monitor size={14} /> {t('design.view.desktop')}
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
                        <Smartphone size={14} /> {t('design.view.mobile')}
                    </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button onClick={onUndo} title="Deshacer" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}><Undo size={18} /></button>
                    <button onClick={onRedo} title="Rehacer" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}><Redo size={18} /></button>
                    <button onClick={() => setShowTutorial(true)} title="Ayuda" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}><HelpCircle size={18} /></button>
                    <button onClick={onReset} title="Reiniciar" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444' }}><RotateCcw size={18} /></button>
                </div>
            </div>

            {/* Editor Layout: Sidebar + Canvas + Sidebar */}
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

                {/* Left Action Toolbar */}
                <div style={{ width: '90px', backgroundColor: 'white', borderRight: '1px solid #E5E7EB', padding: '1rem 0.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', overflowY: 'auto' }}>
                    {subTab === 'card' ? (
                        <>
                            <ToolButton icon={Sparkles} label={t('design.tool.presets')} onClick={() => setActiveToolPanel(activeToolPanel === 'presets' ? 'none' : 'presets')} active={activeToolPanel === 'presets'} />
                            <ToolButton icon={LayoutTemplate} label={t('design.tool.layout')} onClick={() => setActiveToolPanel(activeToolPanel === 'layout' ? 'none' : 'layout')} active={activeToolPanel === 'layout'} />
                            <ToolButton icon={Type} label={t('design.tool.typography')} onClick={() => setActiveToolPanel(activeToolPanel === 'card-text' ? 'none' : 'card-text')} active={activeToolPanel === 'card-text'} />
                            <ToolButton icon={Image} label={t('design.tool.image')} onClick={() => setActiveToolPanel(activeToolPanel === 'image' ? 'none' : 'image')} active={activeToolPanel === 'image'} />
                            <ToolButton icon={Palette} label={t('design.tool.styles')} onClick={() => setActiveToolPanel(activeToolPanel === 'theme' ? 'none' : 'theme')} active={activeToolPanel === 'theme'} />
                        </>
                    ) : (
                        <>
                            <ToolButton icon={Mail} label={t('design.tool.shape')} onClick={() => setActiveToolPanel(activeToolPanel === 'env-type' ? 'none' : 'env-type')} active={activeToolPanel === 'env-type'} />
                            <ToolButton icon={Sparkles} label={t('design.tool.experience')} onClick={() => setActiveToolPanel(activeToolPanel === 'env-style' ? 'none' : 'env-style')} active={activeToolPanel === 'env-style'} />
                            <ToolButton icon={LayoutTemplate} label={t('design.tool.material')} onClick={() => setActiveToolPanel(activeToolPanel === 'env-material' ? 'none' : 'env-material')} active={activeToolPanel === 'env-material'} />
                            <ToolButton icon={Palette} label={t('design.tool.color')} onClick={() => setActiveToolPanel(activeToolPanel === 'env-color' ? 'none' : 'env-color')} active={activeToolPanel === 'env-color'} />
                            <ToolButton icon={Image} label={t('design.tool.liner')} onClick={() => setActiveToolPanel(activeToolPanel === 'env-liner' ? 'none' : 'env-liner')} active={activeToolPanel === 'env-liner'} />
                            <ToolButton icon={User} label={t('design.tool.seal')} onClick={() => setActiveToolPanel(activeToolPanel === 'env-seal' ? 'none' : 'env-seal')} active={activeToolPanel === 'env-seal'} />
                            <ToolButton icon={Sticker} label={t('design.tool.stamp')} onClick={() => setActiveToolPanel(activeToolPanel === 'env-stamp' ? 'none' : 'env-stamp')} active={activeToolPanel === 'env-stamp'} />
                            <ToolButton icon={Star} label={t('design.tool.finish')} onClick={() => setActiveToolPanel(activeToolPanel === 'env-finish' ? 'none' : 'env-finish')} active={activeToolPanel === 'env-finish'} />

                        </>
                    )}
                </div>

                {/* Pop-out Panels for Tools (Floats over Canvas) */}
                {activeToolPanel !== 'none' && (
                    <div style={{ width: '300px', backgroundColor: 'white', borderRight: '1px solid #E5E7EB', overflowY: 'auto', padding: '1.5rem', boxShadow: '5px 0 15px rgba(0,0,0,0.05)', zIndex: 10 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ margin: 0, fontSize: '1rem' }}>
                                {activeToolPanel === 'text' && t('design.tool.typography')}
                                {activeToolPanel === 'image' && t('design.tool.image')}
                                {activeToolPanel === 'presets' && t('design.panel.presets.title')}
                                {activeToolPanel === 'theme' && t('design.tool.styles')}
                                {activeToolPanel === 'layout' && t('design.tool.layout')}
                                {activeToolPanel === 'env-type' && t('design.tool.shape')}
                                {activeToolPanel === 'env-style' && t('design.tool.experience')}
                                {activeToolPanel === 'env-material' && t('design.tool.material')}
                                {activeToolPanel === 'env-color' && t('design.tool.color')}
                                {activeToolPanel === 'env-liner' && t('design.tool.liner')}
                                {activeToolPanel === 'env-seal' && t('design.tool.seal')}
                                {activeToolPanel === 'env-stamp' && t('design.tool.stamp')}
                                {activeToolPanel === 'env-finish' && t('design.tool.finish')}
                            </h3>
                            <button onClick={() => setActiveToolPanel('none')} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>&times;</button>
                        </div>

                        {/* PRESETS PANEL */}
                        {activeToolPanel === 'presets' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                <p style={{ fontSize: '0.85rem', color: '#666', marginTop: 0 }}>{t('design.panel.presets.desc')}</p>
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
                        {activeToolPanel === 'env-style' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                <p style={{ fontSize: '0.85rem', color: '#666', marginTop: 0 }}>{t('design.panel.envelope_style.title')}</p>

                                <button
                                    onClick={() => updateEnvelope('openingStyle', 'envelope')}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem',
                                        border: (!data.envelope?.openingStyle || data.envelope.openingStyle === 'envelope') ? '2px solid #34D399' : '1px solid #eee',
                                        borderRadius: '8px', backgroundColor: 'white', cursor: 'pointer', textAlign: 'left'
                                    }}
                                >
                                    <div style={{ fontSize: '1.5rem' }}>✉️</div>
                                    <div>
                                        <div style={{ fontWeight: 600, marginBottom: '0.2rem' }}>{t('design.panel.envelope_style.3d')}</div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => updateEnvelope('openingStyle', 'book')}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem',
                                        border: data.envelope?.openingStyle === 'book' ? '2px solid #34D399' : '1px solid #eee',
                                        borderRadius: '8px', backgroundColor: 'white', cursor: 'pointer', textAlign: 'left'
                                    }}
                                >
                                    <div style={{ fontSize: '1.5rem' }}>📖</div>
                                    <div>
                                        <div style={{ fontWeight: 600, marginBottom: '0.2rem' }}>{t('design.panel.envelope_style.book')}</div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => updateEnvelope('openingStyle', 'crumple')}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem',
                                        border: data.envelope?.openingStyle === 'crumple' ? '2px solid #34D399' : '1px solid #eee',
                                        borderRadius: '8px', backgroundColor: 'white', cursor: 'pointer', textAlign: 'left'
                                    }}
                                >
                                    <div style={{ fontSize: '1.5rem' }}>🍂</div>
                                    <div>
                                        <div style={{ fontWeight: 600, marginBottom: '0.2rem' }}>{t('design.panel.envelope_style.crumple')}</div>
                                    </div>
                                </button>
                            </div>
                        )}

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

                        {/* LINER TOOLS */}
                        {activeToolPanel === 'env-liner' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <p style={{ fontSize: '0.85rem', color: '#666', marginTop: 0 }}>{t('design.panel.liner.title')}</p>

                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>{t('design.panel.liner.solid')}</label>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem' }}>
                                        {['#FFFFFF', '#000000', '#F5E6D3', '#E0BFB8', '#9DC183', '#B8C0FF', '#FFD700', '#C0C0C0', '#F4A460', '#FF69B4'].map(color => (
                                            <button
                                                key={color}
                                                onClick={() => {
                                                    const currentEnv = data.envelope || { enabled: true, type: 'classic', material: 'paper', color: '#f5f5f5' };
                                                    onChange('envelope', {
                                                        ...currentEnv,
                                                        liner: { type: 'color', value: color }
                                                    });
                                                }}
                                                style={{
                                                    width: '100%', aspectRatio: '1/1', borderRadius: '4px',
                                                    backgroundColor: color, border: '1px solid #ddd', cursor: 'pointer'
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>{t('design.panel.liner.image')}</label>
                                    <select
                                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            const currentEnv = data.envelope || { enabled: true, type: 'classic', material: 'paper', color: '#f5f5f5' };
                                            if (val === 'none') {
                                                onChange('envelope', { ...currentEnv, liner: undefined });
                                            } else {
                                                onChange('envelope', {
                                                    ...currentEnv,
                                                    liner: { type: 'image', value: val }
                                                });
                                            }
                                        }}
                                        value={data.envelope?.liner?.type === 'image' ? data.envelope.liner.value : 'none'}
                                    >
                                        <option value="none">Sin imagen</option>
                                        {data.mediaLibrary?.map((url, i) => (
                                            <option key={i} value={url}>Imagen de Biblioteca {i + 1}</option>
                                        ))}
                                    </select>
                                    <p style={{ fontSize: '0.7rem', color: '#999', marginTop: '0.2rem' }}>Sube imágenes en la pestaña "Agregar imagen" primero.</p>
                                </div>

                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>{t('design.panel.liner.pattern')}</label>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                                        {LINER_PATTERNS.map(pat => (
                                            <button
                                                key={pat.id}
                                                onClick={() => {
                                                    const currentEnv = data.envelope || { enabled: true, type: 'classic', material: 'paper', color: '#f5f5f5' };
                                                    if (pat.id === 'none') {
                                                        onChange('envelope', { ...currentEnv, liner: undefined });
                                                    } else {
                                                        onChange('envelope', { ...currentEnv, liner: { type: 'image', value: pat.url } });
                                                    }
                                                }}
                                                style={{
                                                    height: '60px', borderRadius: '4px', border: '1px solid #ddd', cursor: 'pointer',
                                                    backgroundImage: pat.url ? `url(${pat.url})` : 'none', backgroundSize: 'cover',
                                                    backgroundColor: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: '0.7rem', color: '#666'
                                                }}
                                            >
                                                {!pat.url && pat.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* SEAL TOOLS */}
                        {activeToolPanel === 'env-seal' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={data.envelope?.seal?.enabled !== false}
                                        onChange={(e) => {
                                            const currentEnv = data.envelope || { enabled: true, type: 'classic', material: 'paper', color: '#f5f5f5' };
                                            onChange('envelope', {
                                                ...currentEnv,
                                                seal: { ...(currentEnv.seal || { color: '#D73838' }), enabled: e.target.checked }
                                            });
                                        }}
                                    />
                                    <span style={{ fontWeight: 600 }}>{t('design.panel.seal.enable')}</span>
                                </label>

                                {data.envelope?.seal?.enabled !== false && (
                                    <>
                                        <div>
                                            <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>{t('design.panel.seal.color')}</label>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                {['#D73838', '#8B0000', '#DAA520', '#C0C0C0', '#2F4F4F', '#000000'].map(c => (
                                                    <button
                                                        key={c}
                                                        onClick={() => {
                                                            const currentEnv = data.envelope || { enabled: true, type: 'classic', material: 'paper', color: '#f5f5f5' };
                                                            onChange('envelope', {
                                                                ...currentEnv,
                                                                seal: { ...(currentEnv.seal || { enabled: true }), color: c }
                                                            });
                                                        }}
                                                        style={{
                                                            width: '30px', height: '30px', borderRadius: '50%',
                                                            backgroundColor: c, border: 'none', cursor: 'pointer',
                                                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                                        }}
                                                    />
                                                ))}
                                                <input
                                                    type="color"
                                                    value={data.envelope?.seal?.color || '#D73838'}
                                                    onChange={(e) => {
                                                        const currentEnv = data.envelope || { enabled: true, type: 'classic', material: 'paper', color: '#f5f5f5' };
                                                        onChange('envelope', {
                                                            ...currentEnv,
                                                            seal: { ...(currentEnv.seal || { enabled: true }), color: e.target.value }
                                                        });
                                                    }}
                                                    style={{ width: '30px', height: '30px', border: 'none', background: 'none' }}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>{t('design.panel.seal.initials')}</label>
                                            <input
                                                type="text"
                                                maxLength={2}
                                                placeholder="Ej. AB"
                                                value={data.envelope?.seal?.text || ''}
                                                onChange={(e) => {
                                                    const currentEnv = data.envelope || { enabled: true, type: 'classic', material: 'paper', color: '#f5f5f5' };
                                                    onChange('envelope', {
                                                        ...currentEnv,
                                                        seal: { ...(currentEnv.seal || { enabled: true, color: '#D73838' }), text: e.target.value }
                                                    });
                                                }}
                                                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', textTransform: 'uppercase' }}
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {/* STAMP TOOLS */}
                        {activeToolPanel === 'env-stamp' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={data.envelope?.stamp?.enabled !== false}
                                        onChange={(e) => {
                                            const currentEnv = data.envelope || { enabled: true, type: 'classic', material: 'paper', color: '#f5f5f5' };
                                            onChange('envelope', {
                                                ...currentEnv,
                                                stamp: { ...(currentEnv.stamp || {}), enabled: e.target.checked }
                                            });
                                        }}
                                    />
                                    <span style={{ fontWeight: 600 }}>Mostrar Estampilla</span>
                                </label>

                                {data.envelope?.stamp?.enabled !== false && (
                                    <div>
                                        <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Imagen de Estampilla</label>
                                        <select
                                            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                const currentEnv = data.envelope || { enabled: true, type: 'classic', material: 'paper', color: '#f5f5f5' };
                                                onChange('envelope', {
                                                    ...currentEnv,
                                                    stamp: { enabled: true, url: val }
                                                });
                                            }}
                                            value={data.envelope?.stamp?.url || ''}
                                        >
                                            <option value="">Predeterminada</option>
                                            {data.mediaLibrary?.map((url, i) => (
                                                <option key={i} value={url}>Imagen de Biblioteca {i + 1}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* CARD DESIGN PANEL: BACKGROUND */}
                        {activeToolPanel === 'card-bg' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>{t('design.tool.color')}</label>
                                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                        {['#FFFFFF', '#FAF7F2', '#F5E6D3', '#000000', '#2C3E50'].map(c => (
                                            <button
                                                key={c}
                                                onClick={() => onChange('design', { ...data.design, backgroundColor: c, backgroundImage: '' })}
                                                style={{ width: '30px', height: '30px', borderRadius: '4px', backgroundColor: c, border: '1px solid #ddd', cursor: 'pointer' }}
                                            />
                                        ))}
                                        <input
                                            type="color"
                                            value={data.design?.backgroundColor || '#FFFFFF'}
                                            onChange={(e) => onChange('design', { ...data.design, backgroundColor: e.target.value, backgroundImage: '' })}
                                            style={{ width: '30px', height: '30px', padding: 0, border: 'none', background: 'none' }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Texturas</label>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                                        {[
                                            { id: 'canvas', url: 'https://www.transparenttextures.com/patterns/canvas-orange.png' },
                                            { id: 'paper', url: 'https://www.transparenttextures.com/patterns/cream-paper.png' },
                                            { id: 'linen', url: 'https://www.transparenttextures.com/patterns/gray-floral.png' } // Placeholder for linen
                                        ].map(tex => (
                                            <button
                                                key={tex.id}
                                                onClick={() => onChange('design', { ...data.design, backgroundImage: tex.url })}
                                                style={{
                                                    height: '60px', borderRadius: '4px', border: '1px solid #ddd',
                                                    backgroundImage: `url(${tex.url})`, backgroundColor: '#f5f5f5',
                                                    cursor: 'pointer'
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Opacidad del Contenido</label>
                                    <input
                                        type="range" min="0" max="1" step="0.1"
                                        value={data.design?.overlayOpacity ?? 0}
                                        onChange={(e) => onChange('design', { ...data.design, overlayOpacity: parseFloat(e.target.value) })}
                                        style={{ width: '100%' }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* CARD DESIGN PANEL: BORDER */}
                        {activeToolPanel === 'card-border' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Estilo de Borde</label>
                                    <select
                                        style={{ width: '100%', padding: '0.5rem' }}
                                        value={data.design?.borderStyle || 'none'}
                                        onChange={(e) => onChange('design', { ...data.design, borderStyle: e.target.value })}
                                    >
                                        <option value="none">Ninguno</option>
                                        <option value="solid">Sólido Simple</option>
                                        <option value="double">Doble Línea</option>
                                        <option value="gold-frame">Marco Dorado</option>
                                        <option value="floral">Floral (Esquinas)</option>
                                    </select>
                                </div>
                                {data.design?.borderStyle !== 'none' && data.design?.borderStyle !== 'gold-frame' && (
                                    <div>
                                        <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Color del Borde</label>
                                        <input
                                            type="color"
                                            value={data.design?.borderColor || '#000000'}
                                            onChange={(e) => onChange('design', { ...data.design, borderColor: e.target.value })}
                                            style={{ width: '100%', height: '40px', padding: 0, border: 'none' }}
                                        />
                                    </div>
                                )}
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Esquinas</label>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <button
                                            onClick={() => onChange('design', { ...data.design, corners: 'square' })}
                                            style={{ padding: '0.5rem 1rem', border: data.design?.corners === 'square' ? '2px solid blue' : '1px solid #ccc' }}
                                        >Cuadradas</button>
                                        <button
                                            onClick={() => onChange('design', { ...data.design, corners: 'rounded' })}
                                            style={{ padding: '0.5rem 1rem', border: data.design?.corners === 'rounded' ? '2px solid blue' : '1px solid #ccc' }}
                                        >Redondeadas</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* CARD DESIGN PANEL: TYPOGRAPHY */}
                        {activeToolPanel === 'card-text' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Fuente Principal (Nombres)</label>
                                    <select
                                        style={{ width: '100%', padding: '0.5rem' }}
                                        value={data.design?.font || data.font || 'greatvibes'}
                                        onChange={(e) => {
                                            onChange('font', e.target.value);
                                            onChange('design', { ...data.design, font: e.target.value });
                                        }}
                                    >
                                        {FONTS.map(f => (
                                            <option key={f.id} value={f.id}>{f.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Color Principal</label>
                                    <input
                                        type="color"
                                        value={data.design?.primaryColor || '#000000'}
                                        onChange={(e) => onChange('design', { ...data.design, primaryColor: e.target.value })}
                                        style={{ width: '100%', height: '40px', padding: 0, border: 'none' }}
                                    />
                                </div>

                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Fuente de Cuerpo</label>
                                    <select
                                        style={{ width: '100%', padding: '0.5rem' }}
                                        value={data.design?.bodyFont || 'montserrat'}
                                        onChange={(e) => onChange('design', { ...data.design, bodyFont: e.target.value })}
                                    >
                                        <option value="montserrat">Montserrat</option>
                                        <option value="lato">Lato</option>
                                        <option value="playfair">Playfair Display</option>
                                    </select>
                                </div>
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
                                    <div style={{ fontSize: '1.5rem' }}>📱</div>
                                    <div>
                                        <div style={{ fontWeight: 600, marginBottom: '0.2rem' }}>Scroll Vertical (Moderno)</div>
                                        <div style={{ fontSize: '0.75rem', color: '#666' }}>Ideal para móviles. Navegación fluida hacia abajo.</div>
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
                                    <div style={{ fontSize: '1.5rem' }}>↔️</div>
                                    <div>
                                        <div style={{ fontWeight: 600, marginBottom: '0.2rem' }}>Deslizar (Slider)</div>
                                        <div style={{ fontSize: '0.75rem', color: '#666' }}>Navegación horizontal o por pasos. (Pronto)</div>
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
                                    <div style={{ fontSize: '1.5rem' }}>📄</div>
                                    <div>
                                        <div style={{ fontWeight: 600, marginBottom: '0.2rem' }}>Carta Simple (Clásico)</div>
                                        <div style={{ fontSize: '0.75rem', color: '#666' }}>Estilo tradicional. Todo en una sola vista.</div>
                                    </div>
                                </button>
                            </div>
                        )}

                        {/* IMAGE TOOLS */}
                        {activeToolPanel === 'image' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Subir Nueva Imagen</label>
                                    <div style={{
                                        border: '2px dashed #ccc', borderRadius: '8px', padding: '2rem', textAlign: 'center',
                                        cursor: 'pointer', backgroundColor: '#f9f9f9'
                                    }} onClick={() => document.getElementById('imageUpload')?.click()}>
                                        <p style={{ margin: 0, color: '#666' }}>Haz clic para seleccionar imágenes</p>
                                        <input
                                            id="imageUpload"
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleUpload}
                                            style={{ display: 'none' }}
                                        />
                                    </div>
                                </div>

                                {data.mediaLibrary && data.mediaLibrary.length > 0 && (
                                    <div>
                                        <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Tu Biblioteca de Medios</label>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                                            {data.mediaLibrary.map((url, i) => (
                                                <div
                                                    key={i}
                                                    onClick={() => onChange('imageUrl', url)}
                                                    style={{
                                                        aspectRatio: '1/1',
                                                        backgroundImage: `url(${url})`,
                                                        backgroundSize: 'cover',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer',
                                                        border: data.imageUrl === url ? '2px solid #34D399' : '1px solid #ddd'
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* THEMES (STYLES) PANEL */}
                        {activeToolPanel === 'theme' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #eee' }}>
                                    <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#444', marginBottom: '1rem', marginTop: 0 }}>Ajustes de Fondo</p>

                                    <div style={{ marginBottom: '1rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                            <label style={{ fontSize: '0.8rem', color: '#666' }}>Difuminar</label>
                                            <span style={{ fontSize: '0.8rem', color: '#999' }}>{data.design?.blur || 0}px</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="10"
                                            step="0.5"
                                            value={data.design?.blur || 0}
                                            onChange={(e) => onChange('design', { ...data.design, blur: parseFloat(e.target.value) })}
                                            style={{ width: '100%', cursor: 'pointer', accentColor: '#34D399' }}
                                        />
                                    </div>

                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                            <label style={{ fontSize: '0.8rem', color: '#666' }}>Color / Saturación</label>
                                            <span style={{ fontSize: '0.8rem', color: '#999' }}>{data.design?.saturation ?? 100}%</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            step="5"
                                            value={data.design?.saturation ?? 100}
                                            onChange={(e) => onChange('design', { ...data.design, saturation: parseInt(e.target.value) })}
                                            style={{ width: '100%', cursor: 'pointer', accentColor: '#34D399' }}
                                        />
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.2rem' }}>
                                            <span style={{ fontSize: '0.7rem', color: '#999' }}>B&N</span>
                                            <span style={{ fontSize: '0.7rem', color: '#999' }}>Full Color</span>
                                        </div>
                                    </div>
                                </div>

                                <p style={{ fontSize: '0.85rem', color: '#666', marginTop: 0 }}>Paletas de colores y fuentes predefinidas.</p>
                                {THEMES.map(theme => (
                                    <button
                                        key={theme.id}
                                        onClick={() => {
                                            onChange('theme', theme.id);
                                            onChange('design', {
                                                ...data.design,
                                                backgroundColor: theme.bg,
                                                backgroundImage: theme.backgroundImage && theme.backgroundImage !== '' ? theme.backgroundImage : undefined,
                                                primaryColor: theme.color,
                                                secondaryColor: theme.accent,
                                                borderStyle: (theme.borderStyle as any) || 'none',
                                                borderColor: theme.color, // Fallback border color
                                                contentOverlay: theme.contentOverlay,
                                                blur: theme.blur ?? 0,
                                                saturation: theme.saturation ?? 100
                                            });
                                        }}
                                        style={{
                                            padding: '1rem',
                                            border: data.theme === theme.id ? '2px solid #34D399' : '1px solid #eee',
                                            borderRadius: '8px',
                                            backgroundColor: 'white',
                                            cursor: 'pointer',
                                            textAlign: 'left',
                                            transition: 'transform 0.2s',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '1rem'
                                        }}
                                    >
                                        <div style={{
                                            width: '40px', height: '40px', borderRadius: '50%',
                                            backgroundColor: theme.bg, border: `2px solid ${theme.color}`,
                                            flexShrink: 0
                                        }}></div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 'bold', color: '#333' }}>{theme.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#666' }}>Estilo {theme.id}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                    </div>
                )}

                {/* Main Canvas */}
                <div style={{ flex: 1, backgroundColor: '#E5E7EB', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', padding: '2rem' }}>
                    <div style={{
                        width: viewMode === 'mobile' ? '375px' : '100%',
                        height: viewMode === 'mobile' ? '667px' : '100%',
                        maxWidth: viewMode === 'desktop' ? '1200px' : '375px',
                        backgroundColor: 'white',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                        transition: 'all 0.3s ease',
                        overflow: 'hidden',
                        borderRadius: viewMode === 'mobile' ? '40px' : '8px',
                        border: viewMode === 'mobile' ? '8px solid #333' : 'none'
                    }}>
                        {subTab === 'card' ? (
                            <InvitationPreview data={data} isGuest={false} />
                        ) : (
                            // Render Envelope Preview 
                            <InvitationPreview
                                data={data}
                                isGuest={false}
                                forceShowEnvelope={true}
                                isMobilePreview={viewMode === 'mobile'}
                            />
                        )}
                    </div>
                </div>


            </div>

        </div >
    );
};

export default StepDesign;
