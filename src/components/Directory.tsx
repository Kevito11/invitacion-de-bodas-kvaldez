import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { HelpCircle, Filter, Search, ChevronDown, CheckSquare } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Directory: React.FC = () => {
    const { user } = useAuth();
    const { colors, theme } = useTheme();

    const [contacts] = useState([
        { id: 1, name: 'Absalon Kelly +3 enlazado', email: '', status: '' },
        { id: 2, name: 'Absalon Kelly', email: '', status: 'Ya añadido' },
        { id: 3, name: 'Ana Barett de Kelly', email: '', status: 'Ya añadido' },
        { id: 4, name: 'Samuel Kelly', email: '', status: 'Ya añadido' },
        { id: 5, name: 'Luis David Kelly', email: '', status: 'Ya añadido' },
        { id: 6, name: 'Adeliano Barett', email: '', status: 'Ya añadido' },
        { id: 7, name: 'Adrian Vallejo', email: '', status: 'Ya añadido' },
    ]);

    return (
        <div style={{ padding: '2rem 3rem', fontFamily: "'Montserrat', sans-serif", maxWidth: '1400px', margin: '0 auto', color: colors.text }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.2rem', color: colors.text, margin: 0 }}>
                        Directorio
                    </h1>
                    <HelpCircle size={16} color={colors.text} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '0.85rem', color: colors.muted }}>Agregando a:</span>
                    <div style={{
                        border: `1px solid ${colors.border}`, padding: '0.5rem 1rem', borderRadius: '4px',
                        backgroundColor: colors.cardBg, display: 'flex', alignItems: 'center', gap: '2rem',
                        fontSize: '0.9rem', color: colors.text, cursor: 'pointer'
                    }}>
                        Boda de {user?.username} <ChevronDown size={14} />
                    </div>
                </div>
            </div>

            {/* Subheader Link */}
            <div style={{ marginBottom: '2rem', fontSize: '0.9rem', color: theme === 'dark' ? '#34D399' : '#047857' }}>
                ¿Necesita agregar un contacto? <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Ir a la página 'Entrega'</span>
            </div>

            {/* Action Bar */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.8rem', color: colors.muted, marginRight: 'auto', alignSelf: 'center' }}>
                    <CheckSquare size={14} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px' }} /> Se guardaron todos los cambios
                </span>

                <button style={{
                    backgroundColor: theme === 'dark' ? '#059669' : '#86CBA0', color: 'white', border: 'none',
                    padding: '0.8rem 1.5rem', borderRadius: '4px', fontWeight: 700, fontSize: '0.8rem',
                    cursor: 'pointer', letterSpacing: '1px'
                }}>
                    AGREGAR PERSONAS SELECCIONADAS A SU ENVÍO
                </button>
            </div>

            {/* Filters & Search */}
            <div style={{
                border: `1px solid ${colors.border}`, borderBottom: 'none', backgroundColor: theme === 'dark' ? colors.cardBg : '#F9FAFB',
                padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                borderTopLeftRadius: '4px', borderTopRightRadius: '4px'
            }}>
                <div style={{ display: 'flex' }}>
                    <button style={{
                        background: colors.cardBg, border: `1px solid ${colors.border}`, borderBottom: 'none',
                        padding: '0.5rem 1.5rem', fontWeight: 600, color: '#10B981', fontSize: '0.9rem'
                    }}>
                        Todo
                    </button>
                    <button style={{
                        background: 'none', border: 'none',
                        padding: '0.5rem 1.5rem', fontWeight: 500, color: colors.muted, fontSize: '0.9rem',
                        display: 'flex', alignItems: 'center', gap: '0.5rem'
                    }}>
                        <Filter size={14} /> Filtros personalizados
                    </button>
                    <button style={{
                        background: 'none', border: 'none',
                        padding: '0.5rem 1.5rem', fontWeight: 500, color: colors.text, fontSize: '0.9rem',
                        display: 'flex', alignItems: 'center', gap: '0.5rem'
                    }}>
                        Ver preferencias
                    </button>
                </div>

                <div style={{ position: 'relative', marginRight: '0.5rem' }}>
                    <input
                        type="text"
                        placeholder="Buscar contactos"
                        style={{
                            padding: '0.4rem 2rem 0.4rem 0.8rem', border: `1px solid ${colors.border}`,
                            borderRadius: '2px', fontSize: '0.85rem', width: '200px',
                            backgroundColor: colors.cardBg, color: colors.text
                        }}
                    />
                    <Search size={14} style={{ position: 'absolute', right: '0.6rem', top: '50%', transform: 'translateY(-50%)', color: colors.muted }} />
                </div>
            </div>

            {/* Table */}
            <div style={{ border: `1px solid ${colors.border}`, backgroundColor: colors.cardBg }}>
                {/* Header Row */}
                <div style={{
                    display: 'grid', gridTemplateColumns: '50px 1fr 1fr 150px',
                    padding: '1rem', borderBottom: `1px solid ${colors.border}`,
                    fontSize: '0.85rem', fontWeight: 700, color: colors.text
                }}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div style={{ width: '18px', height: '18px', border: `1px solid ${colors.border}`, borderRadius: '3px' }}></div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: theme === 'dark' ? '#34D399' : '#047857', cursor: 'pointer' }}>
                        Nombre <span style={{ fontSize: '0.6rem' }}>▲</span>
                    </div>
                    <div>Correo electrónico</div>
                    <div></div>
                </div>

                {/* Rows */}
                {contacts.map((contact) => (
                    <div key={contact.id} style={{
                        display: 'grid', gridTemplateColumns: '50px 1fr 1fr 150px',
                        padding: '1.2rem 1rem', borderBottom: `1px solid ${theme === 'dark' ? colors.border : '#F9FAFB'}`,
                        fontSize: '0.9rem', color: colors.text, alignItems: 'center'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <div style={{ width: '18px', height: '18px', border: `1px solid ${colors.border}`, borderRadius: '3px' }}></div>
                        </div>
                        <div style={{ fontWeight: 500 }}>{contact.name}</div>
                        <div>{contact.email}</div>
                        <div style={{ fontSize: '0.85rem', color: colors.muted }}>{contact.status}</div>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default Directory;
