import React from 'react';

interface MobileMockupProps {
    children: React.ReactNode;
    scale?: number;
}

const MobileMockup: React.FC<MobileMockupProps> = ({ children, scale = 1 }) => {
    return (
        <div style={{
            width: '360px',
            height: '740px',
            backgroundColor: '#fff',
            borderRadius: '35px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.15), 0 0 0 8px #2d2a26 inset',
            overflow: 'hidden',
            position: 'relative',
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
            margin: '0 auto',
            border: '4px solid #e0e0e0' // Outer bezel hint
        }}>
            {/* Notch */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '150px',
                height: '25px',
                backgroundColor: '#2d2a26',
                borderBottomLeftRadius: '16px',
                borderBottomRightRadius: '16px',
                zIndex: 20
            }}></div>

            {/* Screen Content */}
            <div style={{
                width: '100%',
                height: '100%',
                overflowY: 'hidden',
                msOverflowStyle: 'none'  // Hide scrollbar for IE/Edge
            }}>
                {children}
                {/* Hide scrollbar for Chrome/Safari */}
                <style>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
            </div>
        </div>
    );
};

export default MobileMockup;
