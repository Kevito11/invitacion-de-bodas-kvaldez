
export interface DressCode {
    id: string;
    label: string;
    description: string;
    imageUrl: string;
}

export const DRESS_CODES: DressCode[] = [
    {
        id: 'Formal',
        label: 'Formal',
        description: 'Traje oscuro y corbata para ellos, vestido largo o de noche para ellas.',
        imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop' // Clear couple in formal wear
    },
    {
        id: 'SemiFormal',
        label: 'Semi-Formal',
        description: 'Traje sin corbata o pantalón de vestir y camisa. Vestido cóctel o traje sastre.',
        imageUrl: 'https://images.unsplash.com/photo-1551590192-8070a16d9f67?q=80&w=800&auto=format&fit=crop' // Stylish couple walking/standing
    },
    {
        id: 'CocktailCasual',
        label: 'Coctel / Casual',
        description: 'Vestimenta relajada pero elegante. Guayaberas, camisas de lino, vestidos cortos o faldas.',
        imageUrl: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?q=80&w=800&auto=format&fit=crop' // Casual aesthetic couple
    },
    {
        id: 'Rigurosa',
        label: 'Etiqueta Rigurosa',
        description: 'Frac o esmoquin para ellos. Vestido largo de gala para ellas.',
        imageUrl: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=800&auto=format&fit=crop' // High fashion formal
    },
    {
        id: 'Playa',
        label: 'Playa / Guayabera',
        description: 'Ropa fresca, colores claros, lino. Guayaberas y vestidos vaporosos. Sin tacones aguja.',
        imageUrl: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=800&auto=format&fit=crop' // Beachy couple
    }
];

export const getDressCodeById = (id: string | undefined): DressCode | undefined => {
    return DRESS_CODES.find(dc => dc.id === id || dc.label === id);
};
