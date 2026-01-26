import React from 'react';
import { Search, Upload, Filter, Repeat } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ExploreDesigns: React.FC = () => {
    const { colors, theme } = useTheme();
    // Mock Data for Designs
    const designs = [
        { id: 1, title: 'Simple Border', artist: 'Raven Dubai', colors: ['#D4AF37', '#E6BEAE', '#B5C99A', '#A0C4FF', '#FCA5A5'], image: 'https://images.unsplash.com/photo-1607153721382-72c67295af36?auto=format&fit=crop&w=400&q=80' },
        { id: 2, title: 'Languages of Peace', artist: 'Javier Alexander', colors: ['#D4AF37', '#E5E7EB', '#4B5563', '#9CA3AF'], image: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=400&q=80' },
        { id: 3, title: 'Add my own design', artist: 'Custom', colors: [], isCustom: true },
        { id: 4, title: 'Foil Bow', artist: 'Dolan', colors: ['#92400E', '#B45309', '#F59E0B', '#10B981', '#3B82F6'], image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80' },
        { id: 5, title: 'Merry Christmas', artist: 'Holiday Collection', colors: ['#EF4444', '#10B981', '#F59E0B'], image: 'https://images.unsplash.com/photo-1576777647209-e8733d7b851d?auto=format&fit=crop&w=400&q=80' },
        { id: 6, title: 'Very Merry', artist: 'Signature Style', colors: ['#DC2626', '#FFFFFF'], image: 'https://images.unsplash.com/photo-1513297887119-d46091b24bfa?auto=format&fit=crop&w=400&q=80' },
    ];

    return (
        <div style={{ padding: '2rem 3rem', fontFamily: "'Montserrat', sans-serif", maxWidth: '1400px', margin: '0 auto', color: colors.text }}>

            {/* Header / Search Bar */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', alignItems: 'center' }}>
                <button style={{
                    backgroundColor: '#57B07B', color: 'white', border: 'none',
                    padding: '0.8rem 1.5rem', borderRadius: '4px', cursor: 'pointer',
                    fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap'
                }}>
                    Ver colecciones ▼
                </button>

                <div style={{ flex: 1, position: 'relative' }}>
                    <input
                        type="text"
                        placeholder="Buscar diseños..."
                        style={{
                            width: '100%', padding: '0.8rem 1rem 0.8rem 2.5rem',
                            border: `1px solid ${colors.border}`, borderRadius: '4px',
                            fontSize: '0.9rem', backgroundColor: colors.cardBg, color: colors.text
                        }}
                    />
                    <Search size={18} color={colors.muted} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }} />
                </div>

                <button style={{
                    backgroundColor: 'white', color: '#57B07B', border: '1px solid #57B07B',
                    padding: '0.8rem 1.5rem', borderRadius: '4px', cursor: 'pointer',
                    fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap',
                    display: 'flex', alignItems: 'center', gap: '0.5rem'
                }}>
                    <Upload size={16} /> Subir mi propia foto
                </button>
            </div>

            {/* Filters Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <button style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    background: 'none', border: `1px solid ${colors.border}`, borderRadius: '4px',
                    padding: '0.5rem 1rem', color: colors.muted, fontWeight: 500, cursor: 'pointer'
                }}>
                    <Filter size={16} /> Filtros
                </button>
                <span style={{ fontSize: '0.9rem', color: colors.muted, fontStyle: 'italic' }}>
                    Se encontraron {designs.length} diseños
                </span>
            </div>

            {/* Category Title */}
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: colors.text, margin: '0 0 1rem' }}>
                    Holiday Cards
                </h2>
                <p style={{ color: colors.muted, fontSize: '0.95rem', lineHeight: '1.6', maxWidth: '800px' }}>
                    Cheerful, joyful, merry, and bright, send holiday wishes that are sure to delight.
                    With designer greeting collections ranging in styles from simple to elegant,
                    from rustic to sophisticated, personalize a card with your warmest season's greetings.
                </p>
            </div>

            {/* Designs Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '2.5rem'
            }}>
                {designs.map(design => (
                    <div key={design.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {/* Preview */}
                        <div style={{ marginBottom: '1rem', width: '100%', position: 'relative', cursor: 'pointer' }}>
                            <div style={{
                                position: 'absolute', top: '-25px', left: '50%', transform: 'translateX(-50%)',
                                display: 'flex', alignItems: 'center', gap: '0.3rem',
                                color: '#9CA3AF', fontSize: '0.75rem'
                            }}>
                                <Repeat size={12} /> Compatible con reverso
                            </div>

                            <div style={{
                                width: '100%', aspectRatio: '0.75',
                                backgroundColor: design.isCustom ? colors.cardBg : (theme === 'dark' ? colors.cardBg : '#F3F4F6'),
                                borderRadius: '2px',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                                border: design.isCustom ? '2px solid #10B981' : 'none',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                overflow: 'hidden'
                            }}>
                                {design.isCustom ? (
                                    <div style={{ textAlign: 'center', color: '#10B981' }}>
                                        <div style={{ border: '2px solid #10B981', borderRadius: '50%', padding: '4px', display: 'inline-flex', marginBottom: '0.5rem' }}>
                                            <Upload size={16} />
                                        </div>
                                        <div style={{ fontWeight: 600 }}>Add my own<br />design here</div>
                                    </div>
                                ) : (
                                    <img src={design.image} alt={design.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                )}
                            </div>
                        </div>

                        {/* Info */}
                        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: colors.text, margin: '0 0 0.2rem' }}>{design.title}</h3>
                        <p style={{ fontSize: '0.8rem', color: colors.muted, margin: '0 0 0.8rem' }}>{design.artist}</p>

                        {/* Color Bubbles */}
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {design.colors.map((c, i) => (
                                <div key={i} style={{
                                    width: '12px', height: '12px', borderRadius: '50%',
                                    backgroundColor: c, border: c === '#FFFFFF' ? '1px solid #E5E7EB' : 'none',
                                    cursor: 'pointer'
                                }}></div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default ExploreDesigns;
