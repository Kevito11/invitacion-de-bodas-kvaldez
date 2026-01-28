import type { InvitationData } from '../types';

export interface Preset {
    id: string;
    name: string;
    description: string;
    settings: Partial<InvitationData>;
}

export const DESIGN_PRESETS: Preset[] = [
    {
        id: 'gold-luxury',
        name: 'Lujo Dorado',
        description: 'Elegancia atemporal con detalles dorados y terciopelo.',
        settings: {
            theme: 'gold',
            font: 'greatvibes',
            layout: 'classic',
            backgroundImageUrl: '', // Reset to color logic
            envelope: {
                enabled: true,
                type: 'classic',
                material: 'velvet',
                color: '#D4AF37',
                finish: 'metallic'
            }
        }
    },
    {
        id: 'rose-romantic',
        name: 'Romance Rosa',
        description: 'Suave y soñador, perfecto para bodas románticas.',
        settings: {
            theme: 'rose',
            font: 'alexbrush',
            layout: 'classic',
            backgroundImageUrl: '',
            envelope: {
                enabled: true,
                type: 'rounded',
                material: 'paper',
                color: '#E0BFB8',
                finish: 'matte'
            }
        }
    },
    {
        id: 'sage-nature',
        name: 'Naturaleza Sage',
        description: 'Fresco y orgánico, ideal para bodas al aire libre.',
        settings: {
            theme: 'sage',
            font: 'dancing',
            layout: 'scroll',
            backgroundImageUrl: '',
            envelope: {
                enabled: true,
                type: 'square',
                material: 'linen',
                color: '#8FBC8F',
                finish: 'matte'
            }
        }
    },
    {
        id: 'midnight-blue',
        name: 'Noche Azul',
        description: 'Sofisticado y profundo, para eventos de gala.',
        settings: {
            theme: 'blue',
            font: 'pinyon',
            layout: 'slider',
            backgroundImageUrl: '',
            envelope: {
                enabled: true,
                type: 'pointed',
                material: 'cardstock',
                color: '#191970',
                finish: 'glossy'
            }
        }
    },
    {
        id: 'lavender-dream',
        name: 'Sueño Lavanda',
        description: 'Delicado y mágico, con un toque de fantasía.',
        settings: {
            theme: 'lavender',
            font: 'parisienne',
            layout: 'classic',
            backgroundImageUrl: '',
            envelope: {
                enabled: true,
                type: 'classic',
                material: 'paper',
                color: '#E6E6FA',
                finish: 'matte'
            }
        }
    }
];
