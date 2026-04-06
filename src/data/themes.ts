export interface Theme {
    id: string;
    name: string;
    color: string;
    accent: string;
    bg?: string;
    backgroundImage?: string;
    borderStyle?: string;
    contentOverlay?: string; // New: For readability (e.g., semi-transparent white box)
    overlayColor?: string; // Default overlay color
    overlayOpacity?: number; // Default overlay opacity
    layout?: 'scroll' | 'slider' | 'classic' | 'modern'; // Preferred layout
    font?: string;
    blur?: number; // Default blur amount (0-20)
    saturation?: number; // Default saturation percentage (0-100)
}

export const THEMES: Theme[] = [
    {
        id: 'botanical',
        name: 'Jardín Suave (Blur)',
        color: '#2e4a3b',
        accent: '#e8f5e9',
        bg: '#eff7f2',
        // Flatlay of eucalyptus leaves (Nature design)
        backgroundImage: 'url("https://images.unsplash.com/photo-1544131562-b131df33a18a?q=80&w=2000&auto=format&fit=crop")',
        contentOverlay: 'rgba(255, 255, 255, 0.85)',
        overlayColor: '#ffffff',
        overlayOpacity: 0.85,
        layout: 'scroll',
        borderStyle: 'double 1px #2e4a3b',
        blur: 2,
        saturation: 90
    },
    {
        id: 'kraft',
        name: 'Bosque Misterioso (Noir)',
        color: '#3e2723',
        accent: '#d7ccc8',
        bg: '#d7ccc8',
        // Dark moody forest (Landscape) - No furniture
        backgroundImage: 'url("https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=2000&auto=format&fit=crop")',
        contentOverlay: 'rgba(255, 255, 255, 0.9)',
        overlayColor: '#ffffff',
        overlayOpacity: 0.9,
        layout: 'classic',
        borderStyle: 'dashed 2px #5d4037',
        blur: 4,
        saturation: 60
    },
    {
        id: 'marble-gold',
        name: 'Mármol Elegante (B&N)',
        color: '#111111',
        accent: '#f9f9f9',
        bg: '#ffffff',
        // Marble Texture (Texture)
        backgroundImage: 'url("https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=2000&auto=format&fit=crop")',
        contentOverlay: 'rgba(255, 255, 255, 0.85)',
        overlayColor: '#ffffff',
        overlayOpacity: 0.85,
        layout: 'classic',
        borderStyle: 'solid 3px #d4af37',
        blur: 0,
        saturation: 0
    },
    {
        id: 'navy',
        name: 'Cielo Estelar (Vívido)',
        color: '#ffffff',
        accent: '#1a237e',
        bg: '#000051',
        // Starry Night Sky (Landscape)
        backgroundImage: 'url("https://images.unsplash.com/photo-1519681393798-38e43269d877?q=80&w=2000&auto=format&fit=crop")',
        contentOverlay: 'rgba(10, 10, 40, 0.65)',
        overlayColor: '#0a0a28',
        overlayOpacity: 0.65,
        layout: 'slider',
        borderStyle: 'double 1px rgba(255,255,255,0.3)',
        blur: 3,
        saturation: 100
    },
    {
        id: 'vintage',
        name: 'Recuerdos (Vintage)',
        color: '#4e342e',
        accent: '#efebe9',
        bg: '#d7ccc8',
        // User's Scrapbook Image
        backgroundImage: 'url("/themes/vintage-scrapbook.jpg")',
        contentOverlay: 'rgba(255, 250, 240, 0.85)',
        overlayColor: '#fffaf0',
        overlayOpacity: 0.85,
        layout: 'scroll',
        borderStyle: 'none',
        blur: 2,
        saturation: 50
    },
    {
        id: 'roses',
        name: 'Rosas de Ensueño (Blur)',
        color: '#880e4f',
        accent: '#fce4ec',
        bg: '#fff0f5',
        // Soft roses texture/flatlay (Nature design)
        backgroundImage: 'url("https://images.unsplash.com/photo-1559563362-c667ba5f5480?q=80&w=2000&auto=format&fit=crop")',
        contentOverlay: 'rgba(255, 255, 255, 0.85)',
        overlayColor: '#ffffff',
        overlayOpacity: 0.85,
        layout: 'scroll',
        borderStyle: 'solid 1px #f48fb1',
        blur: 5,
        saturation: 80
    },
    {
        id: 'minimal',
        name: 'Minimal B&N',
        color: '#212121',
        accent: '#ffffff',
        bg: '#ffffff',
        // White Paper Texture close up (Texture)
        backgroundImage: 'url("https://images.unsplash.com/photo-1525795460596-3c07e0dfd6f6?q=80&w=2000&auto=format&fit=crop")',
        contentOverlay: 'rgba(255, 255, 255, 0.8)',
        overlayColor: '#ffffff',
        overlayOpacity: 0.8,
        layout: 'modern',
        borderStyle: 'solid 1px #eeeeee',
        blur: 0,
        saturation: 0
    },
    {
        id: 'industrial',
        name: 'Urbano Desaturado',
        color: '#37474f',
        accent: '#cfd8dc',
        bg: '#eceff1',
        // Dark Stone/Concrete Texture (Texture)
        backgroundImage: 'url("https://images.unsplash.com/photo-1515263487990-61b07816b324?q=80&w=2000&auto=format&fit=crop")',
        contentOverlay: 'rgba(255, 255, 255, 0.85)',
        overlayColor: '#ffffff',
        overlayOpacity: 0.85,
        layout: 'modern',
        borderStyle: 'solid 2px #bcaaa4',
        blur: 1,
        saturation: 40
    },
    {
        id: 'boho',
        name: 'Atardecer Cálido',
        color: '#bf360c',
        accent: '#fff3e0',
        bg: '#ffccbc',
        // Wheat Field Landscape (Landscape)
        backgroundImage: 'url("https://images.unsplash.com/photo-1469502758178-5a49826a761e?q=80&w=2000&auto=format&fit=crop")',
        contentOverlay: 'rgba(255, 255, 255, 0.85)',
        overlayColor: '#ffffff',
        overlayOpacity: 0.85,
        layout: 'scroll',
        borderStyle: 'solid 1px #ff7043',
        blur: 3,
        saturation: 90
    },
    {
        id: 'classic',
        name: 'Gold (Nítido)',
        color: '#3e2723',
        accent: '#fff8e1',
        bg: '#fff8e1',
        // Cream/Gold Paper Texture
        backgroundImage: 'url("https://images.unsplash.com/photo-1628148973686-2244f6f87ad3?auto=format&fit=crop&w=1080")',
        contentOverlay: 'rgba(255, 255, 255, 0.85)',
        overlayColor: '#ffffff',
        overlayOpacity: 0.85,
        layout: 'classic',
        borderStyle: 'double 3px #d4af37',
        blur: 0,
        saturation: 100
    }
];

export const getThemeById = (id: string): Theme => {
    return THEMES.find(t => t.id === id) || THEMES[0];
};

export const getThemeColor = (id?: string): string => {
    return getThemeById(id || 'gold').color;
};
