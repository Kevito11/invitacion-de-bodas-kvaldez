import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Plus } from 'lucide-react';
import EventsTable from './EventsTable';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const { colors } = useTheme();

    return (
        <div style={{ fontFamily: "'Montserrat', sans-serif" }}>

            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '3rem 2rem' }}>

                {/* Dashboard Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
                    <div>
                        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', fontWeight: 700, color: colors.text, margin: '0 0 0.5rem' }}>
                            Mis Eventos
                        </h1>
                        <p style={{ color: colors.muted, fontSize: '1rem' }}>Gestiona tus diseños y lista de invitados.</p>
                    </div>
                    <button
                        onClick={() => navigate('/create')}
                        style={{
                            backgroundColor: '#E6BEAE', color: 'white',
                            padding: '0.8rem 1.8rem', borderRadius: '50px',
                            border: 'none', cursor: 'pointer', fontWeight: 600,
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            boxShadow: '0 4px 10px rgba(230, 190, 174, 0.4)',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <Plus size={18} /> Crear Nuevo
                    </button>
                </div>

                {/* Events Table View */}
                <EventsTable />

            </div>
        </div>
    );
};

export default Dashboard;
