import React, { useState } from 'react';

interface CrumpleProps {
    onOpen: () => void;
    children?: React.ReactNode;
}

const CrumpleReveal: React.FC<CrumpleProps> = ({ onOpen, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDone, setIsDone] = useState(false);

    const handleClick = () => {
        if (isOpen) return;
        setIsOpen(true);
        // Animation duration matches CSS transition
        setTimeout(() => {
            setIsDone(true);
            onOpen();
        }, 2000);
    };

    return (
        <div style={{
            position: 'absolute', inset: 0, zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backgroundColor: '#000',
            opacity: isDone ? 0 : 1,
            pointerEvents: isDone ? 'none' : 'auto',
            transition: 'opacity 0.8s ease-out',
            overflow: 'hidden'
        }}>
            {/* SVG Filter for Crumpled Effect */}
            <svg style={{ position: 'absolute', width: 0, height: 0 }}>
                <defs>
                    <filter id="crumple-noise">
                        <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="5" result="noise" />
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale={isOpen ? 0 : 400} xChannelSelector="R" yChannelSelector="G" />
                    </filter>
                </defs>
            </svg>

            <div
                onClick={handleClick}
                style={{
                    cursor: isOpen ? 'default' : 'pointer',
                    width: 'min(90vw, 500px)',
                    aspectRatio: '0.7/1', // Portrait for letter
                    backgroundColor: '#f4f1ea',
                    position: 'relative',
                    transition: 'all 2s cubic-bezier(0.25, 1, 0.5, 1)', // Smooth uncrumple
                    transform: isOpen
                        ? 'scale(1) rotate(0deg)'
                        : 'scale(0.3) rotate(720deg)', // Starts as a small rotated ball
                    filter: isOpen
                        ? 'drop-shadow(0 10px 20px rgba(0,0,0,0.1)) contrast(1)'
                        : 'url(#crumple-noise) drop-shadow(0 20px 30px rgba(0,0,0,0.3)) contrast(1.5) brightness(0.9)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
            >
                {/* Content Container */}
                <div style={{
                    width: '100%', height: '100%',
                    opacity: isOpen ? 1 : 0, // Fade content in as it straightens
                    transition: 'opacity 1s ease 0.5s',
                    overflow: 'hidden',
                    transform: 'scale(1)', // Ensure content is stable
                }}>
                    {children}
                </div>

                {/* Initial "Ball" overlay hints */}
                {!isOpen && (
                    <div style={{
                        position: 'absolute', inset: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#555', fontFamily: 'serif', fontWeight: 'bold', fontSize: '2rem',
                        mixBlendMode: 'multiply', pointerEvents: 'none'
                    }}>
                        Click to Open
                    </div>
                )}
            </div>
        </div>
    );
};

export default CrumpleReveal;
