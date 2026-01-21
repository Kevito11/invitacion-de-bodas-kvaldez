import React, { useState } from 'react';
import { Heart } from 'lucide-react';

interface EnvelopeProps {
    onOpen: () => void;
    senderName?: string;
}

const Envelope: React.FC<EnvelopeProps> = ({ onOpen, senderName }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isVanishing, setIsVanishing] = useState(false);

    const handleOpen = () => {
        setIsOpen(true);
        setTimeout(() => {
            onOpen();
            // Start vanishing animation after open triggers content show
            setIsVanishing(true);
        }, 1000);
    };

    if (isVanishing) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#2D2A26',
            zIndex: 1000,
            transition: 'opacity 0.8s ease',
            opacity: isOpen ? 0 : 1
        }}>
            <div
                onClick={handleOpen}
                style={{
                    width: '300px',
                    height: '200px',
                    backgroundColor: '#F5E6D3', // Champagne envelope color
                    position: 'relative',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                    transform: isOpen ? 'scale(1.5) translateY(50px)' : 'scale(1)',
                    transition: 'all 0.8s ease'
                }}
            >
                {/* Flap */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: 0,
                    height: 0,
                    borderLeft: '150px solid transparent',
                    borderRight: '150px solid transparent',
                    borderTop: '110px solid #E8D5B5', // Darker shade for flap
                    transformOrigin: 'top',
                    transform: isOpen ? 'rotateX(180deg)' : 'rotateX(0deg)',
                    transition: 'transform 0.6s ease',
                    zIndex: 10
                }}></div>

                {/* Wax Seal */}
                <div style={{
                    position: 'absolute',
                    top: '40%',
                    zIndex: 20,
                    width: '50px',
                    height: '50px',
                    backgroundColor: '#C41E3A',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                    border: '2px solid #A01830',
                    transition: 'opacity 0.3s ease',
                    opacity: isOpen ? 0 : 1
                }}>
                    <Heart color="#fff" size={24} fill="#fff" />
                </div>

                <h2 style={{
                    position: 'absolute',
                    bottom: '20px',
                    width: '100%',
                    textAlign: 'center',
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '1.2rem',
                    color: '#5D4037',
                    opacity: isOpen ? 0 : 1,
                    transition: 'opacity 0.3s ease'
                }}>
                    {senderName || 'Una Invitación Especial'}
                </h2>
            </div>
        </div>
    );
};

export default Envelope;
