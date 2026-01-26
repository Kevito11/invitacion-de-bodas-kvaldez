import React from 'react';
import type { InvitationData } from '../../types';
import GuestManager from '../GuestManager';

interface StepProps {
    data: InvitationData;
    onChange: (field: keyof InvitationData, value: any) => void;
}

const StepGuests: React.FC<StepProps> = ({ data, onChange }) => {
    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', animation: 'fadeIn 0.5s ease-in' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.5rem', color: '#111827' }}>Lista de Invitados</h2>
            <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                Gestiona quiénes asistirán a tu evento. Puedes crear grupos familiares para enviar una sola invitación por familia.
            </p>

            <div style={{ flex: 1, overflow: 'hidden', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #eee', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                <GuestManager
                    guests={data.guests || []}
                    onUpdateGuests={(newGuests) => onChange('guests', newGuests)}
                    invitationUrl={window.location.origin + '/invitacion'} // Base URL, ID appended inside manager for preview
                    mode="design"
                />
            </div>
        </div>
    );
};

export default StepGuests;
