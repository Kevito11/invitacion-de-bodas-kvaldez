import React, { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from 'react';
import { useAuth } from './AuthContext';

interface EventData {
    id: string;
    partner1: string;
    partner2: string;
    date: string;
    location: string;
    imageUrl?: string;
    [key: string]: any;
}

interface EventsContextType {
    events: EventData[];
    loading: boolean;
    fetchEvents: () => void;
    deleteEvents: (ids: string[]) => void;
    updateEvent: (event: EventData) => void;
    clearAllEvents: () => void;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export const EventsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [events, setEvents] = useState<EventData[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchEvents = useCallback(() => {
        if (!user?.username) {
            setEvents([]);
            setLoading(false);
            return;
        }

        const rawData = localStorage.getItem(`events_${user.username}`);
        if (rawData) {
            try {
                const parsedEvents = JSON.parse(rawData);
                if (Array.isArray(parsedEvents)) {
                    setEvents(parsedEvents);
                } else {
                    setEvents([]);
                }
            } catch (e) {
                console.error("Error parsing events from localStorage", e);
                setEvents([]);
            }
        } else {
            // Fallback for legacy single event
            const oldData = localStorage.getItem(`invitation_${user.username}`);
            if (oldData) {
                try {
                    const parsed = JSON.parse(oldData);
                    // Standardize structure if needed, or just push it
                    // Assuming legacy data is compatible enough for now or we just treat it as one item
                    setEvents([{ ...parsed, id: parsed.id || 'legacy' }]);
                } catch (e) {
                    setEvents([]);
                }
            } else {
                setEvents([]);
            }
        }
        setLoading(false);
    }, [user]);

    // Initial fetch
    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const deleteEvents = (ids: string[]) => {
        if (!user?.username) return;

        const updatedEvents = events.filter(ev => !ids.includes(ev.id));
        setEvents(updatedEvents);
        localStorage.setItem(`events_${user.username}`, JSON.stringify(updatedEvents));
    };

    const clearAllEvents = () => {
        if (!user?.username) return;
        setEvents([]);
        localStorage.removeItem(`events_${user.username}`);
        localStorage.removeItem(`invitation_${user.username}`); // Also clear legacy
    };

    const updateEvent = (updatedEvent: EventData) => {
        if (!user?.username) return;

        const updatedEvents = events.map(ev => ev.id === updatedEvent.id ? updatedEvent : ev);
        setEvents(updatedEvents);
        localStorage.setItem(`events_${user.username}`, JSON.stringify(updatedEvents));
    };

    return (
        <EventsContext.Provider value={{ events, loading, fetchEvents, deleteEvents, updateEvent, clearAllEvents }}>
            {children}
        </EventsContext.Provider>
    );
};

export const useEvents = () => {
    const context = useContext(EventsContext);
    if (context === undefined) {
        throw new Error('useEvents must be used within an EventsProvider');
    }
    return context;
};
