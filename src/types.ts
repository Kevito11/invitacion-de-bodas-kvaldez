export interface InvitationData {
    partner1: string;
    partner2: string;
    date: string;
    time: string;
    venueName: string;
    venueAddress: string;
    message: string;
    theme: string;
    imageUrl: string;
    backgroundImageUrl?: string; // Primary background
    backgroundImages?: string[]; // Array for slideshow (optional) // New: Specific background image
    font: string;
    audioUrl?: string; // Optional
    whatsappNumber?: string; // Optional
    mapUrl?: string; // Optional Google Maps Link
    gallery?: string[]; // Optional array of image URLs
    dressCode?: string; // Optional
    dressCodeDetails?: string; // Optional specific instructions
    dressCodeInspirationUrl?: string; // Optional URL for examples
    guests?: Guest[]; // Guest list integrated into design
    mediaLibrary?: string[]; // Centralized list of uploaded/linked images
}

export type RSVPStatus = 'pending' | 'confirmed' | 'declined';

export interface Guest {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    status: RSVPStatus;
    tickets: number; // Number of people allowed/confirmed
    notes?: string;
}
