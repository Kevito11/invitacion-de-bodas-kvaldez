import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
    children: React.ReactNode;
    className?: string;
    threshold?: number;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({ children, className = '', threshold = 0.1 }) => {
    const [isVisible, setIsVisible] = useState(false);
    const domRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                // Toggle visibility based on intersection
                // This will animate both when scrolling down (revealing) and scrolling up
                if (entry.isIntersecting) {
                    setIsVisible(true);
                } else {
                    // Optional: Uncomment the next line if you want it to hide again when scrolling away
                    // This creates the "animate every time" effect requested by the user
                    setIsVisible(false);
                }
            });
        }, {
            threshold: threshold,
            rootMargin: '0px 0px -50px 0px' // Slightly offset so it triggers before bottom of screen
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
    }, [threshold]);

    return (
        <div
            ref={domRef}
            className={`reveal-on-scroll ${isVisible ? 'is-visible' : ''} ${className}`}
        >
            {children}
        </div>
    );
};

export default ScrollReveal;
