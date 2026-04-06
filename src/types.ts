export interface InvitationData {
    id?: string;
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
    layout?: 'scroll' | 'slider' | 'classic'; // Visual structure of the invitation
    animationStyle?: 'fade' | 'slide' | 'zoom' | 'none'; // Dynamic entry animations
    maxCapacity?: number; // Total guest limit/plan
    customTags?: string[]; // User-defined tags for guests
    selectedTag?: string; // The specific tag selected for this invitation (e.g. VIP, Family)
    envelope?: {
        enabled: boolean;
        type: 'classic' | 'pointed' | 'square' | 'rounded';
        material: 'paper' | 'linen' | 'velvet' | 'cardstock' | 'vintage';
        color: string;
        finish?: 'matte' | 'glossy' | 'metallic';
        openingStyle?: 'envelope' | 'book' | 'crumple';
        liner?: {
            type: 'color' | 'image' | 'upload';
            value: string; // Hex color or Image URL
        };
        stamp?: {
            enabled: boolean;
            url?: string; // Custom stamp image URL
        };
        seal?: {
            enabled: boolean;
            color: string;
            text?: string; // Initials (max 2 chars)
            type?: 'wax' | 'sticker';
        };
    };
    design?: {
        backgroundColor?: string;
        backgroundImage?: string;
        overlayOpacity?: number;
        overlayColor?: string; // New: Custom overlay color
        borderStyle?: 'none' | 'solid' | 'double' | 'gold-frame' | 'floral';
        borderColor?: string;
        corners?: 'square' | 'rounded';
        primaryColor?: string; // Main Text Color
        secondaryColor?: string; // Accent/Names Color
        font?: string; // Heading Font
        bodyFont?: string; // Body Font
        title?: string; // Short phrase or title
        contentOverlay?: string; // CSS color/opacity string for readability container
        blur?: number; // Background blur in px (0-10)
        saturation?: number; // Background saturation in % (0-100)
    };
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
    groupId?: string; // ID linking family members
    tags?: string[]; // Groups like "Family", "Work", "VIP"
    message?: string; // Message from guest
}
