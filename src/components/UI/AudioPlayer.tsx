import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface AudioPlayerProps {
    isPlaying: boolean;
    src?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ isPlaying, src }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [muted, setMuted] = useState(false);

    // Default romantic song (Royalty Free) - "Bridal Chorus" or similar
    // Using a reliable placeholder for now.
    const defaultSrc = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

    useEffect(() => {
        if (isPlaying && audioRef.current) {
            // Browser policy usually requires interaction first, 
            // but the envelope click counts as interaction!
            audioRef.current.play().catch(e => console.log("Audio play failed (likely policy):", e));
        }
    }, [isPlaying]);

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !muted;
            setMuted(!muted);
        }
    };

    if (!isPlaying) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 100,
            backgroundColor: 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(5px)',
            borderRadius: '50%',
            padding: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }} onClick={toggleMute}>
            <audio ref={audioRef} src={src || defaultSrc} loop />
            {muted ? <VolumeX size={20} color="#555" /> : <Volume2 size={20} color="#555" />}
        </div>
    );
};

export default AudioPlayer;
