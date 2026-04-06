import React, { useState } from 'react';
import { Heart } from 'lucide-react';

interface EnvelopeProps {
    onOpen: () => void;
    senderName?: string;
    type?: 'classic' | 'pointed' | 'square' | 'rounded';
    material?: 'paper' | 'linen' | 'velvet' | 'cardstock' | 'vintage';
    color?: string;
    finish?: 'matte' | 'glossy' | 'metallic';
    liner?: {
        type: 'color' | 'image' | 'upload';
        value: string;
    };
    stamp?: {
        enabled: boolean;
        url?: string;
    };
    seal?: {
        enabled: boolean;
        color: string;
        text?: string;
    };
    initialStep?: 'front' | 'flipping' | 'back' | 'opening' | 'extracting' | 'revealing' | 'done';
    hideContent?: boolean; // New prop to hide card
    children?: React.ReactNode;
}

const Envelope: React.FC<EnvelopeProps> = ({
    onOpen,
    senderName,
    type = 'classic',
    material = 'paper',
    color = '#F5E6D3',
    finish = 'matte',
    liner,
    stamp,
    seal,
    initialStep = 'front',
    hideContent = false,
    children
}) => {
    const [step, setStep] = useState<'front' | 'flipping' | 'back' | 'opening' | 'extracting' | 'revealing' | 'done'>(initialStep);

    // Update step if initialStep changes (for controlled preview)
    React.useEffect(() => {
        if (initialStep === step) return;

        // Sequence: Front -> Opening (Flip first, then open flap)
        if (step === 'front' && initialStep === 'opening') {
            setStep('back'); // Start by showing back (trigger flip)
            const timer = setTimeout(() => {
                setStep('opening'); // Then open the flap
            }, 500); // Halfway through flip
            return () => clearTimeout(timer);
        }

        // Sequence: Opening -> Front (Close flap first, then flip front)
        if ((step === 'opening' || step === 'done' || step === 'revealing') && initialStep === 'front') {
            setStep('back'); // Close flap first
            const timer = setTimeout(() => {
                setStep('front'); // Then flip to front
            }, 400);
            return () => clearTimeout(timer);
        }

        // Direct update for other cases
        setStep(initialStep);
    }, [initialStep]);

    // -- TEXTURE & FINISH HELPERS --
    // Wall/Plaster Texture: Fractal Noise to simulate "wall imperfections"
    const texture = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.3'/%3E%3C/svg%3E")`;

    const getFinishOverlay = () => {
        switch (finish) {
            case 'glossy': return 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 45%, rgba(255,255,255,0) 100%)';
            case 'metallic': return 'linear-gradient(45deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 70%)';
            default: return 'none'; // Matte is default, no extra shine
        }
    };

    const getFlapClipPath = () => {
        switch (type) {
            case 'pointed': return 'polygon(0 0, 50% 85%, 100% 0)'; // Deep point
            case 'square': return 'polygon(0 0, 0 65%, 100% 65%, 100% 0)'; // Rectangular (exceeds 62%)
            case 'rounded': return 'circle(90% at 50% 0)'; // Rounded
            default: return 'polygon(0 0, 50% 70%, 100% 0)'; // Classic point (70% > 62% pocket dip) ensures overlap
        }
    };

    // Animation Sequence
    const handleClick = () => {
        if (step !== 'front') return;
        setStep('flipping');

        // Realistic timing sequence
        setTimeout(() => setStep('back'), 1500);
        setTimeout(() => setStep('opening'), 2200);
        setTimeout(() => setStep('extracting'), 3200);
        setTimeout(() => setStep('revealing'), 4500);
        setTimeout(() => {
            setStep('done');
            setTimeout(onOpen, 1000);
        }, 8000);
    };

    const isFlipped = step !== 'front';
    const isOpening = ['opening', 'extracting', 'revealing', 'done'].includes(step);
    const isExtracting = ['extracting', 'revealing', 'done'].includes(step);
    const isRevealing = ['revealing', 'done'].includes(step);
    const isDone = step === 'done';

    // Base Style
    const finishOverlay = getFinishOverlay();

    const paperStyle: React.CSSProperties = {
        backgroundColor: color,
        backgroundImage: texture,
        backgroundBlendMode: 'multiply', // Using soft-light/multiply for textures to blend naturally
        position: 'absolute',
        boxShadow: 'inset 0 0 40px rgba(0,0,0,0.06)', // Softer vignette
    };

    // Shine overlay style
    const shineStyle: React.CSSProperties = {
        position: 'absolute', inset: 0,
        backgroundImage: finishOverlay,
        pointerEvents: 'none',
        mixBlendMode: 'screen', // Better for gloss
        zIndex: 2
    };

    // Dynamic coloring fix for dark inputs
    const isDarkColor = (colorCode: string) => {
        // Default to false if no color
        if (!colorCode) return false;

        // Handle standard CSS names if needed? ideally hex
        if (!colorCode.startsWith('#')) return false;

        const hex = colorCode.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        // YIQ equation
        const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return yiq < 128;
    };

    const isDark = isDarkColor(color || '#F5E6D3');
    const textColor = isDark ? 'rgba(255,255,255,0.9)' : (material === 'vintage' ? '#5D4037' : '#333');
    const secondaryTextColor = isDark ? 'rgba(255,255,255,0.6)' : '#777';
    const textBlendMode = isDark ? 'normal' : 'multiply';
    const textShadow = isDark ? '0 1px 2px rgba(0,0,0,0.5)' : '0 1px 0 rgba(255,255,255,0.6)';

    return (
        <div
            onClick={handleClick}
            style={{
                position: 'absolute', inset: 0, zIndex: 1000,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: '#000', // Solid Black as requested
                // backdropFilter removed to prevent 3D flattening issues
                opacity: isDone ? 0 : 1,
                pointerEvents: isDone ? 'none' : 'auto',
                cursor: step === 'front' ? 'pointer' : 'default', // Cursor pointer on whole screen
                transition: 'opacity 1s ease-out',
                perspective: '1500px'
            }}>
            <div
                style={{
                    width: 'min(90vw, 550px)',
                    aspectRatio: '1.6/1',
                    position: 'relative',
                    transformStyle: 'preserve-3d',
                    transition: 'transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: isFlipped
                        ? `rotateY(180deg) ${isOpening ? 'rotateX(5deg)' : ''} ${isRevealing ? 'translateY(250px)' : (isOpening ? 'translateY(20px) translateZ(10px)' : '')}`
                        : 'rotateY(0deg) rotateX(0deg) rotateZ(0deg)'
                }}
            >
                {/* === FRONT FACE (Address Side) === */}
                <div style={{
                    position: 'absolute', inset: 0,
                    backfaceVisibility: 'hidden',
                    zIndex: 2,
                    borderRadius: '3px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.15), 0 5px 15px rgba(0,0,0,0.05)',
                    // Positive Z sends it towards user (World +Z)
                    transform: 'rotateY(0deg) translateZ(2px)',
                    backgroundColor: color || '#F5E6D3',
                }}>
                    {/* Opaque Blocker using color (prevents blend mode bleed) */}
                    <div style={{ position: 'absolute', inset: 0, backgroundColor: color || '#F5E6D3', borderRadius: '3px' }}></div>

                    {/* Texture Layer */}
                    <div style={{
                        ...paperStyle,
                        inset: 0,
                        zIndex: 1,
                        opacity: 0.5, // Reduced opacity so it's a texture, not a pattern
                        mixBlendMode: 'multiply' // Multiply burns the texture into the color like ink/stucco
                    }}></div>

                    <div style={shineStyle}></div>
                    <div style={{
                        border: `1px solid ${isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)'}`, // Increased border visibility
                        width: '92%', height: '88%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexDirection: 'column',
                        zIndex: 10, position: 'relative',
                        boxShadow: 'inset 0 0 10px rgba(0,0,0,0.05)' // Subtle inset for depth
                    }}>
                        {/* CUSTOM STAMP */}
                        {stamp?.enabled && stamp.url ? (
                            <div style={{
                                position: 'absolute', top: '10px', right: '10px',
                                width: '60px', height: '70px',
                                backgroundImage: `url(${stamp.url})`,
                                backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center',
                                filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.2))',
                                transform: 'rotate(2deg)'
                            }}></div>
                        ) : (
                            /* Default Fake Stamp/Postmark if no custom stamp */
                            <div style={{
                                position: 'absolute', top: '15px', right: '15px',
                                width: '50px', height: '60px',
                                border: `1px dashed ${secondaryTextColor}`,
                                opacity: 0.5,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '0.6rem', color: secondaryTextColor,
                                transform: 'rotate(-5deg)'
                            }}>
                                STAMP
                            </div>
                        )}

                        <h2 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
                            color: textColor,
                            margin: 0, opacity: 0.9,
                            textShadow: textShadow,
                            mixBlendMode: textBlendMode as any
                        }}>
                            {senderName || 'Para ti'}
                        </h2>
                        <div style={{
                            fontFamily: 'monospace', fontSize: '0.75rem',
                            color: secondaryTextColor,
                            marginTop: '1rem', letterSpacing: '4px', textTransform: 'uppercase',
                            borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.3)' : '#aaa'}`,
                            paddingTop: '0.5rem',
                            mixBlendMode: textBlendMode as any
                        }}>
                            Entrega Especial
                        </div>
                    </div>
                </div>

                {/* === BACK FACE (Flap Side) === */}
                <div style={{
                    position: 'absolute', inset: 0,
                    // Rotate 180. Positive Z here means Local +Z, which is World -Z (Away from user)
                    // This correct separates Front (World +2) and Back (World -2) by 4px.
                    transform: 'rotateY(180deg) translateZ(2px)',
                    transformStyle: 'preserve-3d',
                    backfaceVisibility: 'hidden',
                    zIndex: 1,
                    backgroundColor: color || '#F5E6D3',
                }}>
                    {/* Opaque Blocker */}
                    <div style={{ position: 'absolute', inset: 0, backgroundColor: color || '#F5E6D3', borderRadius: '3px', backfaceVisibility: 'hidden' }}></div>

                    {/* Realistic Shadow beneath for when it opens */}
                    <div style={{
                        position: 'absolute', inset: '20px', background: 'rgba(0,0,0,0.2)', filter: 'blur(30px)', transform: 'translateZ(-50px)'
                    }}></div>

                    {/* Envelope Body (Exterior Back) - Becomes visible as "Inside" when top flap opens */}
                    <div style={{
                        ...paperStyle,
                        inset: 0,
                        borderRadius: '3px',
                        zIndex: 1,
                        backfaceVisibility: 'hidden',
                        // Deeper Inner Shadow
                        boxShadow: 'inset 0 10px 40px rgba(0,0,0,0.2)',
                    }}>
                        {/* FOLD CREASE: Gradient to simulate a physical groove */}
                        <div style={{
                            position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
                            background: 'linear-gradient(to bottom, rgba(0,0,0,0.15), transparent)',
                            zIndex: 2
                        }}></div>
                        <div style={shineStyle}></div>
                    </div>

                    {/* CARD / LETTER - Hidden if hideContent is true */}
                    {!hideContent && (
                        <div style={{
                            position: 'absolute',
                            left: '4%', right: '4%',
                            top: '4%', bottom: '4%',
                            zIndex: 5,
                            transformStyle: 'preserve-3d',
                            // Hide card COMPLETELY until opening starts to prevent "seeing through"
                            opacity: isOpening ? 1 : 0,
                            transition: 'opacity 0.2s ease-in, transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)', // Fade in quickly on open
                            transform: isExtracting
                                ? (isRevealing
                                    ? 'translateY(-250px) translateZ(200px) rotateX(0deg) rotateY(180deg) scale(1.15)' // FLIP HERE
                                    : 'translateY(-60%) translateZ(10px)')
                                : 'translateY(0) translateZ(2px)',
                        }}>
                            {/* Card Container (Double Sided) */}
                            <div style={{
                                position: 'relative', width: '100%', height: '100%',
                                transformStyle: 'preserve-3d',
                            }}>
                                {/* Card BACK (Design/KP - Visible initially when envelope is Back-facing) */}
                                <div style={{
                                    position: 'absolute', inset: 0,
                                    backgroundColor: '#e6dfd5',
                                    backgroundImage: `repeating-linear-gradient(45deg, rgba(0,0,0,0.02) 0px, rgba(0,0,0,0.02) 2px, transparent 2px, transparent 4px), ${texture}`,
                                    backfaceVisibility: 'hidden',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    // FIX: This must be 180deg so that (180+180 = 360) it faces the viewer initially
                                    transform: 'rotateY(180deg)',
                                    borderRadius: '2px',
                                    // Sharper Border
                                    border: '1px solid rgba(0,0,0,0.2)',
                                    boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)'
                                }}>
                                    {/* Opaque Blocker */}
                                    <div style={{ position: 'absolute', inset: 0, backgroundColor: '#e6dfd5', borderRadius: '2px', backfaceVisibility: 'hidden' }}></div>

                                    <div style={{
                                        width: '50px', height: '50px',
                                        border: '2px solid rgba(0,0,0,0.2)',
                                        borderRadius: '50%',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: 'rgba(0,0,0,0.4)', fontWeight: 'bold', fontFamily: 'serif',
                                        zIndex: 2, transform: 'translateZ(1px)' // Pop out
                                    }}>
                                        {senderName
                                            ? senderName.split('&').map(n => n.trim()[0]).join('')
                                            : 'KP'}
                                    </div>
                                </div>

                                {/* Card FRONT (Content - Hidden initially, revealed after flip) */}
                                <div style={{
                                    position: 'absolute', inset: 0,
                                    backgroundColor: '#fff',
                                    backfaceVisibility: 'hidden',
                                    // FIX: This must be 0deg so that (0+180 = 180) it faces AWAY initially
                                    transform: 'rotateY(0deg)',
                                    borderRadius: '2px',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                    // Subtle border for definition
                                    border: '1px solid rgba(0,0,0,0.1)',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                                }}>
                                    <div style={{
                                        width: '100%', height: '100%',
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        {children ? children : (
                                            <div style={{ padding: '2rem', textAlign: 'center' }}>
                                                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', color: '#333' }}>Invitación</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}


                    {/* Side/Bottom Flaps (Pocket) */}
                    <div style={{
                        ...paperStyle,
                        clipPath: 'polygon(0 100%, 100% 100%, 100% 38%, 50% 62%, 0 38%)',
                        inset: 0,
                        zIndex: 10,
                        // Add a gradient to simulate the shadow cast by the top flap
                        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.05), transparent 20%), ${texture}`,
                        transform: 'translateZ(10px)',
                        // Much sharper/darker drop shadow for clearer definition
                        filter: 'contrast(1.1) drop-shadow(0 -4px 6px rgba(0,0,0,0.4))', // Increased contrast and shadow
                        backfaceVisibility: 'hidden',
                        borderTop: '1px solid rgba(0,0,0,0.15)' // Subtle border to define the edge
                    }}>
                        <div style={{
                            position: 'absolute', top: '38%', left: 0, right: 0, height: '1px',
                            background: 'rgba(0,0,0,0.1)', // Subtle rim line
                            zIndex: 2
                        }}></div>
                        <div style={{ ...shineStyle, opacity: 0.5 }}></div>
                    </div>


                    {/* Top Flap */}
                    <div style={{
                        ...paperStyle,
                        height: '100%', width: '100%', top: 0, left: 0,
                        clipPath: getFlapClipPath(),
                        transformOrigin: 'top',
                        transform: isOpening ? 'rotateX(180deg)' : 'rotateX(0deg)',
                        transition: 'transform 0.9s cubic-bezier(0.4, 0, 0.2, 1)',
                        zIndex: 20,
                        // High contrast shadow for the main flap
                        backfaceVisibility: 'hidden',
                        // High contrast shadow for the main flap + border for definition
                        filter: `${isOpening ? 'brightness(0.95)' : 'brightness(1.02)'} drop-shadow(0 6px 12px rgba(0,0,0,0.5))`,
                        borderBottom: '1px solid rgba(0,0,0,0.15)' // Defined edge for the flap
                    }}>
                        <div style={shineStyle}></div>

                        {/* WAX SEAL */}
                        {(seal?.enabled !== false) && (
                            <div style={{
                                position: 'absolute',
                                top: '40%',
                                left: 'calc(50% - 22px)',
                                width: '45px', height: '45px',
                                background: seal?.color
                                    ? `radial-gradient(circle at 35% 35%, ${seal.color}, ${adjustColor(seal.color, -40)})`
                                    : 'radial-gradient(circle at 35% 35%, #D73838, #8B0000)',
                                borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '1px 3px 6px rgba(0,0,0,0.3)',
                                zIndex: 25,
                                opacity: isOpening ? 0 : 1,
                                transition: 'opacity 0.3s',
                                transform: 'translateZ(2px)'
                            }}>
                                {/* Realistic Seal Ring */}
                                <div style={{
                                    position: 'absolute', inset: '4px', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%'
                                }}></div>
                                {seal?.text ? (
                                    <span style={{
                                        color: 'rgba(255,255,255,0.9)',
                                        fontFamily: 'serif',
                                        fontSize: '1.2rem',
                                        fontWeight: 'bold',
                                        textShadow: '0 1px 1px rgba(0,0,0,0.5)'
                                    }}>
                                        {seal.text}
                                    </span>
                                ) : (
                                    <Heart size={18} color="rgba(255,255,255,0.9)" fill="rgba(255,255,255,0.15)" />
                                )}
                            </div>
                        )}
                    </div>

                    {/* Inner Liner (Visible when flap opens) */}
                    <div style={{
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '52%',
                        backgroundColor: (liner?.type === 'color' && liner.value) ? liner.value : '#FEFCF5', // Creamy white default
                        opacity: 1,
                        clipPath: 'polygon(0 0, 50% 50%, 100% 0)',
                        zIndex: 0,
                        transform: 'translateZ(-1px)',
                        // Liner pattern (only if not image)
                        backgroundImage: (liner?.type === 'image' || liner?.type === 'upload') && liner.value
                            ? `url(${liner.value})`
                            : (liner?.type === 'color' ? 'none' : `repeating-linear-gradient(90deg, transparent, transparent 19px, rgba(0,0,0,0.03) 20px), linear-gradient(to bottom, #fff, #f0f0f0)`),
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}></div>
                </div>
            </div>
        </div>
    );
};

// Helper for darkening colors for gradients
function adjustColor(color: string, amount: number) {
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
}

export default Envelope;
