import React, { useState } from 'react';
import { Type, Palette, PenTool, Image as ImageIcon, Check, Music, Image, Upload } from 'lucide-react';
import { resizeImage } from '../utils';
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

// Helper for URL processing (Shared)
const processImageUrl = (val: string) => {
    let finalUrl = val;

    // 0. Start by checking for folders - DO NOT convert these so the UI can warn the user!
    if (val.includes('/folders/')) {
        return val;
    }

    // 1. Google Drive (Drive & Docs)
    // 1. Google Drive (Drive & Docs)
    // We look for 'google.com' to include drive.google.com, docs.google.com, etc.
    if (val.includes('google.com')) {
        // Pattern A: /file/d/ID/view, /open?id=ID, /uc?id=ID
        // We look for the ID specifically.

        // Try identifying ID by /d/ pattern first (common in share links)
        const dMatch = val.match(/\/d\/([a-zA-Z0-9_-]+)/);
        if (dMatch && dMatch[1]) {
            finalUrl = `https://lh3.googleusercontent.com/d/${dMatch[1]}=w1000`;
        }
        else {
            // Try identifying ID by id= pattern (common in export/open links)
            const idMatch = val.match(/id=([a-zA-Z0-9_-]+)/);
            if (idMatch && idMatch[1]) {
                finalUrl = `https://lh3.googleusercontent.com/d/${idMatch[1]}=w1000`;
            }
        }
    }

    // 2. Dropbox (Convert 'dl=0' to 'raw=1' for direct link)
    if (val.includes('dropbox.com') && val.includes('dl=0')) {
        finalUrl = val.replace('dl=0', 'raw=1');
    }

    // 3. User Feedback for Canva/Pinterest Pages (We can't auto-convert these, but we can help)
    // If it looks like a page but not an image, we accept it but maybe the UI should warn?
    // For now, we return it as is, but specific inputs might check this.

    return finalUrl;
};

// Extracted Component for Reusability and Visibility Assurance
const CoverPhotoSection = ({ data, onChange }: { data: InvitationData, onChange: (field: keyof InvitationData, value: string) => void }) => {

    // Check for common mistakes (Canva/Pinterest page links instead of images)
    const showWarning = (url: string) => {
        if (!url) return false;
        // Canva Page Link (usually no extension, has /design/)
        if (url.includes('canva.com/design')) return 'canva';
        // Pinterest Pin Link (usually no extension, has /pin/)
        if (url.includes('pinterest.com/pin')) return 'pinterest';
        return false;
    };

    const warningType = showWarning(data.imageUrl);

    return (
        <div className="form-group" style={{ marginBottom: '1.5rem', backgroundColor: '#fff', padding: '1.2rem', borderRadius: '12px', border: '2px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '1rem', fontWeight: 700, color: '#1f2937' }}>
                <ImageIcon size={20} className="text-blue-600" style={{ color: '#2563EB' }} />
                Foto de Portada
            </label>

            <p style={{ fontSize: '0.85rem', color: '#4b5563', marginBottom: '0.8rem', lineHeight: '1.4' }}>
                Pega aquí el enlace de tu foto.<br />
                <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>(Soporta Google Drive, Dropbox, o enlaces directos de imagen)</span>
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <input
                    type="text"
                    placeholder="Pegar enlace de imagen..."
                    value={data.imageUrl || ''}
                    onChange={(e) => {
                        const finalUrl = processImageUrl(e.target.value);
                        onChange('imageUrl', finalUrl);
                    }}
                    style={{
                        width: '100%',
                        padding: '1rem',
                        fontSize: '1rem',
                        border: '2px solid #d1d5db',
                        borderRadius: '8px',
                        backgroundColor: warningType ? '#fff7ed' : '#fff',
                        color: typeof warningType === 'string' ? '#c2410c' : '#111827',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                        borderColor: warningType ? '#f97316' : '#d1d5db'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#2563EB'}
                    onBlur={(e) => e.target.style.borderColor = warningType ? '#f97316' : '#d1d5db'}
                />

                {/* Warnings based on URL patterns */}
                {warningType === 'canva' && (
                    <p style={{ fontSize: '0.8rem', color: '#ea580c', backgroundColor: '#fff7ed', padding: '0.5rem', borderRadius: '4px', border: '1px solid #fed7aa', marginTop: '-0.4rem' }}>
                        ⚠️ Has pegado un enlace de <strong>Canva</strong>. <br />
                        Asegúrate de pegar el <strong>"Enlace público de visualización"</strong> o haz clic derecho en la imagen y selecciona <strong>"Copiar dirección de imagen"</strong>.
                    </p>
                )}
                {warningType === 'pinterest' && (
                    <p style={{ fontSize: '0.8rem', color: '#ea580c', backgroundColor: '#fff7ed', padding: '0.5rem', borderRadius: '4px', border: '1px solid #fed7aa', marginTop: '-0.4rem' }}>
                        ⚠️ Has pegado un enlace de <strong>Pinterest</strong>. <br />
                        Por favor, haz clic derecho en la imagen y selecciona <strong>"Copiar dirección de imagen"</strong> (debe terminar en .jpg o .png).
                    </p>
                )}

                <div style={{ display: 'flex', gap: '0.8rem' }}>
                    <button
                        onClick={() => window.open('https://drive.google.com/drive/my-drive', '_blank')}
                        title="Abrir Google Drive en una nueva pestaña"
                        style={{
                            flex: 1,
                            padding: '0.8rem',
                            background: '#eff6ff',
                            color: '#1e40af',
                            border: '1px solid #bfdbfe',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            transition: 'background 0.2s'
                        }}
                    >
                        📂 Abrir Google Drive
                    </button>
                    {data.imageUrl && (
                        <button
                            title="Borrar imagen actual"
                            onClick={() => onChange('imageUrl', '')}
                            style={{
                                padding: '0.8rem 1.2rem',
                                background: '#fef2f2',
                                color: '#b91c1c',
                                border: '1px solid #fecaca',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                fontWeight: 600
                            }}
                        >
                            ✕ Borrar
                        </button>
                    )}
                </div>
            </div>

            {data.imageUrl && (
                <div style={{ marginTop: '1rem', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                    <div style={{ backgroundColor: '#f3f4f6', padding: '0.5rem', fontSize: '0.75rem', color: '#6b7280', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>Vista Previa</div>
                    <img
                        src={data.imageUrl}
                        alt="Vista previa"
                        style={{ width: '100%', height: 'auto', maxHeight: '200px', objectFit: 'cover', display: 'block' }}
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                        }}
                    />
                </div>
            )}
        </div>
    );
};

// Duplicate of CoverPhotoSection but for Background Image (Slideshow Support)
const BackgroundPhotoSection = ({ data, onChange }: { data: InvitationData, onChange: (field: keyof InvitationData, value: any) => void }) => {
    // Ensure we have an array (limit to 3 for performance)
    // DO NOT filter(Boolean) here, or empty inputs will disappear!
    const images = [data.backgroundImageUrl, ...(data.backgroundImages || [])];


    // Check for common mistakes (Canva/Pinterest page links instead of images)
    // Returns index of problematic URL if any
    const getWarningIndex = () => {
        return images.findIndex(url => {
            if (!url) return false;
            if (url.includes('drive.google.com/drive/folders')) return true; // New Check
            if (url.includes('canva.com/design')) return true;
            if (url.includes('pinterest.com/pin')) return true;
            return false;
        });
    };
    const warningIndex = getWarningIndex();

    // Helper to get specific warning message
    const getWarningMessage = (idx: number) => {
        const url = images[idx];
        if (!url) return null;
        if (url.includes('drive.google.com/drive/folders')) {
            return (
                <span>
                    ⚠️ <strong>No puedo leer carpetas enteras de Drive</strong> por seguridad de Google.<br />
                    Por favor, abre la carpeta, copia el enlace de una <strong>foto individual</strong> y pégalo aquí.
                </span>
            );
        }
        if (url.includes('canva.com') || url.includes('pinterest.com')) {
            return (
                <span>
                    ⚠️ Has pegado una <strong>página web</strong>, no una imagen.<br />
                    Haz clic derecho en la foto y elige <strong>"Copiar dirección de imagen"</strong>.
                </span>
            );
        }
        return null;
    };

    const handleAddImage = () => {
        if (images.length >= 3) return;
        const newImages = [...(data.backgroundImages || []), ''];
        onChange('backgroundImages', newImages);
    };

    const handleUpdateImage = (index: number, val: string) => {
        const url = processImageUrl(val);

        if (index === 0) {
            // First image is always backgroundImageUrl
            onChange('backgroundImageUrl', url);
        } else {
            // Subsequent images are in backgroundImages array (index - 1)
            const newArr = [...(data.backgroundImages || [])];
            newArr[index - 1] = url;
            onChange('backgroundImages', newArr);
        }
    };

    const handleRemoveImage = (index: number) => {
        if (index === 0) {
            onChange('backgroundImageUrl', '');
        } else {
            const newArr = (data.backgroundImages || []).filter((_, i) => i !== (index - 1));
            onChange('backgroundImages', newArr);
        }
    };

    return (
        <div className="form-group" style={{ marginBottom: '1.5rem', backgroundColor: '#fff', padding: '1.2rem', borderRadius: '12px', border: '2px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '1rem', fontWeight: 700, color: '#1f2937' }}>
                <Image size={20} className="text-purple-600" style={{ color: '#9333ea' }} />
                Fotos de Fondo (Slideshow)
            </label>

            <p style={{ fontSize: '0.85rem', color: '#4b5563', marginBottom: '0.8rem', lineHeight: '1.4' }}>
                Sube hasta 3 imágenes para crear un fondo dinámico.<br />
                <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>(Se aplicará desenfoque y rotación automática)</span>
            </p>

            {warningIndex !== -1 && (
                <p style={{ fontSize: '0.8rem', color: '#ea580c', backgroundColor: '#fff7ed', padding: '0.5rem', borderRadius: '4px', border: '1px solid #fed7aa', marginBottom: '1rem' }}>
                    {getWarningMessage(warningIndex)}
                </p>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Always show at least one input if empty, or map all existing plus one if < 3 */}
                {(images.length > 0 ? images : ['']).map((url, i) => (
                    <div key={i} style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                type="text"
                                placeholder={`Pegar enlace imagen ${i + 1}...`}
                                value={url || ''}
                                onChange={(e) => handleUpdateImage(i, e.target.value)}
                                style={{
                                    flex: 1,
                                    padding: '0.8rem',
                                    fontSize: '0.9rem',
                                    border: '1px solid #d1d5db',
                                    borderColor: (url && (url.includes('canva.com') || url.includes('pinterest.com') || url.includes('/folders/'))) ? '#f97316' : '#d1d5db',
                                    borderRadius: '8px',
                                    outline: 'none'
                                }}
                            />
                            {url && (
                                <button
                                    onClick={() => handleRemoveImage(i)}
                                    title="Borrar"
                                    style={{
                                        padding: '0 0.8rem', background: '#fef2f2', color: '#b91c1c',
                                        border: '1px solid #fecaca', borderRadius: '8px', cursor: 'pointer'
                                    }}
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                        {url && (
                            <div style={{ width: '100%', height: '80px', borderRadius: '6px', overflow: 'hidden', backgroundColor: '#f3f4f6' }}>
                                <img src={url} alt={`Fondo ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                        )}
                    </div>
                ))}

                {images.length < 3 && images[0] !== '' && (
                    <button
                        onClick={handleAddImage}
                        style={{
                            padding: '0.8rem', background: '#f0f9ff', color: '#0369a1',
                            border: '1px dashed #bae6fd', borderRadius: '8px', cursor: 'pointer',
                            fontSize: '0.9rem', fontWeight: 600
                        }}
                    >
                        + Agregar otra foto al fondo
                    </button>
                )}

                <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.5rem' }}>
                    <button
                        onClick={() => window.open('https://drive.google.com/drive/my-drive', '_blank')}
                        style={{
                            flex: 1, padding: '0.6rem', background: '#f3e8ff', color: '#7e22ce',
                            border: '1px solid #d8b4fe', borderRadius: '8px', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                            fontSize: '0.85rem', fontWeight: 600
                        }}
                    >
                        📂 Abrir Drive
                    </button>
                </div>
            </div>
        </div>
    );
};

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
                            <p style={{ fontSize: '0.9rem', color: '#0C4A6E', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                                Importa aquí todas tus fotos (puedes copiar enlaces de Drive uno por uno) y luego asígnalas fácilmente a donde quieras.
                            </p>

                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                <input
                                    type="text"
                                    placeholder="Pegar enlace de imagen o Drive..."
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            const val = e.currentTarget.value;
                                            if (!val) return;
                                            const finalUrl = processImageUrl(val);
                                            onChange('mediaLibrary', [...(data.mediaLibrary || []), finalUrl] as any);
                                            e.currentTarget.value = '';
                                        }
                                    }}
                                    style={{ flex: 1, padding: '0.8rem', border: '1px solid #CBD5E1', borderRadius: '8px' }}
                                />
                                <input
                                    type="file"
                                    id="media-upload-input"
                                    accept="image/*"
                                    multiple
                                    style={{ display: 'none' }}
                                    onChange={async (e) => {
                                        const files = Array.from(e.target.files || []);
                                        if (files.length === 0) return;

                                        const processPromises = files.map(file => resizeImage(file));

                                        try {
                                            const resizedImages = await Promise.all(processPromises);
                                            onChange('mediaLibrary', [...(data.mediaLibrary || []), ...resizedImages] as any);
                                        } catch (error) {
                                            console.error("Error resizing images", error);
                                            alert("Hubo un error al procesar las imágenes.");
                                        }
                                        e.target.value = ''; // Reset input
                                    }}
                                />
                                <button
                                    onClick={() => document.getElementById('media-upload-input')?.click()}
                                    title="Adjuntar fotos desde tu dispositivo"
                                    style={{ padding: '0 1rem', background: '#fff', border: '1px solid #CBD5E1', borderRadius: '8px', cursor: 'pointer', fontSize: '1.2rem' }}
                                >
                                    <Upload size={20} color="#475569" />
                                </button>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem' }}>
                                {(data.mediaLibrary || []).map((img, idx) => (
                                    <div key={idx} style={{ backgroundColor: '#fff', padding: '0.5rem', borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                        <div style={{ height: '100px', borderRadius: '4px', overflow: 'hidden', marginBottom: '0.5rem', backgroundColor: '#f1f5f9' }}>
                                            <img src={img} alt={`Media ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                                            <button
                                                onClick={() => onChange('imageUrl', img)}
                                                style={{ fontSize: '0.75rem', padding: '0.3rem', background: '#EFF6FF', color: '#1E40AF', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                            >
                                                Usar en Portada
                                            </button>
                                            <button
                                                onClick={() => {
                                                    const current = data.backgroundImages || [];
                                                    if (current.length < 3) onChange('backgroundImages', [...current, img] as any);
                                                    else alert('Máximo 3 imágenes de fondo');
                                                }}
                                                style={{ fontSize: '0.75rem', padding: '0.3rem', background: '#F3E8FF', color: '#6B21A8', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                            >
                                                + Al Fondo
                                            </button>
                                            <button
                                                onClick={() => onChange('gallery', [...(data.gallery || []), img] as any)}
                                                style={{ fontSize: '0.75rem', padding: '0.3rem', background: '#ECFDF5', color: '#065F46', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                            >
                                                + A Galería
                                            </button>
                                            <button
                                                onClick={() => {
                                                    const newLib = (data.mediaLibrary || []).filter((_, i) => i !== idx);
                                                    onChange('mediaLibrary', newLib as any);
                                                }}
                                                style={{ marginTop: '0.2rem', fontSize: '0.7rem', color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'right' }}
                                            >
                                                Borrar
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {(!data.mediaLibrary || data.mediaLibrary.length === 0) && (
                                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: '#64748B', fontSize: '0.9rem', fontStyle: 'italic' }}>
                                        No hay imágenes en tu biblioteca aún upon.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'content' ? (
                    <>
                        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', color: '#111827', fontWeight: 700 }}>Detalles del Evento</h3>

                        {/* --- COVER PHOTO SECTION (CONTENT TAB) --- */}
                        <CoverPhotoSection data={data} onChange={onChange} />

                        {/* Gallery Upload */}
                        <div className="form-group" style={{ marginBottom: '1.5rem', backgroundColor: '#f9f9f9', padding: '1rem', borderRadius: '8px', border: '1px dashed #ddd' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600, color: '#555' }}>
                                <Image size={16} /> Galería de Fotos
                            </label>
                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <input
                                    type="text"
                                    placeholder="Pegar enlace de imagen o Google Drive..."
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === 'Tab') {
                                            if (e.key === 'Tab') e.preventDefault();

                                            const val = e.currentTarget.value;
                                            if (!val) return;

                                            // Detect Googe Drive Folder
                                            if (val.includes('/folders/')) {
                                                alert("⚠️ No puedo leer carpetas completas de Drive por seguridad.\n\nPor favor, abre la carpeta, copia los enlaces de las fotos INDIVIDUALES y pégalos aquí. ¡Yo me encargo de convertirlos!");
                                                return;
                                            }

                                            // Convert Google Drive Links (and others) using shared helper
                                            const finalUrl = processImageUrl(val);

                                            onChange('gallery', [...(data.gallery || []), finalUrl] as any);
                                            e.currentTarget.value = '';

                                            if (e.key === 'Tab') {
                                                e.preventDefault();
                                            }
                                        }
                                    }}
                                    style={{ width: '100%', padding: '0.6rem', fontSize: '0.9rem', border: '1px solid #ddd', borderRadius: '6px' }}
                                />
                            </div>

                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={async (e) => {
                                    const files = Array.from(e.target.files || []);
                                    if (files.length === 0) return;

                                    const readPromises = files.map(file => {
                                        return new Promise<string>((resolve) => {
                                            const reader = new FileReader();
                                            reader.onloadend = () => resolve(reader.result as string);
                                            reader.readAsDataURL(file);
                                        });
                                    });

                                    try {
                                        const newImages = await Promise.all(readPromises);
                                        const currentGallery = data.gallery || [];
                                        onChange('gallery', [...currentGallery, ...newImages] as any);
                                    } catch (error) {
                                        console.error("Error reading images", error);
                                        alert("Error al cargar algunas imágenes.");
                                    }
                                    e.target.value = '';
                                }}
                                style={{ width: '100%', fontSize: '0.9rem' }}
                            />
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                                {data.gallery && data.gallery.map((img, index) => (
                                    <div key={index} style={{ width: '60px', height: '60px', overflow: 'hidden', borderRadius: '4px', position: 'relative' }}>
                                        <img src={img} alt={`Gallery ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <button
                                            onClick={() => {
                                                const newGallery = data.gallery?.filter((_, i) => i !== index);
                                                onChange('gallery', newGallery as any);
                                            }}
                                            style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', borderRadius: '50%', width: '16px', height: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

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
                                    Ejemplo Visual (Opcional)
                                </label>

                                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <input
                                        type="text"
                                        placeholder="Enlace imagen o Google Drive..."
                                        value={data.dressCodeInspirationUrl || ''}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            // Auto-convert Drive Links using shared helper
                                            const finalUrl = processImageUrl(val);
                                            onChange('dressCodeInspirationUrl', finalUrl);
                                        }}
                                        style={{ flex: 1, padding: '0.6rem', fontSize: '0.85rem', border: '1px solid #ddd', borderRadius: '6px' }}
                                    />
                                    <button
                                        onClick={() => window.open('https://drive.google.com/drive/my-drive', '_blank')}
                                        title="Abrir Google Drive para copiar enlace"
                                        style={{
                                            background: '#e8f0fe', color: '#1967d2', border: '1px solid #d2e3fc',
                                            borderRadius: '6px', cursor: 'pointer', padding: '0 0.8rem', fontSize: '1.2rem'
                                        }}
                                    >
                                        📂
                                    </button>
                                </div>

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                onChange('dressCodeInspirationUrl', reader.result as string);
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                    style={{ width: '100%', fontSize: '0.85rem' }}
                                />

                                {data.dressCodeInspirationUrl && (
                                    <div style={{ marginTop: '0.5rem', position: 'relative', width: '100px', height: '100px', borderRadius: '4px', overflow: 'hidden', border: '1px solid #eee' }}>
                                        {data.dressCodeInspirationUrl.startsWith('data:') || data.dressCodeInspirationUrl.match(/\.(jpeg|jpg|gif|png)$/) || data.dressCodeInspirationUrl.includes('googleusercontent') ? (
                                            <img src={data.dressCodeInspirationUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', color: '#999', fontSize: '0.8rem', padding: '0.2rem', textAlign: 'center' }}>
                                                Enlace externo
                                            </div>
                                        )}
                                        <button
                                            onClick={() => onChange('dressCodeInspirationUrl', '')}
                                            style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', borderRadius: '50%', width: '18px', height: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: '1.2rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>Nombre del Lugar (Texto del enlace)</label>
                            <input
                                type="text"
                                name="venueName"
                                value={data.venueName}
                                onChange={handleChange}
                                placeholder="Ej: Hacienda Los Arcángeles"
                                style={{ width: '100%', padding: '0.8rem', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#FAFAF9' }}
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: '1.2rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>Dirección</label>
                            <input
                                type="text"
                                name="venueAddress"
                                value={data.venueAddress}
                                onChange={handleChange}
                                placeholder="Calle 123, Ciudad, País"
                                style={{ width: '100%', padding: '0.8rem', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#FAFAF9' }}
                            />

                            <div style={{ marginTop: '0.8rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                <button
                                    onClick={() => window.open('https://www.google.com/maps', '_blank')}
                                    style={{
                                        flex: 1, padding: '0.6rem', background: '#e3f2fd', color: '#1565c0',
                                        border: '1px solid #bbdefb', borderRadius: '6px', cursor: 'pointer',
                                        fontSize: '0.85rem', fontWeight: 600
                                    }}
                                >
                                    📍 Buscar en Maps
                                </button>
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

                        {/* --- BACKGROUND PHOTO SECTION (NEW) --- */}
                        <div style={{ marginBottom: '2rem' }}>
                            <BackgroundPhotoSection data={data} onChange={onChange} />
                        </div>



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
