import React from 'react';
import type { InvitationData } from '../../types';
import InvitationPreview from '../InvitationPreview';

interface StepProps {
    data: InvitationData;
    onChange: (field: keyof InvitationData, value: any) => void;
}

const StepDetails: React.FC<StepProps> = ({ data, onChange }) => {
    const inputStyle = {
        width: '100%',
        padding: '0.8rem',
        border: '1px solid #ddd',
        borderRadius: '8px',
        fontSize: '0.95rem',
        outline: 'none',
        transition: 'border-color 0.2s',
        backgroundColor: '#FAFAF9'
    };

    const labelStyle = {
        display: 'block',
        fontSize: '0.9rem',
        fontWeight: 600,
        marginBottom: '0.5rem',
        color: '#333'
    };

    const groupStyle = {
        marginBottom: '1.5rem'
    };

    return (
        <div style={{ display: 'flex', height: '100%', animation: 'fadeIn 0.5s ease-in' }}>

            {/* Left Column: Form (Scrollable) */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '2rem 3rem', backgroundColor: 'white', borderRight: '1px solid #E5E7EB' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '2rem', color: '#111827' }}>Detalles del Evento</h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div>
                        <label style={labelStyle}>Novio/a 1</label>
                        <input
                            type="text"
                            value={data.partner1}
                            onChange={(e) => onChange('partner1', e.target.value)}
                            style={inputStyle}
                            placeholder="Nombre"
                        />
                    </div>
                    <div>
                        <label style={labelStyle}>Novio/a 2</label>
                        <input
                            type="text"
                            value={data.partner2}
                            onChange={(e) => onChange('partner2', e.target.value)}
                            style={inputStyle}
                            placeholder="Nombre"
                        />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div>
                        <label style={labelStyle}>Fecha</label>
                        <input
                            type="date"
                            value={data.date}
                            onChange={(e) => onChange('date', e.target.value)}
                            style={inputStyle}
                        />
                    </div>
                    <div>
                        <label style={labelStyle}>Hora</label>
                        <input
                            type="time"
                            value={data.time}
                            onChange={(e) => onChange('time', e.target.value)}
                            style={inputStyle}
                        />
                    </div>
                </div>

                <div style={groupStyle}>
                    <label style={labelStyle}>Lugar del Evento</label>
                    <input
                        type="text"
                        value={data.venueName}
                        onChange={(e) => onChange('venueName', e.target.value)}
                        style={{ ...inputStyle, marginBottom: '0.8rem' }}
                        placeholder="Nombre del Salón / Iglesia"
                    />
                    <input
                        type="text"
                        value={data.venueAddress}
                        onChange={(e) => onChange('venueAddress', e.target.value)}
                        style={inputStyle}
                        placeholder="Dirección completa"
                    />
                </div>

                <div style={groupStyle}>
                    <label style={labelStyle}>Mensaje de Bienvenida</label>
                    <textarea
                        value={data.message}
                        onChange={(e) => onChange('message', e.target.value)}
                        rows={4}
                        style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
                        placeholder="Escribe un mensaje bonito para tus invitados..."
                    />
                </div>

                <div style={groupStyle}>
                    <label style={labelStyle}>Código de Vestimenta</label>
                    <select
                        value={data.dressCode}
                        onChange={(e) => onChange('dressCode', e.target.value)}
                        style={{ ...inputStyle, marginBottom: '0.8rem' }}
                    >
                        <option value="Formal">Formal</option>
                        <option value="Semiformal">Semiformal</option>
                        <option value="Cocktail">Cocktail</option>
                        <option value="Casual">Casual</option>
                    </select>
                    <textarea
                        value={data.dressCodeDetails}
                        onChange={(e) => onChange('dressCodeDetails', e.target.value)}
                        rows={2}
                        style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
                        placeholder="Detalles adicionales (opcional)"
                    />
                </div>
            </div>

            {/* Right Column: Preview (Fixed) */}
            <div style={{ flex: 1, backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <div style={{
                    width: '375px', // Mobile Width
                    height: '667px', // Mobile Height
                    backgroundColor: 'white',
                    transform: 'scale(0.85)',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
                    borderRadius: '8px',
                    overflow: 'hidden'
                }}>
                    <InvitationPreview data={data} />
                </div>
            </div>

        </div>
    );
};

export default StepDetails;
