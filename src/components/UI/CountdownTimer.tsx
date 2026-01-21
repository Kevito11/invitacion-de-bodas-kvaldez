import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
    targetDate: string; // ISO string "YYYY-MM-DD" or similar
    time?: string; // "HH:MM"
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate, time = '00:00' }) => {
    const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const eventTime = new Date(`${targetDate}T${time}:00`);
            const now = new Date();
            const difference = eventTime.getTime() - now.getTime();

            if (difference > 0) {
                return {
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                };
            } else {
                return null; // Event passed
            }
        };

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        setTimeLeft(calculateTimeLeft()); // Initial call

        return () => clearInterval(timer);
    }, [targetDate, time]);

    if (!timeLeft) return null;

    return (
        <div className="animate-fade-in" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', margin: '2rem 0', flexWrap: 'wrap' }}>
            <TimeUnit value={timeLeft.days} label="Días" />
            <TimeUnit value={timeLeft.hours} label="Horas" />
            <TimeUnit value={timeLeft.minutes} label="Min" />
            <TimeUnit value={timeLeft.seconds} label="Seg" />
        </div>
    );
};

const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{
            fontSize: '1.5rem',
            fontWeight: '300',
            color: '#444',
            minWidth: '2ch',
            textAlign: 'center',
            fontFamily: "'Playfair Display', serif"
        }}>
            {String(value).padStart(2, '0')}
        </div>
        <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#888', letterSpacing: '1px' }}>
            {label}
        </div>
    </div>
);

export default CountdownTimer;
