import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
    const [show, setShow] = useState(isOpen);

    useEffect(() => {
        if (isOpen) setShow(true);
        else setTimeout(() => setShow(false), 300); // Wait for animation
    }, [isOpen]);

    if (!show) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            opacity: isOpen ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
            pointerEvents: isOpen ? 'auto' : 'none'
        }}>
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    backdropFilter: 'blur(4px)'
                }}
            />

            {/* Modal Content */}
            <div style={{
                backgroundColor: '#fff',
                borderRadius: '20px',
                padding: '2rem',
                width: '90%',
                maxWidth: '500px',
                position: 'relative',
                zIndex: 1001,
                transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
                transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '1.5rem',
                        right: '1.5rem',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#666'
                    }}
                >
                    <X size={24} />
                </button>

                {title && (
                    <h3 style={{
                        marginTop: 0,
                        marginBottom: '1.5rem',
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '1.8rem',
                        color: '#2D2A26'
                    }}>
                        {title}
                    </h3>
                )}

                <div>{children}</div>
            </div>
        </div>
    );
};

export default Modal;
