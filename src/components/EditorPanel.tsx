import React, { useState } from 'react';
import { Type, Palette, PenTool, Image, Check, Music, Trash2, Layers, LayoutGrid, Plus, Monitor } from 'lucide-react';
import type { InvitationData } from '../types';

interface EditorPanelProps {
    data: InvitationData;
    onChange: (field: keyof InvitationData, value: string) => void;
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

// Helper for URL processing (Shared relative to utils import)

// Extracted Component for Reusability and Visibility Assurance




const EditorPanel: React.FC<EditorPanelProps> = ({ data, onChange }) => {
    const [activeTab, setActiveTab] = useState<'content' | 'design' | 'media'>('media');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        onChange(name as keyof InvitationData, value);
    };

    return (
        <div className="editor-panel" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>

            {/* Tabs Header */}
            <div style={{ display: 'flex', borderBottom: '1px solid #eee', marginBottom: '1.5rem' }}>
                <button
                    onClick={() => setActiveTab('content')}
                    style={{
                        flex: 1, padding: '1rem', background: 'none', border: 'none',
                        borderBottom: activeTab === 'content' ? '3px solid #2D2A26' : '3px solid transparent',
                        fontWeight: activeTab === 'content' ? 700 : 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                        color: activeTab === 'content' ? '#2D2A26' : '#9ca3af', fontSize: '1rem'
                    }}
                >
                    <PenTool size={18} /> Contenido
                </button>
                <button
                    onClick={() => setActiveTab('media')}
                    style={{
                        flex: 1, padding: '1rem', background: 'none', border: 'none',
                        borderBottom: activeTab === 'media' ? '3px solid #2D2A26' : '3px solid transparent',
                        fontWeight: activeTab === 'media' ? 700 : 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                        color: activeTab === 'media' ? '#2D2A26' : '#9ca3af', fontSize: '1rem'
                    }}
                >
                    <Image size={18} /> Biblioteca
                </button>
                <button
                    onClick={() => setActiveTab('design')}
                    style={{
                        flex: 1, padding: '1rem', background: 'none', border: 'none',
                        borderBottom: activeTab === 'design' ? '3px solid #2D2A26' : '3px solid transparent',
                        fontWeight: activeTab === 'design' ? 700 : 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                        color: activeTab === 'design' ? '#2D2A26' : '#9ca3af', fontSize: '1rem'
                    }}
                >
                    <Palette size={18} /> Diseño
                </button>
            </div>

            {/* Tab Content */}
            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem', paddingBottom: '2rem' }}>

                {activeTab === 'media' && (
                    <div style={{ padding: '0 1rem' }}>
                        <div style={{ padding: '1.5rem', backgroundColor: '#F0F9FF', borderRadius: '12px', border: '1px solid #BAE6FD', marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.1rem', color: '#0369A1', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Image size={20} /> Biblioteca de Medios
                            </h3>
                            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                                Importa fotos y asígnalas.
                                <span style={{ fontSize: '0.8rem', color: '#d97706', fontWeight: 500, marginLeft: '0.5rem' }}>
                                    ⚠️ Drive: Requiere permiso público.
                                </span>
                            </p>

                            {/* --- Minimalist Upload Area (Firebase) --- */}
                            <div style={{ marginBottom: '2rem' }}>
                                <input
                                    type="file"
                                    id="media-upload-input"
                                    accept="image/*"
                                    multiple
                                    style={{ display: 'none' }}
                                    onChange={async (e) => {
                                        const files = Array.from(e.target.files || []);
                                        if (files.length === 0) return;

                                        // Notify user upload started (optional UI enhancement could go here)
                                        const uploadButton = document.getElementById('upload-btn-text');
                                        if (uploadButton) uploadButton.innerText = 'Subiendo...';

                                        try {
                                            const newUrls: string[] = [];
                                            for (const file of files) {
                                                // Import dynamically to avoid circular dependencies if any
                                                const { uploadImage } = await import('../services/storage');
                                                const url = await uploadImage(file);
                                                newUrls.push(url);
                                            }
                                            onChange('mediaLibrary', [...(data.mediaLibrary || []), ...newUrls] as any);
                                        } catch (error) {
                                            alert("Error al subir imagen. Verifica tu conexión.");
                                        } finally {
                                            e.target.value = '';
                                            if (uploadButton) uploadButton.innerText = 'Adjuntar archivos desde dispositivo';
                                        }
                                    }}
                                />
                                <button
                                    onClick={() => document.getElementById('media-upload-input')?.click()}
                                    style={{
                                        width: '100%',
                                        padding: '2rem',
                                        background: '#fafafa',
                                        border: '2px dashed #e5e7eb',
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '0.8rem',
                                        transition: 'all 0.2s ease',
                                        color: '#6b7280'
                                    }}
                                    onMouseOver={(e) => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.background = '#eff6ff'; }}
                                    onMouseOut={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.background = '#fafafa'; }}
                                >
                                    <div style={{ background: '#fff', padding: '0.8rem', borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                        <Plus size={24} color="#3b82f6" />
                                    </div>
                                    <span id="upload-btn-text" style={{ fontWeight: 500 }}>Adjuntar archivos desde dispositivo</span>
                                </button>
                            </div>

                            {/* --- Minimalist Media Grid --- */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '0.8rem' }}>
                                {(data.mediaLibrary || []).map((img, idx) => (
                                    <div key={idx} style={{
                                        position: 'relative',
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        border: data.imageUrl === img
                                            ? '2px solid #2563EB'
                                            : (data.backgroundImages?.includes(img) || data.gallery?.includes(img))
                                                ? '2px solid #8B5CF6'
                                                : '1px solid #f3f4f6',
                                        aspectRatio: '1/1'
                                    }}
                                        className="media-card"
                                    >
                                        <img src={img} alt={`Media ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

                                        {/* Selection Badges */}
                                        <div style={{ position: 'absolute', top: 4, left: 4, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            {data.imageUrl === img && (
                                                <span style={{ fontSize: '0.6rem', background: '#2563EB', color: '#fff', padding: '2px 6px', borderRadius: '99px', fontWeight: 600, boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                                                    PORTADA
                                                </span>
                                            )}
                                            {data.backgroundImages?.includes(img) && (
                                                <span style={{ fontSize: '0.6rem', background: '#8B5CF6', color: '#fff', padding: '2px 6px', borderRadius: '99px', fontWeight: 600, boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                                                    FONDO
                                                </span>
                                            )}
                                            {data.gallery?.includes(img) && (
                                                <span style={{ fontSize: '0.6rem', background: '#059669', color: '#fff', padding: '2px 6px', borderRadius: '99px', fontWeight: 600, boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                                                    GALERÍA
                                                </span>
                                            )}
                                        </div>

                                        {/* Overlay Actions */}
                                        <div style={{
                                            position: 'absolute', bottom: 0, left: 0, right: 0,
                                            background: 'rgba(255,255,255,0.95)', padding: '0.3rem',
                                            display: 'flex', justifyContent: 'space-around', alignItems: 'center',
                                            borderTop: '1px solid #f3f4f6'
                                        }}>
                                            <button
                                                title="Usar en Portada"
                                                onClick={() => onChange('imageUrl', img)}
                                                style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '4px', borderRadius: '4px' }}
                                                onMouseOver={(e) => e.currentTarget.style.background = '#eff6ff'}
                                                onMouseOut={(e) => e.currentTarget.style.background = 'none'}
                                            >
                                                <Monitor size={14} color="#1e40af" />
                                            </button>
                                            <button
                                                title="Añadir a Fondo"
                                                onClick={() => {
                                                    const current = data.backgroundImages || [];
                                                    if (current.length < 5) onChange('backgroundImages', [...current, img] as any);
                                                    else alert('Máximo 5 imágenes de fondo');
                                                }}
                                                style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '4px', borderRadius: '4px' }}
                                                onMouseOver={(e) => e.currentTarget.style.background = '#faf5ff'}
                                                onMouseOut={(e) => e.currentTarget.style.background = 'none'}
                                            >
                                                <Layers size={14} color="#6b21a8" />
                                            </button>
                                            <button
                                                title="Añadir a Galería"
                                                onClick={() => onChange('gallery', [...(data.gallery || []), img] as any)}
                                                style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '4px', borderRadius: '4px' }}
                                                onMouseOver={(e) => e.currentTarget.style.background = '#ecfdf5'}
                                                onMouseOut={(e) => e.currentTarget.style.background = 'none'}
                                            >
                                                <LayoutGrid size={14} color="#047857" />
                                            </button>
                                            <button
                                                title="Eliminar"
                                                onClick={() => {
                                                    const newLib = (data.mediaLibrary || []).filter((_, i) => i !== idx);
                                                    onChange('mediaLibrary', newLib as any);
                                                }}
                                                style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '4px', borderRadius: '4px' }}
                                                onMouseOver={(e) => e.currentTarget.style.background = '#fef2f2'}
                                                onMouseOut={(e) => e.currentTarget.style.background = 'none'}
                                            >
                                                <Trash2 size={14} color="#ef4444" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {(!data.mediaLibrary || data.mediaLibrary.length === 0) && (
                                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '1rem', color: '#9ca3af', fontSize: '0.9rem', fontStyle: 'italic' }}>
                                        Tu biblioteca está vacía.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'media' && (
                    <div style={{ padding: '0 1rem', marginTop: '1rem', borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem' }}>
                        <div style={{ padding: '1.5rem', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                            <h3 style={{ fontSize: '1.1rem', color: '#374151', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Image size={20} /> Galería del Evento (Seleccionadas)
                            </h3>

                            <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '1rem' }}>
                                Estas son las fotos que aparecerán en la sección "Galería" de tu invitación.<br />
                                Usa el botón <strong>"+ A Galería"</strong> en tus fotos de arriba para agregar más.
                            </p>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
                                {data.gallery && data.gallery.length > 0 ? (
                                    data.gallery.map((img, index) => (
                                        <div key={index} style={{ width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', position: 'relative', border: '1px solid #eee' }}>
                                            <img src={img} alt={`Gallery ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            <button
                                                title="Quitar de galería"
                                                onClick={() => {
                                                    const newGallery = data.gallery?.filter((_, i) => i !== index);
                                                    onChange('gallery', newGallery as any);
                                                }}
                                                style={{
                                                    position: 'absolute', top: 3, right: 3,
                                                    background: 'rgba(239, 68, 68, 0.9)', color: '#fff',
                                                    border: 'none', borderRadius: '50%',
                                                    width: '20px', height: '20px',
                                                    cursor: 'pointer', display: 'flex',
                                                    alignItems: 'center', justifyContent: 'center',
                                                    fontSize: '12px'
                                                }}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div style={{ width: '100%', padding: '1.5rem', textAlign: 'center', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px dashed #d1d5db', color: '#9ca3af', fontSize: '0.9rem' }}>
                                        No hay fotos en la galería.<br />
                                        Sube fotos arriba y añádelas con el botón verde.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'media' && (
                    <div style={{ padding: '0 1rem', marginTop: '1rem', borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem' }}>
                        {/* --- Minimalist Background Management --- */}
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '0.95rem', color: '#374151', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                                <Layers size={16} /> Fotos de Fondo (Seleccionadas)
                            </h3>
                            <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '1rem', fontStyle: 'italic' }}>
                                <strong>Debes seleccionar 4 fotos</strong> (Una para cada sección: Portada, Detalles, Vestimenta, Galería).
                            </p>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {data.backgroundImages && data.backgroundImages.filter(Boolean).length > 0 ? (
                                    data.backgroundImages.filter(Boolean).map((img, index) => (
                                        <div key={index} style={{ width: '60px', height: '60px', borderRadius: '6px', overflow: 'hidden', position: 'relative', border: '1px solid #eee' }}>
                                            <img src={img} alt={`BG ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            <button
                                                title="Quitar"
                                                onClick={() => {
                                                    const newBgs = data.backgroundImages?.filter(url => url !== img);
                                                    onChange('backgroundImages', newBgs as any);
                                                }}
                                                style={{
                                                    position: 'absolute', inset: 0,
                                                    background: 'rgba(0,0,0,0.3)', color: '#fff',
                                                    border: 'none', cursor: 'pointer',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    opacity: 0, transition: 'opacity 0.2s',
                                                }}
                                                onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
                                                onMouseOut={(e) => e.currentTarget.style.opacity = '0'}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div style={{ fontSize: '0.85rem', color: '#9ca3af', fontStyle: 'italic', padding: '0.5rem 0' }}>
                                        Sin fondos seleccionados.
                                    </div>
                                )}
                            </div>
                        </div>


                    </div>
                )}

                {activeTab === 'content' ? (
                    <>
                        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', color: '#111827', fontWeight: 700 }}>Detalles del Evento</h3>





                        <div className="form-group" style={{ marginBottom: '1.2rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>Pareja 1</label>
                            <input
                                type="text"
                                name="partner1"
                                value={data.partner1}
                                onChange={handleChange}
                                placeholder="Nombre"
                                style={{ width: '100%', padding: '0.8rem', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#FAFAF9' }}
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: '1.2rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>Pareja 2</label>
                            <input
                                type="text"
                                name="partner2"
                                value={data.partner2}
                                onChange={handleChange}
                                placeholder="Nombre"
                                style={{ width: '100%', padding: '0.8rem', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#FAFAF9' }}
                            />
                        </div>

                        <div className="form-row" style={{ display: 'flex', gap: '1rem', marginBottom: '1.2rem' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>Fecha</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={data.date}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '0.8rem', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#FAFAF9' }}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>Hora</label>
                                <input
                                    type="time"
                                    name="time"
                                    value={data.time}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '0.8rem', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#FAFAF9' }}
                                />
                            </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: '1.2rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>Código de Vestimenta</label>
                            <select
                                name="dressCode"
                                value={data.dressCode || 'Formal'}
                                onChange={(e) => onChange('dressCode', e.target.value)}
                                style={{ width: '100%', padding: '0.8rem', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#FAFAF9', fontFamily: 'inherit' }}
                            >
                                <option value="Formal">Formal</option>
                                <option value="Semiformal">Semiformal</option>
                                <option value="Cocktail">Cocktail</option>
                                <option value="Casual">Casual</option>
                            </select>

                            <textarea
                                name="dressCodeDetails"
                                value={data.dressCodeDetails || ''}
                                onChange={handleChange}
                                placeholder="Detalles (Ej: Hombres traje oscuro, Mujeres vestido largo...)"
                                rows={2}
                                style={{ width: '100%', marginTop: '0.8rem', padding: '0.8rem', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#FAFAF9', resize: 'vertical', fontFamily: 'inherit' }}
                            />

                            {/* Dress Code Inspiration Image Input */}
                            <div style={{ marginTop: '0.8rem', backgroundColor: '#fff', border: '1px dashed #ddd', padding: '0.8rem', borderRadius: '8px' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: '#666' }}>
                                    Ejemplo Visual (Opcional) - Gestionar en Biblioteca
                                </label>
                            </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: '1.2rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
                                Enlace de Mapa (Hace clicable el nombre del lugar)
                            </label>
                            <input
                                type="text"
                                name="mapUrl"
                                value={data.mapUrl || ''}
                                onChange={handleChange}
                                placeholder="Pega aquí el enlace de Google Maps..."
                                style={{ width: '100%', padding: '0.8rem', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#FAFAF9' }}
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: '1.2rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>Mensaje Personal</label>
                            <textarea
                                name="message"
                                value={data.message}
                                onChange={handleChange}
                                placeholder="Mensaje para tus invitados..."
                                rows={4}
                                style={{ width: '100%', padding: '0.8rem', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#FAFAF9', resize: 'vertical', fontFamily: 'inherit' }}
                            />
                        </div>

                        {/* Audio URL Input */}
                        <div className="form-group" style={{ marginBottom: '1.2rem', marginTop: '2rem', borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: '#555' }}>
                                <Music size={16} /> Música de Fondo (URL)
                            </label>
                            <input
                                type="text"
                                name="audioUrl"
                                value={data.audioUrl || ''}
                                onChange={handleChange}
                                placeholder="https://ejemplo.com/cancion.mp3 (Opcional)"
                                style={{ width: '100%', padding: '0.8rem', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#FAFAF9', fontSize: '0.85rem' }}
                            />
                        </div>

                        {/* WhatsApp RSVP Input */}
                        <div className="form-group" style={{ marginBottom: '1.2rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: '#555' }}>
                                📱 WhatsApp para Confirmación
                            </label>
                            <input
                                type="text"
                                name="whatsappNumber"
                                value={data.whatsappNumber || ''}
                                onChange={handleChange}
                                placeholder="5215555555555"
                                style={{ width: '100%', padding: '0.8rem', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#FAFAF9', fontSize: '0.85rem' }}
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', color: '#111827', fontWeight: 700 }}>Personalización</h3>



                        {/* Theme Selector */}
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ marginBottom: '1rem', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Palette size={16} /> Paleta de Colores
                            </label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '1rem' }}>
                                {THEMES.map(theme => (
                                    <button
                                        key={theme.id}
                                        onClick={() => onChange('theme', theme.id)}
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            padding: '0.5rem',
                                            borderRadius: '8px',
                                            backgroundColor: data.theme === theme.id ? '#f0f0f0' : 'transparent',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        <div style={{
                                            width: '50px',
                                            height: '50px',
                                            borderRadius: '50%',
                                            backgroundColor: theme.color,
                                            border: data.theme === theme.id ? '3px solid #333' : '1px solid #ddd',
                                            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                                            position: 'relative'
                                        }}>
                                            {data.theme === theme.id && (
                                                <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                                                    <Check size={16} strokeWidth={3} />
                                                </div>
                                            )}
                                        </div>
                                        <span style={{ fontSize: '0.8rem', color: '#666' }}>{theme.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Font Selector */}
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ marginBottom: '1rem', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Type size={16} /> Tipografía
                            </label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                {FONTS.map(font => (
                                    <button
                                        key={font.id}
                                        onClick={() => onChange('font', font.id)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '1rem',
                                            borderRadius: '8px',
                                            border: data.font === font.id ? '2px solid #2D2A26' : '1px solid #eee',
                                            backgroundColor: data.font === font.id ? '#FAFAF9' : '#fff',
                                            cursor: 'pointer',
                                            textAlign: 'left',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        <span style={{ fontFamily: font.family, fontSize: '1.2rem' }}>{font.name}</span>
                                        {data.font === font.id && <Check size={18} color="#2D2A26" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="tips" style={{ padding: '1rem', backgroundColor: '#f0f7ff', borderRadius: '8px', fontSize: '0.9rem', color: '#0056b3', border: '1px solid #cce5ff' }}>
                            <strong>Tip de Diseño:</strong> La tipografía seleccionada cambiará los títulos principales y nombres.
                        </div>
                    </>
                )}
            </div>
        </div >
    );
};

export default EditorPanel;
