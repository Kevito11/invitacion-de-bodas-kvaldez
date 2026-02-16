import React, { useState } from 'react';

interface BookProps {
    onOpen: () => void;
    children?: React.ReactNode;
    coverColor?: string;
    senderName?: string;
}

const BookOpen: React.FC<BookProps> = ({ onOpen, children, coverColor = '#F5E6D3', senderName }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDone, setIsDone] = useState(false);

    const handleClick = () => {
        if (isOpen) return;
        setIsOpen(true);
        setTimeout(() => {
            setIsDone(true);
            onOpen();
        }, 2200); // Allow time for reading then transition
    };

    return (
        <div style={{
            position: 'absolute', inset: 0, zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backgroundColor: '#000',
            opacity: isDone ? 0 : 1,
            pointerEvents: isDone ? 'none' : 'auto',
            transition: 'opacity 0.8s ease-out',
            perspective: '1500px'
        }}>
            <div
                onClick={handleClick}
                style={{
                    width: 'min(90vw, 400px)',
                    aspectRatio: '0.7/1',
                    position: 'relative',
                    transformStyle: 'preserve-3d',
                    transition: 'transform 1s',
                    cursor: isOpen ? 'default' : 'pointer',
                    transform: isOpen ? 'translateX(50%)' : 'translateX(0)', // Center the "open" book
                }}
            >
                {/* RIGHT COVER (The part that opens) */}
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundColor: coverColor,
                    transformOrigin: 'left',
                    transformStyle: 'preserve-3d',
                    transition: 'transform 1.5s cubic-bezier(0.25, 1, 0.5, 1)',
                    transform: isOpen ? 'rotateY(-180deg)' : 'rotateY(0deg)',
                    zIndex: 10,
                    boxShadow: isOpen ? '-5px 10px 20px rgba(0,0,0,0.1)' : '5px 10px 30px rgba(0,0,0,0.3)',
                    borderRadius: '0 5px 5px 0'
                }}>
                    {/* Front of Cover */}
                    {!isOpen && (
                        <div style={{
                            position: 'absolute', inset: 0,
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            backfaceVisibility: 'hidden',
                            border: '1px solid rgba(0,0,0,0.1)'
                        }}>
                            <h2 style={{
                                fontFamily: "'Playfair Display', serif", fontSize: '2rem',
                                color: '#333', textAlign: 'center', padding: '1rem'
                            }}>
                                {senderName || 'Invitación'}
                            </h2>
                            <div style={{ fontSize: '0.8rem', letterSpacing: '3px', textTransform: 'uppercase', color: '#666' }}>
                                Abrir
                            </div>
                        </div>
                    )}

                    {/* Back of Cover (Inside Left when open) */}
                    <div style={{
                        position: 'absolute', inset: 0,
                        backgroundColor: '#fff',
                        transform: 'rotateY(180deg)',
                        backfaceVisibility: 'hidden',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: 'inset -10px 0 20px -10px rgba(0,0,0,0.1)' // Shadow near spine
                    }}>
                        <div style={{ padding: '2rem', textAlign: 'center', fontStyle: 'italic', color: '#888' }}>
                            "El amor es paciente, es bondadoso..."
                        </div>
                    </div>
                </div>

                {/* BACK COVER (The static part / Inside Right) */}
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundColor: '#fff',
                    zIndex: 1,
                    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    borderRadius: '0 5px 5px 0' // Matches shape when closed
                    // Note: In a real book, this would be the right page.
                    // But effectively we place content here.
                }}>
                    <div style={{
                        width: '100%', height: '100%',
                        overflow: 'hidden',
                        opacity: isOpen ? 1 : 0,
                        transition: 'opacity 0.5s ease 0.5s'
                    }}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookOpen;
