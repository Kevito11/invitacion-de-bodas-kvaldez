import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
    children: React.ReactNode;
    className?: string;
    threshold?: number;
    animation?: 'fade' | 'slide' | 'zoom' | 'none';
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({ children, className = '', threshold = 0.1, animation = 'fade' }) => {
    const [isVisible, setIsVisible] = useState(false);
    const domRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (animation === 'none') {
            setIsVisible(true);
            return;
        }

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                } else {
                    // Reset to allow re-animation (optional, kept per previous logic)
                    // setIsVisible(false); 
                }
            });
        }, {
            threshold: threshold,
            rootMargin: '0px 0px -50px 0px'
        });

        const currentRef = domRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [threshold, animation]);

    const getAnimationClass = () => {
        if (animation === 'none') return '';
        switch (animation) {
            case 'slide': return 'reveal-slide';
            case 'zoom': return 'reveal-zoom';
            default: return 'reveal-on-scroll'; // Default fade/slide-up
        }
    };

    return (
        <div
            ref={domRef}
            className={`${getAnimationClass()} ${isVisible ? 'is-visible' : ''} ${className}`}
            style={{
                opacity: (animation === 'none' || isVisible) ? 1 : 0,
                // Inline override for specific animations if needed, though CSS is preferred
            }}
        >
            {children}
        </div>
    );
};

export default ScrollReveal;
