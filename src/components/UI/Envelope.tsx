import React, { useState } from 'react';
import { Heart } from 'lucide-react';

interface EnvelopeProps {
    onOpen: () => void;
    senderName?: string;
    type?: 'classic' | 'pointed' | 'square' | 'rounded';
    material?: 'paper' | 'linen' | 'velvet' | 'cardstock';
    color?: string;
    finish?: 'matte' | 'glossy' | 'metallic';
}

const Envelope: React.FC<EnvelopeProps> = ({
    onOpen,
    senderName,
    type = 'classic',
    material = 'paper',
    color = '#F5E6D3',
    finish = 'matte'
}) => {
    const [step, setStep] = useState<'front' | 'flipping' | 'back' | 'opening' | 'extracting' | 'revealing' | 'done'>('front');

    // Animation Sequence
    const handleClick = () => {
        if (step !== 'front') return;

        // 1. Flip Envelope
        setStep('flipping');
        setTimeout(() => {
            setStep('back');

            // 2. Open Flap (after short pause)
            setTimeout(() => {
                setStep('opening');

                // 3. Extract Letter
                setTimeout(() => {
                    setStep('extracting');

                    // 4. Reveal/Flip Letter
                    setTimeout(() => {
                        setStep('revealing');

                        // 5. Finish
                        setTimeout(() => {
                            setStep('done');
                            // Wait for the opacity transition (1.5s) to mostly complete before unmounting
                            setTimeout(() => {
                                onOpen();
                            }, 1200);
                        }, 1500); // Time for final read/fade
                    }, 1500); // Slide duration
                }, 800); // Flap opening duration
            }, 500); // Pause after flip
        }, 1200); // Flip duration
    };

    // Textures
    const getTexture = () => {
        switch (material) {
            case 'linen': return 'repeating-linear-gradient(45deg, rgba(0,0,0,0.02) 0px, rgba(0,0,0,0.02) 2px, transparent 2px, transparent 4px)';
            case 'velvet': return 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.1) 100%)';
            case 'cardstock': return 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuMDIiLz4KPC9zdmc+")';
            default: return 'none';
        }
    };

    const getFinish = () => {
        switch (finish) {
            case 'glossy': return 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0) 100%)';
            case 'metallic': return 'linear-gradient(45deg, rgba(255,255,255,0) 40%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 60%)';
            default: return 'none';
        }
    };

    const getFlapPath = () => {
        switch (type) {
            case 'pointed': return 'polygon(0 0, 50% 100%, 100% 0)';
            case 'square': return 'polygon(0 0, 0 100%, 100% 100%, 100% 0)';
            case 'rounded': return 'ellipse(80% 100% at 50% 0)';
            default: return 'polygon(0 0, 50% 65%, 100% 0)';
        }
    };

    const flapHeight = type === 'pointed' ? '55%' : type === 'square' ? '45%' : '50%';

    // Animation States
    const isFlipped = step !== 'front';
    const isOpening = ['opening', 'extracting', 'revealing', 'done'].includes(step);
    const isExtracting = ['extracting', 'revealing', 'done'].includes(step);
    const isRevealing = ['revealing', 'done'].includes(step);
    const isDone = step === 'done';

    return (
        <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#2D2A26',
            zIndex: 1000,
            transition: 'all 1.5s cubic-bezier(0.19, 1, 0.22, 1) 0.5s', // Smooth slide up
            opacity: isDone ? 0 : 1,
            transform: isDone ? 'translateY(-100%)' : 'translateY(0)',
            pointerEvents: isDone ? 'none' : 'auto',
            perspective: '1500px' // Essential for 3D
        }}>
            <div
                onClick={handleClick}
                style={{
                    width: 'min(90%, 500px)',
                    aspectRatio: '1.5/1',
                    position: 'relative',
                    cursor: 'pointer',
                    transformStyle: 'preserve-3d',
                    transition: 'transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
            >
                {/* === FRONT FACE (Names) === */}
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundColor: color,
                    backgroundImage: `${getFinish()}, ${getTexture()}`,
                    backgroundBlendMode: 'overlay',
                    borderRadius: '4px',
                    backfaceVisibility: 'hidden', // Hide when flipped
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                    zIndex: 20
                }}>
                    <div style={{ border: '1px solid rgba(0,0,0,0.1)', width: '90%', height: '90%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <h2 style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: 'clamp(1.2rem, 5vw, 1.8rem)',
                            color: '#5D4037',
                            textAlign: 'center',
                            margin: 0
                        }}>
                            {senderName || 'Invitación'}
                        </h2>
                    </div>
                </div>

                {/* === BACK FACE (Flap & Letter) === */}
                <div style={{
                    position: 'absolute', inset: 0,
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)', // Pre-flipped
                    transformStyle: 'preserve-3d',
                    zIndex: 10
                }}>
                    {/* The Envelope Box (Backside) */}
                    <div style={{
                        position: 'absolute', inset: 0,
                        backgroundColor: color,
                        backgroundImage: `${getFinish()}, ${getTexture()}`,
                        backgroundBlendMode: 'overlay',
                        borderRadius: '4px',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                    }}>
                        {/* Letter Container (Inside) */}
                        <div style={{
                            position: 'absolute', inset: 0, overflow: 'visible',
                            display: 'flex', justifyContent: 'center'
                        }}>
                            {/* THE LETTER */}
                            <div style={{
                                width: '90%', height: '90%',
                                backgroundColor: '#FAF7F2',
                                backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23noise)\' opacity=\'0.08\'/%3E%3C/svg%3E")',
                                borderRadius: '2px',
                                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                                position: 'absolute',
                                top: '5%',
                                transition: 'all 1.5s cubic-bezier(0.25, 1, 0.5, 1)',
                                transform: isExtracting
                                    ? (isRevealing ? 'translateY(-220px) rotateY(180deg) scale(1.1)' : 'translateY(-150px)')
                                    : 'translateY(0)',
                                zIndex: 5,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                backfaceVisibility: 'visible' // Allow seeing both sides if we wanted, or hidden
                            }}>
                                {/* Letter Content - Front (Hidden initially if we rotate?) 
                                    Wait, if we rotateY(180deg) the letter, we see its "back" if backface is visible.
                                    Let's assume the letter starts "facing in" (so we see its back). 
                                    No, usually letters face out.
                                    The user wants "la carta gire para abirse". 
                                    Let's make it spin. 
                                */}
                                <div style={{
                                    padding: '1rem', textAlign: 'center', border: '1px solid #D4AF37', width: '85%', height: '85%',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                    transition: 'opacity 0.5s',
                                    opacity: isRevealing ? 1 : 0.5 // Dim until revealed
                                }}>
                                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '0.8rem', color: '#888' }}>LEER INVITACIÓN</span>
                                </div>
                            </div>
                        </div>

                        {/* Pocket/Fold */}
                        <div style={{
                            position: 'absolute', bottom: 0, left: 0, right: 0, top: 0,
                            clipPath: 'polygon(0 0, 50% 50%, 100% 0, 100% 100%, 0 100%)',
                            backgroundColor: color,
                            backgroundImage: `${getFinish()}, ${getTexture()}`,
                            filter: 'brightness(1.02)',
                            zIndex: 15,
                            pointerEvents: 'none'
                        }}></div>

                        {/* Shadow Gradient on Pocket */}
                        <div style={{
                            position: 'absolute', bottom: 0, left: 0, right: 0, top: 0,
                            clipPath: 'polygon(0 0, 50% 50%, 100% 0, 100% 100%, 0 100%)',
                            background: 'linear-gradient(to top, rgba(0,0,0,0.1), transparent)',
                            zIndex: 16,
                            pointerEvents: 'none'
                        }}></div>
                    </div>

                    {/* Top Flap */}
                    <div style={{
                        position: 'absolute', top: 0, left: 0, width: '100%', height: flapHeight,
                        backgroundColor: color,
                        backgroundImage: `${getFinish()}, ${getTexture()}`,
                        filter: 'brightness(0.95)',
                        clipPath: getFlapPath(),
                        transformOrigin: 'top',
                        transform: isOpening ? 'rotateX(180deg)' : 'rotateX(0deg)',
                        transition: 'transform 0.8s ease-in-out',
                        zIndex: 20,
                        backfaceVisibility: 'hidden'
                    }}></div>

                    {/* Wax Seal */}
                    <div style={{
                        position: 'absolute', top: type === 'square' ? '45%' : '40%', left: 'calc(50% - 25px)',
                        width: '50px', height: '50px',
                        backgroundColor: '#C41E3A', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.3)', border: '2px solid rgba(0,0,0,0.1)',
                        zIndex: 25,
                        transition: 'opacity 0.5s',
                        opacity: isOpening ? 0 : 1,
                        pointerEvents: 'none'
                    }}>
                        <Heart color="#fff" size={24} fill="#fff" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Envelope;
