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
        description: 'Elegancia atemporal con detalles dorados y estructura clásica.',
        settings: {
            theme: 'classic',
            font: 'greatvibes',
            layout: 'classic',
            design: {
                overlayOpacity: 0.1,
                borderStyle: 'gold-frame'
            },
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
            theme: 'roses',
            font: 'alexbrush',
            layout: 'scroll',
            design: {
                overlayOpacity: 0.8,
                overlayColor: '#fff0f5'
            },
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
            theme: 'botanical',
            font: 'dancing',
            layout: 'scroll',
            design: {
                overlayOpacity: 0.85,
                overlayColor: '#ffffff'
            },
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
        name: 'Noche Estelar',
        description: 'Sofisticado y profundo, ideal para eventos de noche.',
        settings: {
            theme: 'navy',
            font: 'pinyon',
            layout: 'slider',
            design: {
                overlayOpacity: 0.7,
                overlayColor: '#0a0a28',
                primaryColor: '#ffffff'
            },
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
        id: 'boho-chic',
        name: 'Boho Chic',
        description: 'Cálido y acogedor, con tonos tierra y estilo libre.',
        settings: {
            theme: 'boho',
            font: 'parisienne',
            layout: 'scroll',
            design: {
                overlayOpacity: 0.8,
                overlayColor: '#fff3e0'
            },
            envelope: {
                enabled: true,
                type: 'classic',
                material: 'paper',
                color: '#D2691E',
                finish: 'matte'
            }
        }
    }
];
